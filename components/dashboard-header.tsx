"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { NewProjectDialog } from "@/components/dialogs/new-project-dialog"
import { NewTaskDialog } from "@/components/dialogs/new-task-dialog"
import { useState } from "react"

interface DashboardHeaderProps {
  userName: string
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  const router = useRouter()
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false)
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false)

  return (
    <div className="mb-6 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Welcome back, {userName}. Here's what's happening today.
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 md:mt-0">
        <Button variant="default" onClick={() => setIsNewProjectOpen(true)} className="flex-1 md:flex-none">
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
        <Button variant="outline" onClick={() => setIsNewTaskOpen(true)} className="flex-1 md:flex-none">
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <NewProjectDialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen} />
      <NewTaskDialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen} />
    </div>
  )
}
