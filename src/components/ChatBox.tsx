"use client"

import { useState, useEffect, useRef } from "react"
import { CreditCard, Sparkles, Send, Bot, User, Loader2 } from "lucide-react"

export default function ChatBox() {
  const [messages, setMessages] = useState([])
  const [userInput, setUserInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const chatEndRef = useRef(null)

  const handleSend = async () => {
    if (!userInput.trim() || isLoading) return

    const userMsg = { role: "user", content: userInput }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setUserInput("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        body: JSON.stringify({ messages: newMessages }),
        headers: { "Content-Type": "application/json" },
      })

      const data = await res.json()
      setMessages([...newMessages, { role: "bot", content: data.reply }])
    } catch (error) {
      setMessages([...newMessages, { role: "bot", content: "Sorry, I encountered an error. Please try again." }])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="w-full max-w-4xl mx-auto h-screen sm:h-[90vh] flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 sm:rounded-2xl sm:shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
              <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">SmartCard AI</h1>
            <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-white animate-pulse" />
            </div>
          </div>
          <p className="text-blue-100 text-sm sm:text-base text-center max-w-md mx-auto">
            Your AI-powered credit card advisor. Get personalized recommendations based on your spending habits.
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 bg-gradient-to-b from-transparent to-blue-50/30">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full">
              <Bot className="h-12 w-12 text-blue-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">Welcome to SmartCard AI!</h3>
              <p className="text-gray-600 text-sm max-w-sm">
                Ask me about credit cards, rewards, or get personalized recommendations based on your spending habits.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
              <button
                onClick={() => setUserInput("What's the best cashback credit card?")}
                className="p-3 text-left bg-white hover:bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-700 hover:text-blue-700 transition-colors"
              >
                Best cashback cards
              </button>
              <button
                onClick={() => setUserInput("I travel frequently, what card should I get?")}
                className="p-3 text-left bg-white hover:bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-700 hover:text-blue-700 transition-colors"
              >
                Travel rewards cards
              </button>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-blue-500 to-blue-600"
                  : "bg-gradient-to-br from-purple-500 to-purple-600"
              }`}
            >
              {msg.role === "user" ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
            </div>
            <div
              className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-md"
                  : "bg-white text-gray-800 border border-gray-200 rounded-tl-md"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Section */}
      <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm p-4 sm:p-6">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Ask about credit cards, rewards, or get recommendations..."
              disabled={isLoading}
              className="w-full p-3 sm:p-4 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              rows={1}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <span className="text-xs hidden sm:inline">Press Enter to send</span>
            </div>
          </div>
          <button
            onClick={handleSend}
            disabled={!userInput.trim() || isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white p-3 sm:p-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:shadow-sm flex items-center justify-center min-w-[48px] sm:min-w-[56px]"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          SmartCard AI can make mistakes. Please verify important information.
        </div>
      </div>
    </div>
  )
}
