import { useState } from 'react'
import './FileDownload.css'

function FileDownload({ file }) {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      // Decode base64 content
      const binaryString = atob(file.content)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      // Create blob and download
      const blob = new Blob([bytes])
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading file:', error)
    } finally {
      setDownloading(false)
    }
  }

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase()
    const iconMap = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      xls: '📊',
      xlsx: '📊',
      ppt: '🎯',
      pptx: '🎯',
      txt: '📋',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️',
      gif: '🖼️',
      zip: '🗜️',
      rar: '🗜️',
      ai: '🎨',
      svg: '🎨',
      mp4: '🎬',
      mp3: '🎵',
    }
    return iconMap[ext] || '📎'
  }

  const formatFileSize = (filename) => {
    // Estimate size from base64 content
    const estimatedBytes = (file.content.length * 3) / 4
    if (estimatedBytes < 1024) return `${Math.round(estimatedBytes)} B`
    if (estimatedBytes < 1024 * 1024) return `${(estimatedBytes / 1024).toFixed(1)} KB`
    return `${(estimatedBytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="file-download">
      <div className="file-info">
        <span className="file-icon">{getFileIcon(file.name)}</span>
        <div className="file-details">
          <div className="file-name">{file.name}</div>
          <div className="file-size">{formatFileSize(file.name)}</div>
        </div>
      </div>
      <button
        className={`download-btn ${downloading ? 'downloading' : ''}`}
        onClick={handleDownload}
        disabled={downloading}
        title="Download file"
      >
        {downloading ? '⟳' : '⬇'}
      </button>
    </div>
  )
}

export default FileDownload
