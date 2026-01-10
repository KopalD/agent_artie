import { useState, useRef } from 'react'
import './InputArea.css'

function InputArea({ onSendMessage, onFileSelect, loading, hasFile }) {
  const [input, setInput] = useState('')
  const fileInputRef = useRef(null)

  const handleSend = () => {
    if (input.trim() && !loading) {
      onSendMessage(input)
      setInput('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  const handleFileButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="input-area">
      <div className="input-wrapper">
        <button
          className={`file-button ${hasFile ? 'active' : ''}`}
          onClick={handleFileButtonClick}
          disabled={loading}
          title="Upload a file"
        >
          📎
        </button>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept="*/*"
        />

        <textarea
          className="input-field"
          placeholder="Type your message... (Shift+Enter for new line)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          rows="1"
        />

        <button
          className={`send-button ${loading ? 'loading' : ''}`}
          onClick={handleSend}
          disabled={loading || !input.trim()}
          title="Send message"
        >
          {loading ? (
            <span className="spinner">⟳</span>
          ) : (
            '↑'
          )}
        </button>
      </div>
      <p className="input-hint">💡 Upload a file and ask questions about it</p>
    </div>
  )
}

export default InputArea
