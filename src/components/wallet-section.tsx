"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send, ArrowDownLeft, Coins, TrendingUp } from "lucide-react"

interface WalletSectionProps {
  coins: number
  coinValue: number
  coinSymbol: string
  onSendClick: () => void
  onReceiveClick: () => void
}

export function WalletSection({ coins, coinValue, coinSymbol, onSendClick, onReceiveClick }: WalletSectionProps) {
  const totalValue = coins * coinValue

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-medium">Wallet</CardTitle>
        <div className="text-3xl font-light">
          {coins.toLocaleString()} {coinSymbol}
        </div>
        <p className="text-sm text-muted-foreground">
          ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Coins className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Balance</div>
              <div className="font-medium">
                {coins.toLocaleString()} {coinSymbol}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Coin Value</div>
              <div className="font-medium">${coinValue}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t">
          <Button onClick={onSendClick} size="lg" className="flex-1 rounded-full">
            <Send className="mr-2 h-4 w-4" />
            Send
          </Button>
          <Button onClick={onReceiveClick} variant="outline" size="lg" className="flex-1 rounded-full bg-transparent">
            <ArrowDownLeft className="mr-2 h-4 w-4" />
            Receive
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
