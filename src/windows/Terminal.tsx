"use client"
import WindowWrapper from '../hoc/WindowWrapper'

function Terminal() {
  return (
    <div className="terminal-window">
      <div className="terminal-container bg-black">
        <iframe
          src="https://terminal-portfolio-vert-seven.vercel.app/"
          className="terminal-iframe"
          title="Terminal Portfolio"
          allow="fullscreen"
        />
      </div>
    </div>
  )
}

const TerminalWindow = WindowWrapper(Terminal, "terminal");
export default TerminalWindow