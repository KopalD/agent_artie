import subprocess
import sys
import os
import time

from google.adk.runners import Runner
from google.adk.agents import Agent
from dotenv import load_dotenv

load_dotenv()

illustrator_path = r"C:\Program Files\Adobe\Adobe Illustrator 2025\Support Files\Contents\Windows\Illustrator.exe"
jsx_template = r"C:\Users\AZ\Documents\agnt\src.jsx"


def run_illustrator_script(ai_file, height, width):
    if not os.path.exists(ai_file):
        raise FileNotFoundError(f"AI file not found: {ai_file}")
    if not os.path.exists(jsx_template):
        raise FileNotFoundError(f"JSX template not found: {jsx_template}")

    # Read template
    with open(jsx_template, "r", encoding="utf-8") as f:
        jsx_code = f.read()

    # Prepare replacements
    replacements = {
        "{{AI_FILE_PATH}}": ai_file.replace("\\", "\\\\"),
        "{{NEW_WIDTH}}": width,
        "{{NEW_HEIGHT}}": height
    }

    # Replace placeholders
    for key, value in replacements.items():
        jsx_code = jsx_code.replace(key, str(value))

    # Write temp JSX
    temp_jsx = os.path.join(os.path.dirname(jsx_template), "_temp_run.jsx")
    with open(temp_jsx, "w", encoding="utf-8") as f:
        f.write(jsx_code)

    # Launch Illustrator
    proc = subprocess.Popen(
        [illustrator_path, "/run", temp_jsx],
        creationflags=subprocess.CREATE_NEW_CONSOLE
    )

    # Wait for script to finish
    time.sleep(20)
    proc.terminate()
    print("✅ Illustrator script executed successfully")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python run_ai_script.py <path_to_ai_file>")
        sys.exit(1)

    ai_file = os.path.abspath(sys.argv[1])
    jsx_template = r"C:\Users\AZ\Documents\agnt\src.jsx"

    run_illustrator_script(ai_file, sys.argv[2] , sys.argv[3])


# Define your root agent
root_agent = Agent(
    name="artie_agent",
    model="gemini-2.0-flash",
    description="Artie agent",
    instruction='''

**Meet Artie!**

You are Artie a your cheerful Illustrator automation buddy who loves helping with design files. When you upload an Adobe `.ai` file, Artie jumps in with excitement. You can either provide exact height and width dimensions or simply say a well‑known paper size like A4, A3, Letter, or Tabloid. Artie automatically looks up the correct measurements for those standard sizes, resizes your artwork, and outputs a polished **PDF file** back to you.

 What Artie does  
- Accepts your uploaded AI file.  
- Understands sizes:  
  - Custom dimensions: `height=400, width=800`  
  - Standard formats: Artie knows the most common paper sizes and converts them into Illustrator points.  

 Lookup Table of Standard Sizes (in points)  
- A4 → 595 × 842  
- A3 → 842 × 1191  
- Letter → 612 × 792  
- Legal → 612 × 1008  
- Tabloid → 792 × 1224  

- Runs the magic tool:  
  ```python
  def run_illustrator_script(ai_file, height, width):
      ...
  ```  
- Returns the result: A resized **PDF file**, ready to use or share.  
- Keeps it bubbly: Artie always responds with a smile and encouragement.  

 Example interactions  
- “Artie, resize `poster.ai` to 400×800 points.” → Artie runs the script and gives back `poster_resized.pdf`.  
- “Artie, make uploaded doc A4.” → Artie looks up A4 dimensions, resizes, and returns `flyer_A4.pdf`.  
etc
---

This way, anyone reading knows the workflow is **upload → resize → get PDF**.  
''',
tools=[run_illustrator_script]
)