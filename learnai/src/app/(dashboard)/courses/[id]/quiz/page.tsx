"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { COURSES } from "@/lib/data/courses";

const mockQuiz = {
  title: "Module 1 Quiz: Foundations",
  timeLimit: 600, // 10 minutes in seconds
  questions: [
    {
      id: "q1",
      question: "What does GPT stand for in ChatGPT?",
      options: [
        "General Purpose Technology",
        "Generative Pre-trained Transformer",
        "Global Processing Tool",
        "Graphics Processing Terminal",
      ],
      correct: 1,
      explanation: "GPT stands for Generative Pre-trained Transformer. It is a type of large language model developed by OpenAI that uses transformer architecture to generate human-like text.",
    },
    {
      id: "q2",
      question: "Which of the following is the best practice when writing a prompt for ChatGPT?",
      options: [
        "Keep prompts as short as possible",
        "Be vague to allow AI creativity",
        "Be specific, clear, and provide context",
        "Use only technical jargon",
      ],
      correct: 2,
      explanation: "Being specific, clear, and providing context leads to much better results. The AI needs enough information to understand exactly what you want. Vague prompts lead to generic responses.",
    },
    {
      id: "q3",
      question: "What is zero-shot prompting?",
      options: [
        "Providing many examples before asking your question",
        "Asking the AI to perform a task without any examples",
        "A technique where the AI refuses to answer",
        "Prompting with images instead of text",
      ],
      correct: 1,
      explanation: "Zero-shot prompting means asking the AI to perform a task without providing any examples. You rely on the model's pre-trained knowledge. In contrast, few-shot prompting gives 2-5 examples first.",
    },
    {
      id: "q4",
      question: "Which of the following is a key limitation of ChatGPT?",
      options: [
        "It cannot write code",
        "It cannot translate languages",
        "Its training data has a knowledge cutoff date",
        "It can only process 10 words at a time",
      ],
      correct: 2,
      explanation: "ChatGPT has a knowledge cutoff date — it was trained on data up to a certain point and does not know about events after that date. It can write code and translate languages quite well.",
    },
    {
      id: "q5",
      question: "What is the purpose of the 'system prompt' in the ChatGPT API?",
      options: [
        "It sets the programming language for code generation",
        "It defines the AI's personality, role, and behaviour for the conversation",
        "It controls how fast the AI responds",
        "It determines the price of each API call",
      ],
      correct: 1,
      explanation: "The system prompt is used to set the context, persona, and behavioural rules for the AI assistant. It defines who the AI is, how it should behave, and any constraints it should follow throughout the conversation.",
    },
  ],
};

function TimerBar({ timeLeft, total }: { timeLeft: number; total: number }) {
  const pct = (timeLeft / total) * 100;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const color = pct > 50 ? "bg-green-500" : pct > 20 ? "bg-yellow-500" : "bg-red-500";
  const textColor = pct > 50 ? "text-green-600" : pct > 20 ? "text-yellow-600" : "text-red-600";
  return (
    <div className="flex items-center gap-3">
      <div className={`text-lg font-bold font-mono ${textColor}`}>
        {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
      </div>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-2 rounded-full transition-all duration-1000 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function QuizPage({ params }: { params: { id: string } }) {
  const course = COURSES.find((c) => c.id === params.id) ?? COURSES[0];
  const quiz = mockQuiz;

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<(number | null)[]>(Array(quiz.questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit);

  // FIX #5: handleSubmit was missing from the dependency array → stale closure bug.
  // When the timer fired, it would call the stale version of handleSubmit that had
  // captured the initial (empty) `selected` array, so the auto-submit on timeout
  // would always submit with no answers. Using a ref avoids both the stale closure
  // and an infinite re-render loop from adding a function to deps.
  const handleSubmitRef = useRef(handleSubmit);
  useEffect(() => { handleSubmitRef.current = handleSubmit; });

  useEffect(() => {
    if (submitted) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          handleSubmitRef.current(); // always calls the latest version
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted]);

  const handleSelect = (optionIdx: number) => {
    if (submitted) return;
    setSelected((prev) => {
      const next = [...prev];
      next[currentQ] = optionIdx;
      return next;
    });
  };

  const handleSubmit = () => setSubmitted(true);

  const score = submitted
    ? quiz.questions.filter((q, i) => selected[i] === q.correct).length
    : 0;
  const scorePercent = submitted ? Math.round((score / quiz.questions.length) * 100) : 0;
  const passed = scorePercent >= 70;

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-16 px-4">
        <div className="w-full max-w-2xl">
          {/* Result card */}
          <div className={`rounded-3xl p-8 text-center mb-6 shadow-lg ${passed ? "bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200" : "bg-gradient-to-br from-red-50 to-orange-50 border border-red-200"}`}>
            <div className={`inline-flex items-center justify-center w-28 h-28 rounded-full mb-4 ${passed ? "bg-green-100" : "bg-red-100"}`}>
              <div className="text-center">
                <div className={`text-3xl font-extrabold ${passed ? "text-green-600" : "text-red-600"}`}>{scorePercent}%</div>
                <div className={`text-xs font-medium ${passed ? "text-green-500" : "text-red-500"}`}>{score}/{quiz.questions.length}</div>
              </div>
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${passed ? "text-green-800" : "text-red-800"}`}>
              {passed ? "🎉 Well done! You passed!" : "😔 Not quite — keep practising!"}
            </h2>
            <p className={`text-sm ${passed ? "text-green-600" : "text-red-600"}`}>
              {passed
                ? `Excellent! You scored ${scorePercent}% (passing is 70%). You can move on to the next module.`
                : `You scored ${scorePercent}% but need 70% to pass. Review the explanations below and try again.`}
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={() => { setSubmitted(false); setCurrentQ(0); setSelected(Array(quiz.questions.length).fill(null)); setTimeLeft(quiz.timeLimit); }}
                className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Retake Quiz
              </button>
              <Link
                href={`/dashboard/courses/${params.id}/learn`}
                className={`px-5 py-2.5 font-semibold rounded-xl text-sm text-white transition-colors ${passed ? "bg-green-600 hover:bg-green-700" : "bg-violet-600 hover:bg-violet-700"}`}
              >
                {passed ? "Continue Course →" : "Review Lessons"}
              </Link>
            </div>
          </div>

          {/* Per-question breakdown */}
          <h3 className="text-lg font-bold text-gray-900 mb-4">Answer Breakdown</h3>
          <div className="space-y-4">
            {quiz.questions.map((q, qi) => {
              const userAns = selected[qi];
              const isCorrect = userAns === q.correct;
              return (
                <div key={q.id} className={`bg-white rounded-2xl border p-5 shadow-sm ${isCorrect ? "border-green-200" : "border-red-200"}`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {isCorrect ? "✓" : "✗"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-2">Q{qi + 1}: {q.question}</p>
                      <div className="space-y-1">
                        {q.options.map((opt, oi) => (
                          <div key={oi} className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg ${
                            oi === q.correct ? "bg-green-100 text-green-800 font-medium" :
                            oi === userAns && !isCorrect ? "bg-red-100 text-red-700 line-through" :
                            "text-gray-500"
                          }`}>
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${
                              oi === q.correct ? "bg-green-500 text-white" :
                              oi === userAns && !isCorrect ? "bg-red-400 text-white" :
                              "bg-gray-200 text-gray-600"
                            }`}>{String.fromCharCode(65 + oi)}</span>
                            {opt}
                            {oi === q.correct && <span className="ml-auto">✓ Correct</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={`text-xs leading-relaxed p-3 rounded-lg ${isCorrect ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                    <span className="font-semibold">Explanation: </span>{q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQ];
  const answeredCount = selected.filter((s) => s !== null).length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-500 truncate">{course.title}</div>
            <div className="text-sm font-semibold text-gray-900 truncate">{quiz.title}</div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-xs text-gray-500 hidden sm:block">
              Q <span className="font-bold text-gray-900">{currentQ + 1}</span> of {quiz.questions.length}
            </div>
            <div className="w-32">
              <TimerBar timeLeft={timeLeft} total={quiz.timeLimit} />
            </div>
          </div>
        </div>

        {/* Question progress dots */}
        <div className="max-w-3xl mx-auto mt-3 flex items-center gap-1.5 flex-wrap">
          {quiz.questions.map((_, qi) => (
            <button
              key={qi}
              onClick={() => setCurrentQ(qi)}
              className={`w-7 h-7 rounded-full text-xs font-semibold transition-all ${
                qi === currentQ
                  ? "bg-violet-600 text-white"
                  : selected[qi] !== null
                  ? "bg-violet-200 text-violet-700"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {qi + 1}
            </button>
          ))}
          <div className="ml-auto text-xs text-gray-400">
            {answeredCount}/{quiz.questions.length} answered
          </div>
        </div>
      </div>

      {/* Question card */}
      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                {currentQ + 1}
              </span>
              <span className="text-lg font-semibold text-gray-900 leading-snug">{question.question}</span>
            </div>

            <div className="space-y-3">
              {question.options.map((opt, oi) => {
                const isSelected = selected[currentQ] === oi;
                return (
                  <button
                    key={oi}
                    onClick={() => handleSelect(oi)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left text-sm font-medium transition-all border-2 ${
                      isSelected
                        ? "border-violet-500 bg-violet-50 text-violet-900"
                        : "border-gray-200 bg-white text-gray-700 hover:border-violet-300 hover:bg-violet-50/50"
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold border-2 transition-all ${
                      isSelected
                        ? "bg-violet-600 border-violet-600 text-white"
                        : "border-gray-300 text-gray-400 bg-white"
                    }`}>
                      {String.fromCharCode(65 + oi)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentQ((q) => Math.max(0, q - 1))}
              disabled={currentQ === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            {currentQ < quiz.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQ((q) => q + 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700 transition-colors"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={answeredCount < quiz.questions.length}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-green-500/20"
              >
                Submit Quiz
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            )}
          </div>

          {currentQ === quiz.questions.length - 1 && answeredCount < quiz.questions.length && (
            <p className="text-center text-xs text-amber-600 mt-3">
              ⚠ Please answer all {quiz.questions.length} questions before submitting ({quiz.questions.length - answeredCount} remaining)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
