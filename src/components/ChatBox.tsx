"use client";

import React, { useState, useEffect, useRef } from "react";
import { CreditCard, Sparkles, Send, Bot, User, Loader2 } from "lucide-react";
import { getRecommendation } from "@/lib/recommend";

const questions = [
  {
    key: "spendingType",
    question: "What do you spend most on?",
    options: [
      "Travel",
      "Dining",
      "Online Shopping",
      "Fuel",
      "Groceries",
      "Other",
    ],
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
  // Add more questions here as needed
];

export default function ChatBox() {
  const [questionStep, setQuestionStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [manualPrompt, setManualPrompt] = useState("");
  const [manualResult, setManualResult] = useState(null);
  const chatEndRef = useRef(null);

  const handleOptionSelect = async (option) => {
    const currentKey = questions[questionStep].key;
    const newAnswers = { ...answers, [currentKey]: option };
    setAnswers(newAnswers);

    if (questionStep < questions.length - 1) {
      setQuestionStep((prev) => prev + 1);
    } else {
      const rec = getRecommendation(newAnswers);
      setRecommendation(rec);
      await getFinalRecommendation(newAnswers);
    }
  };

  const getFinalRecommendation = async (answers) => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        body: JSON.stringify({ preferences: answers }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      setMessages([{ role: "bot", content: data.reply }]);
    } catch (err) {
      setMessages([
        { role: "bot", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (questionStep > 0) setQuestionStep((prev) => prev - 1);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const rec = getRecommendation({ prompt: manualPrompt });
    setManualResult(rec);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              SmartCard AI
            </h1>
            <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-white animate-pulse" />
            </div>
          </div>
          <p className="text-blue-100 text-sm sm:text-base text-center max-w-md mx-auto">
            Your AI-powered credit card advisor. Get personalized
            recommendations based on your spending habits.
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 bg-gradient-to-b from-transparent to-blue-50/30">
        {/* Questions */}
        {messages.length === 0 && questionStep < questions.length && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full">
              <Bot className="h-12 w-12 text-blue-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">
                {questions[questionStep].question}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
              {questions[questionStep].options.map((opt, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(opt)}
                  className="p-3 text-left bg-white hover:bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-700 hover:text-blue-700 transition-colors"
                >
                  {opt}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <button
                onClick={handleBack}
                disabled={questionStep === 0}
                style={{
                  padding: "6px 12px",
                  borderRadius: 4,
                  border: "none",
                  background:
                    questionStep === 0 ? "#eee" : "#0078d4",
                  color: questionStep === 0 ? "#888" : "#fff",
                  cursor:
                    questionStep === 0 ? "not-allowed" : "pointer",
                }}
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* Final Message / Recommendation */}
        {messages.length > 0 &&
          messages.map((msg, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm text-sm text-gray-800 space-y-1">
                {msg.content.split("\n").map((line, idx) =>
                  line.trim().startsWith("-") ? (
                    <li key={idx} className="ml-5 list-disc">
                      {line.trim().slice(1).trim()}
                    </li>
                  ) : (
                    <p key={idx}>{line}</p>
                  )
                )}
              </div>
            </div>
          ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Analyzing your preferences...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Manual Input and Recommendation */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 bg-white border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Or type your needs
        </h3>
        <form onSubmit={handleManualSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={manualPrompt}
            onChange={(e) => setManualPrompt(e.target.value)}
            placeholder="e.g. Best card for travel and cashback"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            Get Card
          </button>
        </form>
        {manualResult && (
          <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
            <p className="text-sm text-blue-700 font-semibold">
              Manual Recommendation:
            </p>
            <p className="text-gray-800">{manualResult}</p>
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm p-4 text-center text-xs text-gray-500">
        SmartCard AI may generate suggestions based on common criteria. Please
        verify final card details independently.
      </div>
    </div>
  );
}
