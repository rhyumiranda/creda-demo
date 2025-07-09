"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Trophy } from "lucide-react"

interface Quest {
  id: string
  title: string
  description: string
  progress: number
  maxProgress: number
  reward: number
  completed: boolean
}

interface QuestSectionProps {
  coinSymbol: string
  onQuestComplete: (coins: number) => void
}

export function QuestSection({ coinSymbol, onQuestComplete }: QuestSectionProps) {
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: "1",
      title: "Daily Login",
      description: "Log in to your account for 7 consecutive days",
      progress: 5,
      maxProgress: 7,
      reward: 50,
      completed: false,
    },
    {
      id: "2",
      title: "First Transaction",
      description: "Complete your first coin transaction",
      progress: 0,
      maxProgress: 1,
      reward: 100,
      completed: false,
    },
    {
      id: "3",
      title: "Mystery Box Explorer",
      description: "Open 3 mystery boxes from the shop",
      progress: 1,
      maxProgress: 3,
      reward: 75,
      completed: false,
    },
    {
      id: "4",
      title: "Coin Collector",
      description: "Accumulate 2000 coins in your wallet",
      progress: 1250,
      maxProgress: 2000,
      reward: 200,
      completed: false,
    },
  ])

  const handleCompleteQuest = (questId: string) => {
    setQuests((prev) =>
      prev.map((quest) => {
        if (quest.id === questId && quest.progress >= quest.maxProgress) {
          onQuestComplete(quest.reward)
          return { ...quest, completed: true }
        }
        return quest
      }),
    )
  }

  const activeQuests = quests.filter((q) => !q.completed)
  const completedQuests = quests.filter((q) => q.completed)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-light tracking-tight">Quests</h2>
      </div>

      <div className="grid gap-4">
        {activeQuests.map((quest) => (
          <Card key={quest.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-medium">{quest.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{quest.description}</p>
                </div>
                <Badge variant="outline" className="ml-4">
                  <Trophy className="mr-1 h-3 w-3" />
                  {quest.reward} {coinSymbol}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>
                    {quest.progress}/{quest.maxProgress}
                  </span>
                </div>
                <Progress value={(quest.progress / quest.maxProgress) * 100} className="h-2" />
              </div>

              {quest.progress >= quest.maxProgress && (
                <Button onClick={() => handleCompleteQuest(quest.id)} className="w-full">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Claim Reward
                </Button>
              )}
            </CardContent>
          </Card>
        ))}

        {completedQuests.length > 0 && (
          <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50">
            <CardHeader>
              <CardTitle className="text-green-800 dark:text-green-200">Completed Quests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {completedQuests.map((quest) => (
                  <div key={quest.id} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>{quest.title}</span>
                    <Badge variant="secondary" className="ml-auto">
                      +{quest.reward} {coinSymbol}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
