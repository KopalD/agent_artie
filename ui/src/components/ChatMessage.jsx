import { useState } from 'react'
import FileDownload from './FileDownload'
import './ChatMessage.css'

function ChatMessage({ message }) {
  const [showFiles, setShowFiles] = useState(true)

  const getMessageClass = () => {
    switch (message.type) {
      case 'user':
        return 'message-user'
      case 'assistant':
        return 'message-assistant'
      case 'system':
        return 'message-system'
      case 'error':
        return 'message-error'
      default:
        return ''
    }
  }

  const getMessageIcon = () => {
    switch (message.type) {
      case 'user':
        return '👤'
      case 'assistant':
        return '🤖'
      case 'system':
        return '⭐'
      case 'error':
        return '⚠️'
      default:
        return ''
    }
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className={`message-container ${getMessageClass()}`}>
      <div className="message-content">
        <div className="message-icon">{getMessageIcon()}</div>
        <div className="message-main">
          <div className="message-text">
            {message.content}
          </div>
          {message.files && message.files.length > 0 && (
            <div className="message-files">
              <button
                className="files-toggle"
                onClick={() => setShowFiles(!showFiles)}
              >
                📎 {message.files.length} file{message.files.length > 1 ? 's' : ''}{' '}
                <span className="toggle-icon">{showFiles ? '▼' : '▶'}</span>
              </button>
              {showFiles && (
                <div className="files-list">
                  {message.files.map((file, idx) => (
                    <FileDownload key={idx} file={file} />
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="message-time">{formatTime(message.timestamp)}</div>
        </div>
      </div>
    </div>
  )
}

export default ChatMessage
