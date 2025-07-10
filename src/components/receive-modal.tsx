"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowDownLeft, Copy, Check } from "lucide-react"

interface ReceiveModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  coinSymbol: string
  onReceive: (amount: number) => void
}

export function ReceiveModal({ open, onOpenChange, coinSymbol, onReceive }: ReceiveModalProps) {
  const [amount, setAmount] = useState("")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")

  // Simulated wallet address
  const walletAddress = "0x1234567890abcdef1234567890abcdef12345678"

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy address")
    }
  }

  const handleSimulateReceive = () => {
    if (!amount) {
      setError("Please enter an amount")
      return
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    onReceive(Number(amount))
    setAmount("")
    setError("")
  }

  const handleClose = () => {
    setAmount("")
    setError("")
    setCopied(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowDownLeft className="h-5 w-5" />
            Receive {coinSymbol}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Your Wallet Address</Label>
            <div className="flex items-center gap-2">
              <Input value={walletAddress} readOnly className="font-mono text-sm" />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleCopyAddress}
                aria-label="Copy wallet address"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Share this address with others to receive {coinSymbol}</p>
          </div>

          {/* <div className="border-t pt-4">
            <div className="space-y-3">
              <Label htmlFor="simulate-amount">Simulate Receiving {coinSymbol}</Label>
              <Input
                id="simulate-amount"
                type="number"
                placeholder={`Enter amount of ${coinSymbol} to simulate`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="1"
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button onClick={handleSimulateReceive} className="w-full">
                Simulate Receive
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                This simulates receiving {coinSymbol} for demo purposes
              </p>
            </div>
          </div> */}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
  