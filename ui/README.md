# Artie Chat UI

A snazzy, ChatGPT-style chat interface for the Artie Agent API. Built with React + Vite with beautiful animations and a modern design.

## Features

✨ **Beautiful UI**
- Gradient background with glassmorphism effects
- Smooth animations and transitions
- Dark theme optimized for art-focused content

🎯 **Core Functionality**
- Real-time chat with Artie Agent
- Automatic session management (session_id sent after first request)
- Single file upload support with preview
- Base64 encoded file downloads with proper MIME type handling

💡 **User Experience**
- Loading indicators with typing animation
- File upload preview with file type detection
- One-click file downloads
- Responsive design for mobile and desktop
- Keyboard shortcuts (Shift+Enter for new line)

## Installation

```bash
cd ui
npm install
```

## Usage

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will open at `http://localhost:3000` by default.

## Configuration

The API endpoint is set to `http://localhost:8000` by default. Make sure your Artie Agent service is running on this port.

User ID is automatically generated on first load using a timestamp-based approach.

## API Integration

The chat interface connects to your Artie Agent API with the following flow:

1. **First Request**: No `session_id` sent
   - Server responds with a new `session_id`
   - UI stores this for subsequent requests

2. **Subsequent Requests**: Include the `session_id`
   - Server maintains conversation context
   - File uploads are supported

3. **File Handling**
   - Files are sent as multipart form data
   - Output files come back as base64 encoded content
   - UI provides one-click downloads

## File Structure

```
ui/
├── package.json
├── vite.config.js
├── index.html
├── src/
│   ├── main.jsx
│   ├── index.css
│   ├── App.jsx
│   ├── App.css
│   └── components/
│       ├── ChatMessage.jsx
│       ├── ChatMessage.css
│       ├── InputArea.jsx
│       ├── InputArea.css
│       ├── FileDownload.jsx
│       ├── FileDownload.css
│       ├── FileUploadPreview.jsx
│       └── FileUploadPreview.css
└── README.md
```

## Architecture

- **State Management**: React hooks (useState, useRef, useEffect)
- **API Communication**: Axios for HTTP requests
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Pure CSS with animations and glassmorphism effects

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+

## Notes

- User ID is auto-generated and persists for the session
- File uploads are limited to one file at a time (as per requirements)
- Output files are automatically downloaded as blobs
- All animations are GPU-accelerated for smooth performance
