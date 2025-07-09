"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Send } from "lucide-react"

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
  const [errors, setErrors] = useState<{ email?: string; amount?: string }>({})

  const validateForm = () => {
    const newErrors: { email?: string; amount?: string } = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!amount) {
      newErrors.amount = "Amount is required"
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount"
    } else if (Number(amount) > maxAmount) {
      newErrors.amount = `Amount cannot exceed ${maxAmount} ${coinSymbol}`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSend(email, Number(amount))
      setEmail("")
      setAmount("")
      setErrors({})
    }
  }

  const handleClose = () => {
    setEmail("")
    setAmount("")
    setErrors({})
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send {coinSymbol}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Recipient Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter recipient's email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ({coinSymbol})</Label>
            <Input
              id="amount"
              type="number"
              placeholder={`Enter amount of ${coinSymbol} to send`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={maxAmount}
              min="1"
              step="1"
              aria-describedby={errors.amount ? "amount-error" : undefined}
            />
            {errors.amount && (
              <p id="amount-error" className="text-sm text-destructive">
                {errors.amount}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Available: {maxAmount} {coinSymbol}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Send {coinSymbol}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
