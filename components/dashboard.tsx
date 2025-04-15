"use client"

import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentProjects } from "@/components/recent-projects"
import { RecentTasks } from "@/components/recent-tasks"
import { UserProfile } from "@/components/user-profile"
import { UserSchedule } from "@/components/user-schedule"
import { QuickActions } from "@/components/quick-actions"
import { useApp } from "@/context/app-context"

export default function Dashboard() {
  const { currentUser } = useApp()

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-4">
          <DashboardHeader userName={currentUser.name} />
          <DashboardStats />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <RecentProjects />
              <RecentTasks />
            </div>
            <div className="space-y-6">
              <UserProfile />
              <UserSchedule />
              <QuickActions />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
