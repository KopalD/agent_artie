import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import ChatMessage from './components/ChatMessage'
import InputArea from './components/InputArea'
import FileUploadPreview from './components/FileUploadPreview'
import './App.css'

const API_BASE_URL = 'http://localhost:8000'
const USER_ID = 'artie_user_' + Math.random().toString(36).substr(2, 9)

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'system',
      content: '✨ Welcome to Artie Chat! Upload a file and ask questions about it.',
      timestamp: new Date(),
    }
  ])
  const [sessionId, setSessionId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('user_id', USER_ID)
      if (sessionId) {
        formData.append('session_id', sessionId)
      }
      formData.append('query', messageText)

      if (selectedFile) {
        formData.append('file', selectedFile)
      }

      const response = await axios.post(`${API_BASE_URL}/query`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Update session ID if not already set
      if (!sessionId && response.data.session_id) {
        setSessionId(response.data.session_id)
      }

      // Add AI response
      const aiMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response.data.message,
        timestamp: new Date(),
        files: response.data.output_files || [],
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: error.response?.data?.detail || 'Failed to get response. Make sure the server is running on port 8000.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (file) => {
    setSelectedFile(file)
  }

  const handleFileRemove = () => {
    setSelectedFile(null)
  }

  return (
    <div className="app-container">
      <div className="app-header">
        <div className="header-content">
          <h1>🎨 Artie Chat</h1>
          <p>Your creative AI assistant</p>
        </div>
      </div>

      <div className="chat-container">
        <div className="messages-wrapper">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {loading && (
            <div className="loading-indicator">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {selectedFile && (
        <FileUploadPreview file={selectedFile} onRemove={handleFileRemove} />
      )}

      <InputArea
        onSendMessage={handleSendMessage}
        onFileSelect={handleFileSelect}
        loading={loading}
        hasFile={!!selectedFile}
      />
    </div>
  )
}

export default App
