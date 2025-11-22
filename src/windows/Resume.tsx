"use client"
import WindowWrapper from '../hoc/WindowWrapper'

function Resume() {
  return (
    <div className="resume-window">
      <div className="resume-container">
        <iframe
          src="https://ravigangwar.cv"
          className="resume-pdf"
          title="Resume"
          allow="fullscreen"
        />
      </div>
    </div>
  )
}

const ResumeWindow = WindowWrapper(Resume, "resume");
export default ResumeWindow

