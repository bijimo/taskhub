"use client"

import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentProjects } from "@/components/recent-projects"
import { MyTasks } from "@/components/my-tasks"
import { UserSchedule } from "@/components/user-schedule"
import { QuickActions } from "@/components/quick-actions"
import { useAuth } from "@/context/auth-context"
import { AboutMe } from "@/components/about-me"

export default function Dashboard() {
  const { user } = useAuth()

  if (!user) return null

  // Update the return statement to be more responsive
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground md:flex-row">
      <Sidebar />
      <main className="flex-1 overflow-auto pb-16 pt-16 md:pt-0">
        <div className="container mx-auto p-4">
          <DashboardHeader userName={user.name} />
          <DashboardStats />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <RecentProjects />
              <MyTasks />
            </div>
            <div className="space-y-6">
              <UserSchedule />
              <QuickActions />
              <AboutMe />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
