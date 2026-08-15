"use client"

import * as React from "react"
import { CheckCircle2, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useQuiz, useSubmitQuiz } from "@/hooks/use-api"
import { toast } from "sonner"

export function QuizInline({ quiz, tutorialId }: { quiz: any; tutorialId: string }) {
  const { data: fullQuiz } = useQuiz(quiz.id)
  const submit = useSubmitQuiz()
  const [answers, setAnswers] = React.useState<Record<string, number>>({})
  const [result, setResult] = React.useState<any>(null)

  if (!fullQuiz) return <div className="h-20 bg-muted/30 animate-pulse rounded-lg" />

  const onSubmit = () => {
    const arr = fullQuiz.questions.map((q: any) => ({
      questionId: q.id,
      selectedIndex: answers[q.id] ?? -1,
    }))
    submit.mutate(
      { id: quiz.id, answers: arr },
      {
        onSuccess: (res) => {
          setResult(res)
          if (res.passed) toast.success(`Quiz passed! +${res.xpAwarded} XP`)
          else toast.error(`You scored ${res.score}%. Passing is ${quiz.passingScore}%.`)
        },
      }
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span>{quiz.title}</span>
          <span className="text-xs text-muted-foreground font-normal">
            {quiz.xpReward} XP · pass {quiz.passingScore}%
          </span>
        </CardTitle>
        {quiz.description && <p className="text-sm text-muted-foreground">{quiz.description}</p>}
      </CardHeader>
      <CardContent className="space-y-5">
        {fullQuiz.questions.map((q: any, qi: number) => {
          const chosen = answers[q.id]
          const correct = result?.answers?.find((a: any) => a.questionId === q.id)
          return (
            <div key={q.id}>
              <p className="font-medium text-sm mb-2">{qi + 1}. {q.prompt}</p>
              <div className="space-y-1.5">
                {q.options.map((opt: string, oi: number) => {
                  const isChosen = chosen === oi
                  const isCorrect = result && oi === correct?.correctIndex
                  const isWrongChosen = result && isChosen && !correct?.correct
                  return (
                    <button
                      key={oi}
                      disabled={!!result}
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                      className={`w-full flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-left transition-colors ${
                        result
                          ? isCorrect
                            ? "border-primary/50 bg-primary/10 text-primary"
                            : isWrongChosen
                            ? "border-destructive/50 bg-destructive/10 text-destructive"
                            : "border-border text-muted-foreground"
                          : isChosen
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40 hover:bg-muted/40"
                      }`}
                    >
                      <span className="size-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold shrink-0">
                        {String.fromCharCode(65 + oi)}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {result && isCorrect && <CheckCircle2 className="size-4 text-primary" />}
                    </button>
                  )
                })}
              </div>
              {result && correct?.explanation && (
                <p className="text-xs text-muted-foreground mt-2 pl-2 border-l-2 border-border">
                  {correct.explanation}
                </p>
              )}
            </div>
          )
        })}
        {!result ? (
          <Button onClick={onSubmit} disabled={submit.isPending || Object.keys(answers).length === 0}>
            {submit.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            Submit answers
          </Button>
        ) : (
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <div className="font-semibold">
                {result.passed ? "Passed! 🎉" : "Not passed"}
              </div>
              <div className="text-sm text-muted-foreground">
                Score: {result.score}%
                {result.xpAwarded > 0 && ` · +${result.xpAwarded} XP`}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => { setResult(null); setAnswers({}) }}>
              Retake
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
