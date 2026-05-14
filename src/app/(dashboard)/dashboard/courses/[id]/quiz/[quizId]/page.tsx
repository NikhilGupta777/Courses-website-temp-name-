"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";

type QuizState = "intro" | "in_progress" | "results";

export default function QuizPage() {
  const params = useParams();
  const courseId = params.id as string;
  const quizId = params.quizId as string;
  const { data: session } = useSession();

  const [quizState, setQuizState] = useState<QuizState>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [result, setResult] = useState<{
    score: number; earnedPoints: number; totalPoints: number; passed: boolean;
    questionResults: { questionId: string; userAnswer: string; correct: boolean; correctAnswer: string | null; explanation: string | null }[];
  } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: quiz, isLoading } = useQuery(trpc.quiz.get.queryOptions({ quizId }));

  const submitMutation = useMutation(trpc.quiz.submit.mutationOptions({
    onSuccess: (data) => {
      setResult(data);
      setQuizState("results");
      if (timerRef.current) clearInterval(timerRef.current);
    },
  }));

  useEffect(() => {
    if (quizState === "in_progress" && quiz?.timeLimit && timeLeft === null) {
      setTimeLeft(quiz.timeLimit * 60);
    }
  }, [quizState, quiz]);

  const [timerStarted, setTimerStarted] = useState(false);

  useEffect(() => {
    if (quizState === "in_progress" && timeLeft !== null && timeLeft > 0 && !timerStarted) {
      setTimerStarted(true);
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t === null || t <= 1) {
            handleSubmit();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizState, timerStarted]);

  const handleSubmit = () => {
    if (!quiz) return;
    const answerList = quiz.questions.map(q => ({
      questionId: q.id,
      answer: answers[q.id] ?? "",
    }));
    submitMutation.mutate({ quizId, answers: answerList });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Quiz Not Found</h2>
          <Link href={`/dashboard/courses/${courseId}/learn`} className="text-violet-600 hover:underline">← Back to Course</Link>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQ];
  const totalQ = quiz.questions.length;
  const formatTime = (s: number) => `${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`;

  // INTRO
  if (quizState === "intro") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 max-w-lg w-full">
          <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">{quiz.title}</h1>
          {quiz.description && <p className="text-gray-500 text-center text-sm mb-6">{quiz.description}</p>}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-xl font-bold text-gray-900">{totalQ}</div>
              <div className="text-xs text-gray-500">Questions</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-xl font-bold text-gray-900">{quiz.timeLimit ? `${quiz.timeLimit}m` : "∞"}</div>
              <div className="text-xs text-gray-500">Time Limit</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-xl font-bold text-gray-900">{quiz.passingScore}%</div>
              <div className="text-xs text-gray-500">Pass Score</div>
            </div>
          </div>
          <button onClick={() => { setQuizState("in_progress"); if (quiz.timeLimit) setTimeLeft(quiz.timeLimit * 60); }}
            className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg">
            Start Quiz →
          </button>
          <Link href={`/dashboard/courses/${courseId}/learn`} className="block text-center mt-3 text-sm text-gray-500 hover:text-violet-600 transition-colors">
            ← Back to Course
          </Link>
        </div>
      </div>
    );
  }

  // RESULTS
  if (quizState === "results" && result) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 mb-6">
            <div className={cn("w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4", result.passed ? "bg-green-100" : "bg-red-100")}>
              {result.passed ? (
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              ) : (
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">{result.passed ? "Congratulations!" : "Keep Practicing"}</h2>
            <p className="text-gray-500 text-center mb-6">{result.passed ? "You passed the quiz!" : `You need ${quiz.passingScore}% to pass.`}</p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className={cn("text-3xl font-bold", result.passed ? "text-green-600" : "text-red-500")}>{result.score}%</div>
                <div className="text-xs text-gray-500 mt-0.5">Score</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-3xl font-bold text-gray-900">{result.earnedPoints}/{result.totalPoints}</div>
                <div className="text-xs text-gray-500 mt-0.5">Points</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-3xl font-bold text-gray-900">{result.questionResults.filter(q => q.correct).length}/{totalQ}</div>
                <div className="text-xs text-gray-500 mt-0.5">Correct</div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setAnswers({}); setCurrentQ(0); setResult(null); setTimeLeft(null); setQuizState("intro"); }}
                className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                Retake Quiz
              </button>
              <Link href={`/dashboard/courses/${courseId}/learn`}
                className="flex-1 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors text-center">
                Back to Course
              </Link>
            </div>
          </div>

          {/* Question breakdown */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900">Question Review</h3>
            {result.questionResults.map((qr, idx) => {
              const q = quiz.questions.find(q => q.id === qr.questionId);
              return (
                <div key={qr.questionId} className={cn("bg-white rounded-xl border p-4", qr.correct ? "border-green-200" : "border-red-200")}>
                  <div className="flex items-start gap-3">
                    <div className={cn("w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5", qr.correct ? "bg-green-100" : "bg-red-100")}>
                      {qr.correct ? (
                        <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-2">Q{idx + 1}. {q?.text}</p>
                      <div className="space-y-1 text-xs">
                        <div className={cn("px-2 py-1 rounded", qr.correct ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600")}>
                          Your answer: {qr.userAnswer || "(no answer)"}
                        </div>
                        {!qr.correct && qr.correctAnswer && (
                          <div className="px-2 py-1 rounded bg-green-50 text-green-700">
                            Correct: {qr.correctAnswer}
                          </div>
                        )}
                        {qr.explanation && (
                          <div className="px-2 py-1 rounded bg-blue-50 text-blue-700">{qr.explanation}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // IN PROGRESS
  if (!question) return null;

  const progress = ((currentQ + 1) / totalQ) * 100;
  type Option = { id: string; text: string; isCorrect?: boolean };
  const options = question.options ? (JSON.parse(question.options as string) as Option[]) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Quiz header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">Question {currentQ + 1} of {totalQ}</span>
            <div className="w-32 bg-gray-100 rounded-full h-2">
              <div className="bg-violet-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
          {timeLeft !== null && (
            <div className={cn("text-sm font-mono font-bold px-3 py-1 rounded-lg", timeLeft < 60 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-700")}>
              {formatTime(timeLeft)}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <p className="text-lg font-semibold text-gray-900 mb-6">{question.text}</p>

          {question.type === "TRUE_FALSE" && (
            <div className="grid grid-cols-2 gap-3">
              {["true", "false"].map((v) => (
                <button key={v} onClick={() => setAnswers(prev => ({ ...prev, [question.id]: v }))}
                  className={cn("py-4 rounded-xl border-2 font-semibold text-sm capitalize transition-all",
                    answers[question.id] === v ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 hover:border-violet-300 text-gray-700")}>
                  {v}
                </button>
              ))}
            </div>
          )}

          {question.type === "MULTIPLE_CHOICE" && options && (
            <div className="space-y-3">
              {options.map((opt) => (
                <button key={opt.id} onClick={() => setAnswers(prev => ({ ...prev, [question.id]: opt.id }))}
                  className={cn("w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all",
                    answers[question.id] === opt.id ? "border-violet-500 bg-violet-50 text-violet-700 font-medium" : "border-gray-200 hover:border-violet-300 text-gray-700")}>
                  <span className="font-semibold mr-2">{opt.id.toUpperCase()}.</span>{opt.text}
                </button>
              ))}
            </div>
          )}

          {question.type === "SHORT_ANSWER" && (
            <textarea
              value={answers[question.id] ?? ""}
              onChange={(e) => setAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              placeholder="Type your answer here..."
            />
          )}
        </div>

        <div className="flex items-center justify-between">
          <button onClick={() => setCurrentQ(q => Math.max(0, q - 1))} disabled={currentQ === 0}
            className="px-5 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl disabled:opacity-40 hover:bg-gray-50 transition-colors text-sm">
            ← Previous
          </button>

          {currentQ < totalQ - 1 ? (
            <button onClick={() => setCurrentQ(q => q + 1)}
              className="px-5 py-2.5 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors text-sm">
              Next →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitMutation.isPending}
              className="px-6 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors text-sm disabled:opacity-50">
              {submitMutation.isPending ? "Submitting..." : "Submit Quiz ✓"}
            </button>
          )}
        </div>

        {/* Question dots */}
        <div className="flex flex-wrap gap-2 mt-6 justify-center">
          {quiz.questions.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentQ(idx)}
              className={cn("w-8 h-8 rounded-full text-xs font-semibold transition-all",
                idx === currentQ ? "bg-violet-600 text-white" :
                answers[quiz.questions[idx]!.id] ? "bg-violet-100 text-violet-700" :
                "bg-gray-200 text-gray-600 hover:bg-gray-300")}>
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
