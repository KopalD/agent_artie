import './FileUploadPreview.css'

function FileUploadPreview({ file, onRemove }) {
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

  const formatFileSize = (file) => {
    const bytes = file.size
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="file-upload-preview">
      <div className="preview-content">
        <div className="preview-icon">{getFileIcon(file.name)}</div>
        <div className="preview-info">
          <div className="preview-name">{file.name}</div>
          <div className="preview-size">{formatFileSize(file)}</div>
        </div>
        <button
          className="remove-btn"
          onClick={onRemove}
          title="Remove file"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default FileUploadPreview
