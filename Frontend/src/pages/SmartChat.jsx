import { useState, useEffect, useRef } from "react";
import { chatbotQuery, clearChatHistory } from "../services/api.js";

export default function SmartChat() {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, loading]);

  // Check backend connection on mount
  useEffect(() => {
    async function checkConnection() {
      try {
        const res = await fetch("http://localhost:5000/api/health");
        if (res.ok) {
          setConnectionStatus("connected");
        } else {
          setConnectionStatus("disconnected");
        }
      } catch {
        setConnectionStatus("disconnected");
      }
    }
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  async function handleSend(e) {
    e.preventDefault();
    setError("");

    const text = message.trim();
    if (!text || loading) return;

    const userEntry = {
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };
    setConversation((prev) => [...prev, userEntry]);
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    setLoading(true);
    try {
      const res = await chatbotQuery({
        message: text,
        userId: "web-client",
        context: {},
      });

      if (res.success && res.response) {
        const assistantEntry = {
          role: "assistant",
          content: res.response,
          timestamp: res.timestamp || new Date().toISOString(),
        };
        setConversation((prev) => [...prev, assistantEntry]);
        setError("");
      } else if (res.fallback_response) {
        const assistantEntry = {
          role: "assistant",
          content: res.fallback_response,
          timestamp: new Date().toISOString(),
        };
        setConversation((prev) => [...prev, assistantEntry]);
        setError(
          res.message || "Chatbot temporarily unavailable, using fallback."
        );
      } else {
        setError(res.message || "Chatbot error - no response received");
      }
    } catch (err) {
      setError(err.message || "Failed to reach chatbot. Make sure backend is running on http://localhost:5000");
      const errorEntry = {
        role: "assistant",
        content: "Sorry, I couldn't connect to the backend. Please check if the server is running.",
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setConversation((prev) => [...prev, errorEntry]);
    } finally {
      setLoading(false);
    }
  }

  async function handleClear() {
    if (window.confirm("Clear all conversation history?")) {
      try {
        await clearChatHistory("web-client");
      } catch (err) {
        console.error("Failed to clear backend history:", err);
      }
      setConversation([]);
      setError("");
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  }

  // Auto-resize textarea
  function handleTextareaChange(e) {
    setMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }

  return (
    <>
      <header className="content-header">
        <div className="content-heading">
          <div className="content-title-row">
            <div className="badge">
              <span
                className={
                  connectionStatus === "connected"
                    ? "badge-dot-green"
                    : "badge-dot-amber"
                }
              />
              Real-time farm assistant
            </div>
          </div>
          <h1 className="content-title">Smart chatbot</h1>
          <p className="content-subtitle">
            Ask about crop plans, disease treatment, irrigation schedules and
            organic practices. Get instant AI-powered responses.
          </p>
        </div>
        <div className="content-header-right">
          <div className="page-toolbar">
            <span
              className={`pill-soft ${
                connectionStatus === "connected" ? "" : ""
              }`}
            >
              {connectionStatus === "connected" ? (
                <>
                  <span className="badge-dot-green" /> Connected
                </>
              ) : (
                <>
                  <span className="badge-dot-amber" /> Disconnected
                </>
              )}
            </span>
            <span className="pill-soft">POST /api/chatbot/query</span>
          </div>
          <div className="dot-row">
            <span />
            <span className="mono">
              Press Enter to send · Shift+Enter for new line
            </span>
          </div>
        </div>
      </header>

      {error && (
        <div className="card" style={{ marginBottom: "0.9rem" }}>
          <div className="card-inner">
            <div className="error-text">{error}</div>
          </div>
        </div>
      )}

      <section className="page-main-single">
        <section>
          <div className="card">
            <div className="card-inner">
              <div className="flex-between">
                <div>
                  <div className="card-title">Live conversation</div>
                  <div className="card-subtitle">
                    {conversation.length > 0
                      ? `${conversation.length} message${
                          conversation.length !== 1 ? "s" : ""
                        } in this session`
                      : "Start chatting below"}
                  </div>
                </div>
                <div className="pill-row">
                  <span className="pill-soft">User ID · web-client</span>
                  <span className="pill-soft">Memory · last 10 messages</span>
                  {conversation.length > 0 && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={handleClear}
                    >
                      Clear chat
                    </button>
                  )}
                </div>
              </div>

              <div className="divider" />

              <div className="chat-window">
                {conversation.length === 0 ? (
                  <div className="empty-state">
                    <div style={{ marginBottom: "0.6rem" }}>
                      <strong>Welcome! Try asking:</strong>
                    </div>
                    <div className="flex-col gap-sm" style={{ marginTop: "0.6rem" }}>
                      <div className="chip">
                        "Recommend crops for 28°C, 70% humidity in Kharif season"
                      </div>
                      <div className="chip">
                        "How often should I irrigate tomato in summer?"
                      </div>
                      <div className="chip">
                        "What's the best fertilizer for rice cultivation?"
                      </div>
                      <div className="chip">
                        "How to prevent leaf spot disease in potatoes?"
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-col gap-md">
                    {conversation.map((msg, idx) => (
                      <div key={idx} className="flex-col gap-sm">
                        <div className="chat-bubble-row">
                          <div className="chat-avatar">
                            {msg.role === "assistant" ? "🤖" : "👤"}
                          </div>
                          <div
                            className={
                              "chat-message " +
                              (msg.role === "assistant" ? "assistant" : "user") +
                              (msg.isError ? " error" : "")
                            }
                            style={{
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                            }}
                          >
                            {msg.content}
                          </div>
                        </div>
                        <div className="chat-meta">
                          {msg.role === "assistant" ? "AI Assistant" : "You"} ·{" "}
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex-col gap-sm">
                        <div className="chat-bubble-row">
                          <div className="chat-avatar">🤖</div>
                          <div className="chat-message assistant">
                            <div
                              style={{
                                display: "flex",
                                gap: "0.4rem",
                                alignItems: "center",
                              }}
                            >
                              <span>Thinking</span>
                              <span
                                style={{
                                  display: "inline-block",
                                  width: "4px",
                                  height: "4px",
                                  borderRadius: "50%",
                                  background: "#22c55e",
                                  animation: "pulse 1.5s ease-in-out infinite",
                                }}
                              />
                              <span
                                style={{
                                  display: "inline-block",
                                  width: "4px",
                                  height: "4px",
                                  borderRadius: "50%",
                                  background: "#22c55e",
                                  animation: "pulse 1.5s ease-in-out infinite 0.2s",
                                }}
                              />
                              <span
                                style={{
                                  display: "inline-block",
                                  width: "4px",
                                  height: "4px",
                                  borderRadius: "50%",
                                  background: "#22c55e",
                                  animation: "pulse 1.5s ease-in-out infinite 0.4s",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                )}
              </div>

              <div className="divider" />

              <form onSubmit={handleSend} className="flex-col gap-sm">
                <label className="label">
                  Ask a question <span>*</span>
                </label>
                <textarea
                  ref={textareaRef}
                  className="textarea"
                  value={message}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your crop, season, location and concern. Press Enter to send, Shift+Enter for new line."
                  disabled={loading}
                  style={{
                    minHeight: "60px",
                    maxHeight: "200px",
                    resize: "none",
                  }}
                />
                <div className="flex-between">
                  <button
                    className="btn btn-secondary"
                    disabled={loading || !message.trim()}
                    type="submit"
                  >
                    {loading ? (
                      <>
                        <span>Sending</span>
                        <span
                          style={{
                            display: "inline-block",
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: "currentColor",
                            animation: "pulse 1s ease-in-out infinite",
                          }}
                        />
                      </>
                    ) : (
                      "Send message"
                    )}
                  </button>
                  <div className="chip-row">
                    <span>🌾 Crop advice</span>
                    <span>🩺 Disease help</span>
                    <span>💧 Irrigation</span>
                    <span>🌱 Organic tips</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .chat-message.error {
          border-color: rgba(254, 202, 202, 0.7);
          background: radial-gradient(
            circle at 0 0,
            rgba(254, 202, 202, 0.12),
            rgba(15, 23, 42, 0.96)
          );
        }
      `}</style>
    </>
  );
}

