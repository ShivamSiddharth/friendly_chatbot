import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./Chat.css";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hi Shivam 👋 How can I help you today?", sender: "bot" },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  // ✅ Code block renderer
  const CodeBlock = ({ inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    const code = String(children).replace(/\n$/, "");

    const copyCode = () => {
      navigator.clipboard.writeText(code);
    };

    if (!inline && match) {
      return (
        <div className="code-block">
          <button className="copy-btn" onClick={copyCode}>
            Copy
          </button>

          <SyntaxHighlighter
            style={vscDarkPlus}
            language={match[1]}
            PreTag="div"
            {...props}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      );
    }

    return <code className="inline-code">{children}</code>;
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { text: message, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/chat`, {
        message: `You are a friendly AI assistant.

        Rules:
        - Normal conversation → plain text
        - Only use code blocks if user asks for code
        - Keep answers clean and readable
        
        User name is Shivam..
User: ${message}`,
      });

      const botMsg = { text: res.data.reply, sender: "bot" };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { text: "Something went wrong. Try again.", sender: "bot" },
      ]);
    }

    setLoading(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="chat">
      <div className="chat__header">Shivam • AI Assistant</div>

      <div className="chat__messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chat__row ${msg.sender}`}>
            <div className="chat__meta">
              {msg.sender === "user" ? "Shivam" : "AI"}
            </div>

            <div className="chat__bubble">
              <ReactMarkdown components={{ code: CodeBlock }}>
                {msg.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {loading && (
          <div className="chat__row bot">
            <div className="chat__meta">AI</div>
            <div className="chat__bubble typing">Typing...</div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="chat__input">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask anything Shivam..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
};

export default Chat;
