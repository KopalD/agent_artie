import asyncio
import os
import tempfile
import base64
from typing import Optional

from dotenv import load_dotenv
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from utils import call_agent_async
from agent import root_agent
from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel


temp_dir = r"C:\Users\AZ\Documents\agnt\artie_agent\temp"
output_dir = r"C:\Users\AZ\Documents\agnt\artie_agent\temp\out"

load_dotenv()

# Database-backed session service
session_service = InMemorySessionService()

# Runner
runner = Runner(
    agent=root_agent,
    app_name="artie_agent",
    session_service=session_service
)


def create_initial_state(user_id: str) -> dict:
    """
    Create an initial session state for a user.

    Args:
        user_id: Display id for the user.

    Returns:
        A dict representing the initial session state.
    """
    filepath = None

    return {"user_id": user_id,  "filepath": filepath}


async def do_query(user_id: str, session_id: Optional[str], query: str, file_path: Optional[str] = None):
    print("Starting query process...")
    # Setup constants
    APP_NAME = "artie_agent"
    USER_ID = user_id
    SESSION_ID = session_id
    QUERY = query

    # Check for existing sessions for this user
    existing_sessions = await session_service.list_sessions(
        app_name=APP_NAME,
        user_id=USER_ID,
    )



    # If there's an existing session, use it, otherwise create a new one
    if existing_sessions and len(existing_sessions.sessions) > 0:
        # Use the most recent session
        SESSION_ID = existing_sessions.sessions[0].id
        print(f"Continuing existing session: {SESSION_ID}")
    else:
        # Create a new session with initial state
        new_session = await session_service.create_session(
            app_name=APP_NAME,
            user_id=USER_ID,
            state=create_initial_state(user_id=USER_ID),
        )
        SESSION_ID = new_session.id
        print(f"Created new session: {SESSION_ID}")

    # Update session state with file_path if provided
    if file_path:
        session = await session_service.get_session(
            app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID
        )
        if session:
            session.state["filepath"] = file_path
        QUERY += f" ai file path is: {file_path}"        


    # ===== PART 5: Interactive Conversation Loop =====

    response = await call_agent_async(runner, USER_ID, SESSION_ID, QUERY)

    return {"response": response, "session_id": SESSION_ID}


# Create FastAPI app
app = FastAPI()

@app.post("/query")
async def query_endpoint(user_id: str = Form(...), session_id: Optional[str] = Form(None), query: str = Form(...), file: Optional[UploadFile] = File(None)):
    """
    Endpoint to handle user queries by calling the existing do_query function.
    Optionally accepts a file upload, saves it to temp directory, and prints its path.

    Args:
        user_id: The ID of the user.
        session_id: Optional session ID (if not provided, will use existing or create new).
        query: The query string.
        file: Optional uploaded file.

    Returns:
        JSON response with agent response, session ID, and output files with contents (base64 encoded).
    """
    # Delete existing files in output directory
    output_dir = r"C:\Users\AZ\Documents\agnt\artie_agent\temp\out"
    if os.path.exists(output_dir):
        for filename in os.listdir(output_dir):
            file_path_to_delete = os.path.join(output_dir, filename)
            if os.path.isfile(file_path_to_delete):
                os.remove(file_path_to_delete)
                print(f"Deleted existing file: {file_path_to_delete}")

    if file:
        temp_dir = r"C:\Users\AZ\Documents\agnt\artie_agent\temp"
        os.makedirs(temp_dir, exist_ok=True)
        file_path = os.path.join(temp_dir, file.filename)
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        print(f"File saved to: {file_path}")
    
    try:
        result = await do_query(user_id, session_id, query, file_path if file else None)
        # Check for output files
        output_files = []
        if os.path.exists(output_dir):
            for filename in os.listdir(output_dir):
                file_path_out = os.path.join(output_dir, filename)
                if os.path.isfile(file_path_out):
                    with open(file_path_out, "rb") as f:
                        content = f.read()
                        encoded_content = base64.b64encode(content).decode('utf-8')
                        output_files.append({"name": filename, "content": encoded_content})
        return JSONResponse(content={
            "message": result["response"],
            "session_id": result["session_id"],
            "output_files": output_files
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
