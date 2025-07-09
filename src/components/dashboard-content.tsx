"use client"

import { useState } from "react"
import { WalletSection } from "./wallet-section"
import { QuestSection } from "./quest-section"
import { SendModal } from "./send-modal"
import { ReceiveModal } from "./receive-modal"
import { ShopSection } from "./shop-section"

export interface UserData {
  coins: number
  coinValue: number
  coinSymbol: string
  coinName: string
}

export default function DashboardContent() {
  const [userData, setUserData] = useState<UserData>({
    coins: 1250,
    coinValue: 0.85,
    coinSymbol: "DASH",
    coinName: "DashCoin",
  })

  const [sendModalOpen, setSendModalOpen] = useState(false)
  const [receiveModalOpen, setReceiveModalOpen] = useState(false)

  const handleSendCoins = (email: string, amount: number) => {
    if (amount <= userData.coins) {
      setUserData((prev) => ({
        ...prev,
        coins: prev.coins - amount,
      }))
      setSendModalOpen(false)
    }
  }

  const handleReceiveCoins = (amount: number) => {
    setUserData((prev) => ({
      ...prev,
      coins: prev.coins + amount,
    }))
    setReceiveModalOpen(false)
  }

  const handlePurchase = (cost: number) => {
    if (cost <= userData.coins) {
      setUserData((prev) => ({
        ...prev,
        coins: prev.coins - cost,
      }))
      return true
    }
    return false
  }

  return (
    <div className="p-6 space-y-8 wrapper">
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-light tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage your coins, complete quests, and explore the shop</p>
      </div>

      <WalletSection
        coins={userData.coins}
        coinValue={userData.coinValue}
        coinSymbol={userData.coinSymbol}
        onSendClick={() => setSendModalOpen(true)}
        onReceiveClick={() => setReceiveModalOpen(true)}
      />

      <QuestSection
        coinSymbol={userData.coinSymbol}
        onQuestComplete={(earned) => setUserData((prev) => ({ ...prev, coins: prev.coins + earned }))}
      />

      <ShopSection coins={userData.coins} onPurchase={handlePurchase} />

      <SendModal
        open={sendModalOpen}
        onOpenChange={setSendModalOpen}
        maxAmount={userData.coins}
        coinSymbol={userData.coinSymbol}
        onSend={handleSendCoins}
      />

      <ReceiveModal
        open={receiveModalOpen}
        onOpenChange={setReceiveModalOpen}
        coinSymbol={userData.coinSymbol}
        onReceive={handleReceiveCoins}
      />
    </div>
  )
}
