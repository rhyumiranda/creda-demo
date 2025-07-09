"use client"

import { Coins, Home, List, ShoppingBag, Send } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "#", icon: Home, current: true },
  { name: "Quests", href: "#quests", icon: List, current: false },
  { name: "Shop", href: "#shop", icon: ShoppingBag, current: false },
  { name: "Transactions", href: "#transactions", icon: Send, current: false },
]

export default function Sidebar() {
  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border lg:block hidden">
      <div className="flex h-full flex-col">
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-border">
          <div className="flex items-center gap-2">
            <Coins className="h-6 w-6" />
            <span className="text-lg font-semibold">CoinDash</span>
          </div>
        </div>

        <nav className="flex flex-1 flex-col p-4">
          <ul className="flex flex-1 flex-col gap-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex gap-3 rounded-md p-3 text-sm font-medium transition-colors",
                    item.current
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
