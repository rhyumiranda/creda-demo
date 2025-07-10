"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SendModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  maxAmount: number
  coinSymbol: string
  onSend: (email: string, amount: number) => void
}

export function SendModal({ open, onOpenChange, maxAmount, coinSymbol, onSend }: SendModalProps) {
  const [email, setEmail] = useState("")
  const [amount, setAmount] = useState("")

  const handleSend = () => {
    const sendAmount = parseFloat(amount)
    if (email && sendAmount > 0 && sendAmount <= maxAmount) {
      onSend(email, sendAmount)
      setEmail("")
      setAmount("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send {coinSymbol}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Recipient Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="recipient@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              max={maxAmount}
            />
            <p className="text-sm text-muted-foreground">
              Available: {maxAmount} {coinSymbol}
            </p>
          </div>
          <Button onClick={handleSend} className="w-full">
            Send {coinSymbol}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}