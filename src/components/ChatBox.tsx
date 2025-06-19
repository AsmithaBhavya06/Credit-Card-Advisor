"use client"

import { useState, useEffect, useRef } from "react"
import { CreditCard, Sparkles, Bot, Loader2, ArrowLeft, RotateCcw, Send } from "lucide-react"
import { getRecommendation } from "@/lib/recommend"

const questions = [
  {
    key: "spendingType",
    question: "What do you spend most on?",
    options: ["Travel", "Dining", "Online Shopping", "Fuel", "Groceries", "Other"],
  },
  {
    key: "income",
    question: "What is your annual income range?",
    options: ["Below 3L", "3L-6L", "6L-12L", "12L+"],
  },
  {
    key: "benefit",
    question: "What benefit do you value most?",
    options: ["Cashback", "Rewards", "Lounge Access", "Low Fee"],
  },
  {
    key: "bank",
    question: "Do you prefer a specific bank?",
    options: ["No Preference", "HDFC", "SBI", "ICICI", "Axis", "Other"],
  },
]

export default function ChatBox() {
  const [questionStep, setQuestionStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [manualPrompt, setManualPrompt] = useState("")
  const [manualResult, setManualResult] = useState(null)
  const [isManualLoading, setIsManualLoading] = useState(false)
  const chatEndRef = useRef(null)

  const handleOptionSelect = (option) => {
    const currentKey = questions[questionStep].key
    const newAnswers = { ...answers, [currentKey]: option }
    setAnswers(newAnswers)

    if (questionStep < questions.length - 1) {
      setQuestionStep((prev) => prev + 1)
    } else {
      const rec = getRecommendation(newAnswers)
      setMessages([{ role: "bot", content: rec }])
      getFinalRecommendation(newAnswers)
    }
  }

  const getFinalRecommendation = async (answers) => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        body: JSON.stringify({ preferences: answers }),
        headers: { "Content-Type": "application/json" },
      })

      const data = await res.json()
      if (data.reply) {
        setMessages([{ role: "bot", content: data.reply }])
      }
    } catch (err) {
      setMessages([{ role: "bot", content: "Something went wrong. Please try again." }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    if (questionStep > 0) setQuestionStep((prev) => prev - 1)
  }

  const handleManualSubmit = async (e) => {
    e.preventDefault()
    if (!manualPrompt.trim()) return

    setIsManualLoading(true)
    try {
      const rec = getRecommendation({ prompt: manualPrompt })
      setManualResult(rec)
    } catch (err) {
      setManualResult("Unable to process your request. Please try again.")
    } finally {
      setIsManualLoading(false)
    }
  }

  const handleReset = () => {
    setQuestionStep(0)
    setAnswers({})
    setMessages([])
    setManualPrompt("")
    setManualResult(null)
    setIsLoading(false)
    setIsManualLoading(false)
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, manualResult])

  const formatContent = (content) => {
    if (typeof content !== "string") return <p>Something went wrong. Please try again.</p>

    return content.split("\n").map((line, idx) => {
      const trimmedLine = line.trim()
      if (trimmedLine.startsWith("-")) {
        return (
          <li key={idx} className="ml-4 list-disc text-gray-700 leading-relaxed text-lg">
            {trimmedLine.slice(1).trim()}
          </li>
        )
      } else if (trimmedLine.startsWith("**") && trimmedLine.endsWith("**")) {
        return (
          <h4 key={idx} className="font-bold text-gray-900 mt-6 mb-3 first:mt-0 text-xl">
            {trimmedLine.slice(2, -2)}
          </h4>
        )
      } else if (trimmedLine) {
        return (
          <p key={idx} className="text-gray-700 leading-relaxed mb-3 last:mb-0 text-lg">
            {trimmedLine}
          </p>
        )
      }
      return <br key={idx} />
    })
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 via-white to-indigo-100">
      {/* Full-Width Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-12">
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="p-4 bg-white/20 rounded-3xl backdrop-blur-sm border border-white/30 shadow-lg">
              <CreditCard className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white drop-shadow-sm" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text">
              SmartCard AI
            </h1>
            <div className="p-4 bg-white/20 rounded-3xl backdrop-blur-sm border border-white/30 shadow-lg">
              <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white animate-pulse drop-shadow-sm" />
            </div>
          </div>
          <p className="text-blue-100 text-base lg:text-lg text-center max-w-4xl mx-auto leading-relaxed">
            Your AI-powered credit card advisor. Get personalized recommendations based on your spending habits and
            preferences. Find the perfect card that matches your lifestyle.
          </p>
        </div>
      </div>

      {/* Full-Screen Chat Area */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-transparent via-white/50 to-blue-50/30 min-h-[calc(100vh-300px)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-6 lg:py-12">
          {/* Questions Flow */}
          {messages.length === 0 && questionStep < questions.length && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] sm:min-h-[65vh] lg:min-h-[70vh] text-center space-y-12">
              <div className="p-8 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-full shadow-2xl border border-white/50">
                <Bot className="h-20 w-20 lg:h-24 lg:w-24 text-blue-600" />
              </div>

              <div className="space-y-6 max-w-4xl">
                <div className="inline-flex items-center px-6 py-3 bg-blue-100 text-blue-800 rounded-full text-base font-semibold shadow-lg">
                  Question {questionStep + 1} of {questions.length}
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
                  {questions[questionStep].question}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 w-full max-w-6xl">
                {questions[questionStep].options.map((opt, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(opt)}
                    className="group p-4 sm:p-6 lg:p-8 bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 border-2 border-gray-200 hover:border-blue-300 rounded-3xl text-gray-700 hover:text-blue-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-2"
                  >
                    <span className="text-base lg:text-lg font-semibold">{opt}</span>
                  </button>
                ))}
              </div>

              {questionStep > 0 && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-3 px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl transition-colors duration-200 font-semibold text-lg shadow-lg"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Go Back
                </button>
              )}
            </div>
          )}

          {/* Enhanced Recommendation Messages */}
          {messages.map((msg, i) => (
            <div key={i} className="mb-6 sm:mb-8 lg:mb-12 last:mb-16">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-2xl">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1 max-w-5xl">
                  <div className="bg-white border border-gray-200 rounded-3xl px-6 sm:px-8 lg:px-10 py-8 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                    <div className="prose prose-gray max-w-none">
                      <div className="space-y-4 text-sm lg:text-base leading-relaxed">{formatContent(msg.content)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Enhanced Loading State */}
          {isLoading && (
            <div className="mb-12">
              <div className="flex items-start gap-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-2xl">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1 max-w-5xl">
                  <div className="bg-white border border-gray-200 rounded-3xl px-6 sm:px-8 lg:px-10 py-8 shadow-2xl">
                    <div className="flex items-center gap-4 text-gray-600">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                      <span className="text-lg font-semibold">
                        Analyzing your preferences and finding the best cards for you...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Reset Button */}
          {messages.length > 0 && !isLoading && (
            <div className="text-center mt-16 mb-12">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-3xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <RotateCcw className="h-6 w-6" />
                Start Over
              </button>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Full-Width Manual Input Section */}
      <div className="border-t border-gray-200 bg-white/95 backdrop-blur-sm shadow-2xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">Or describe your needs directly</h3>
              <p className="text-gray-600 text-lg">Tell us what you're looking for in your own words</p>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  value={manualPrompt}
                  onChange={(e) => setManualPrompt(e.target.value)}
                  placeholder="e.g., I need a card with good travel rewards and no annual fee for someone earning 8L annually..."
                  disabled={isManualLoading}
                  className="w-full p-4 sm:p-5 lg:p-6 pr-20 border-2 border-gray-300 focus:border-blue-500 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:bg-gray-100 disabled:cursor-not-allowed text-lg lg:text-xl transition-all duration-200 shadow-lg"
                />
                <button
                  type="submit"
                  disabled={!manualPrompt.trim() || isManualLoading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-2xl shadow-xl hover:shadow-2xl disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                >
                  {isManualLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
                </button>
              </div>
            </form>

            {/* Enhanced Manual Result */}
            {manualResult && (
              <div className="mt-10">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-8 border-blue-500 rounded-3xl p-8 lg:p-10 shadow-2xl">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl lg:text-2xl font-bold text-blue-900 mb-4">
                        Recommendation Based on Your Input:
                      </h4>
                      <div className="prose prose-blue max-w-none">
                        <div className="text-gray-800 leading-relaxed space-y-3">{formatContent(manualResult)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full-Width Footer */}
      <div className="border-t border-gray-300 bg-gradient-to-r from-gray-100 to-blue-100 shadow-inner">
        <div className="container mx-auto px-6 lg:px-12 py-6 text-center">
          <p className="text-gray-700 leading-relaxed text-base lg:text-lg">
            <span className="font-bold">Disclaimer:</span> SmartCard AI provides suggestions based on common criteria
            and market analysis. Please verify all card details, terms, conditions, and eligibility requirements
            independently before making any financial decisions. Always consult with financial advisors for personalized
            advice.
          </p>
        </div>
      </div>
    </div>
  )
}
