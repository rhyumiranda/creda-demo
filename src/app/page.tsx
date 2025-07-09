"use client"
import Sidebar from "@/components/sidebar"
import DashboardContent from "@/components/dashboard-content"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <main className="wrapper">
        <DashboardContent />
      </main>
    </div>
  )
}
