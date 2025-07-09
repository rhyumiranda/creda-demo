"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Gift, Sparkles, Star, Zap, Flame } from "lucide-react"

interface MysteryBox {
  id: string
  name: string
  cost: number
  icon: React.ReactNode
  rarity: "common" | "rare" | "epic" | "legendary"
  description: string
}

interface ShopSectionProps {
  coins: number
  onPurchase: (cost: number) => boolean
}

const mysteryBoxes: MysteryBox[] = [
  {
    id: "1",
    name: "Basic Chest",
    cost: 50,
    icon: <Gift className="h-6 w-6" />,
    rarity: "common",
    description: "Contains basic rewards and small coin bonuses",
  },
  {
    id: "2",
    name: "Rare Chest",
    cost: 150,
    icon: <Sparkles className="h-6 w-6" />,
    rarity: "rare",
    description: "Better rewards with moderate coin bonuses",
  },
  {
    id: "3",
    name: "Epic Chest",
    cost: 300,
    icon: <Star className="h-6 w-6" />,
    rarity: "epic",
    description: "High-value rewards and significant coin bonuses",
  },
  {
    id: "4",
    name: "Legendary Chest",
    cost: 500,
    icon: <Zap className="h-6 w-6" />,
    rarity: "legendary",
    description: "Exclusive rewards and massive coin bonuses",
  },
]

const rarityColors = {
  common: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  rare: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  epic: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  legendary: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
}

const rewards = [
  "25 DASH Bonus",
  "50 DASH Bonus",
  "100 DASH Bonus",
  "200 DASH Bonus",
  "500 DASH Bonus",
  "Rare Badge",
  "Epic Badge",
  "Legendary Badge",
  "Double Reward Boost",
  "Coin Multiplier",
  "Lucky Charm",
  "Golden Trophy",
  "Diamond Badge",
  "Platinum Status",
]

export function ShopSection({ coins, onPurchase }: ShopSectionProps) {
  const [rewardModal, setRewardModal] = useState<{ open: boolean; reward: string }>({
    open: false,
    reward: "",
  })

  const handlePurchase = (box: MysteryBox) => {
    const success = onPurchase(box.cost)
    if (success) {
      // Simulate random reward
      const randomReward = rewards[Math.floor(Math.random() * rewards.length)]
      setRewardModal({ open: true, reward: randomReward })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-light tracking-tight">Mystery Shop</h2>
          <Flame className="h-5 w-5 text-orange-500" />
        </div>
        <Badge variant="secondary" className="text-sm">
          {coins} DASH available
        </Badge>
      </div>

      <div className="text-sm text-muted-foreground mb-4">
        Burn your DASH coins to unlock mystery chests with exclusive rewards and bonuses
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mysteryBoxes.map((box) => (
          <Card key={box.id} className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {box.icon}
                  <CardTitle className="text-lg font-medium">{box.name}</CardTitle>
                </div>
                <Badge className={rarityColors[box.rarity]}>{box.rarity}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{box.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{box.cost}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  DASH <Flame className="h-3 w-3 text-orange-500" />
                </div>
              </div>

              <Button
                onClick={() => handlePurchase(box)}
                disabled={coins < box.cost}
                className="w-full"
                variant={coins < box.cost ? "secondary" : "default"}
              >
                {coins < box.cost ? "Insufficient DASH" : "Burn & Open"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={rewardModal.open} onOpenChange={(open) => setRewardModal({ ...rewardModal, open })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Congratulations!</DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <div className="text-6xl">🎉</div>
            <div>
              <p className="text-lg font-medium">You received:</p>
              <p className="text-2xl font-bold text-primary">{rewardModal.reward}</p>
            </div>
            <Button onClick={() => setRewardModal({ open: false, reward: "" })}>Awesome!</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
