import React, { useEffect, useRef, useState } from "react"
import { createRoot } from "react-dom/client"

import "./styles.css"

// Ideally don't hardcode your keys :)
const SHIVAAY_API_KEY = "<YOUR API KEY?>"

const SupportChat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm Shivaay, your assistant. How can I help you today?"
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef(null)

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage = { role: "user", content: inputValue }
    setMessages([...messages, userMessage])
    setInputValue("")

    try {
      const response = await fetch(
        "https://api_v2.futurixai.com/api/lara/v1/completion",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-subscription-key": SHIVAAY_API_KEY
          },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content: "You are an expert assistant."
              },
              ...messages,
              userMessage
            ],
            temperature: 0.7,
            top_p: 1
          })
        }
      )
      const data = await response.json()
      const assistantMessage = { role: "assistant", content: data.answer }
      setMessages([...messages, userMessage, assistantMessage])
    } catch (error) {
      console.error("Error fetching response:", error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  return (
    <>
      <button className="help-button" onClick={() => setIsOpen(!isOpen)}>
        ?
      </button>
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">Shivaay Assistant</div>
          <div
            className="chat-messages"
            style={{
              display: "flex",
              flexDirection: "column"
            }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={
                  msg.role === "user" ? "user-message" : "assistant-message"
                }>
                {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage()
              }}
              placeholder="Type your message..."
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  )
}

// Mount React component to the DOM
const rootElement = document.createElement("div")
document.body.appendChild(rootElement)
const root = createRoot(rootElement)
root.render(<SupportChat />)
