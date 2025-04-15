"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import type { User, Project, Task, Message, Note, Meeting, FileItem, Report } from "@/lib/types"
import {
  initialUsers,
  initialProjects,
  initialTasks,
  initialMessages,
  initialNotes,
  initialMeetings,
  initialReports,
} from "@/lib/initial-data"
import { useAuth } from "@/context/auth-context"

interface AppContextType {
  // Users
  users: User[]
  addUser: (user: Omit<User, "id">) => void
  updateUser: (id: string, userData: Partial<User>) => void
  removeUser: (id: string) => void

  // Projects
  projects: Project[]
  addProject: (project: Omit<Project, "id">) => void
  updateProject: (id: string, projectData: Partial<Project>) => void
  removeProject: (id: string) => void

  // Tasks
  tasks: Task[]
  addTask: (task: Omit<Task, "id">) => void
  updateTask: (id: string, taskData: Partial<Task>) => void
  removeTask: (id: string) => void

  // Messages
  messages: Message[]
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void

  // Notes
  notes: Note[]
  addNote: (note: Omit<Note, "id" | "timestamp">) => void
  updateNote: (id: string, noteData: Partial<Note>) => void
  removeNote: (id: string) => void

  // Meetings
  meetings: Meeting[]
  addMeeting: (meeting: Omit<Meeting, "id">) => void
  updateMeeting: (id: string, meetingData: Partial<Meeting>) => void
  removeMeeting: (id: string) => void

  // Files
  files: FileItem[]
  addFile: (file: Omit<FileItem, "id" | "uploadDate">) => void
  removeFile: (id: string) => void

  // Reports
  reports: Report[]
  addReport: (report: Omit<Report, "id" | "uploadDate">) => void
  updateReport: (id: string, reportData: Partial<Report>) => void
  removeReport: (id: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings)
  const [files, setFiles] = useState<FileItem[]>([])
  const [reports, setReports] = useState<Report[]>(initialReports)

  // User functions
  const addUser = (userData: Omit<User, "id">) => {
    const newUser = { ...userData, id: `user-${Date.now()}` }
    setUsers([...users, newUser])
  }

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, ...userData } : user)))
  }

  const removeUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  // Project functions
  const addProject = (project: Omit<Project, "id">) => {
    const newProject = { ...project, id: `project-${Date.now()}` }
    setProjects([...projects, newProject])
  }

  const updateProject = (id: string, projectData: Partial<Project>) => {
    setProjects(projects.map((project) => (project.id === id ? { ...project, ...projectData } : project)))
  }

  const removeProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id))
    // Also remove associated tasks
    setTasks(tasks.filter((task) => task.projectId !== id))
  }

  // Task functions
  const addTask = (task: Omit<Task, "id">) => {
    const newTask = { ...task, id: `task-${Date.now()}` }
    setTasks([...tasks, newTask])
  }

  const updateTask = (id: string, taskData: Partial<Task>) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, ...taskData } : task)))
  }

  const removeTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  // Message functions
  const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
    const newMessage = {
      ...message,
      id: `message-${Date.now()}`,
      timestamp: new Date().toISOString(),
    }
    setMessages([...messages, newMessage])
  }

  // Note functions
  const addNote = (note: Omit<Note, "id" | "timestamp">) => {
    const newNote = {
      ...note,
      id: `note-${Date.now()}`,
      timestamp: new Date().toISOString(),
    }
    setNotes([...notes, newNote])
  }

  const updateNote = (id: string, noteData: Partial<Note>) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, ...noteData } : note)))
  }

  const removeNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  // Meeting functions
  const addMeeting = (meeting: Omit<Meeting, "id">) => {
    const newMeeting = { ...meeting, id: `meeting-${Date.now()}` }
    setMeetings([...meetings, newMeeting])
  }

  const updateMeeting = (id: string, meetingData: Partial<Meeting>) => {
    setMeetings(meetings.map((meeting) => (meeting.id === id ? { ...meeting, ...meetingData } : meeting)))
  }

  const removeMeeting = (id: string) => {
    setMeetings(meetings.filter((meeting) => meeting.id !== id))
  }

  // File functions
  const addFile = (file: Omit<FileItem, "id" | "uploadDate">) => {
    const newFile = {
      ...file,
      id: `file-${Date.now()}`,
      uploadDate: new Date().toISOString(),
    }
    setFiles([...files, newFile])
  }

  const removeFile = (id: string) => {
    setFiles(files.filter((file) => file.id !== id))
  }

  // Report functions
  const addReport = (report: Omit<Report, "id" | "uploadDate">) => {
    const newReport = {
      ...report,
      id: `report-${Date.now()}`,
      uploadDate: new Date().toISOString(),
    }
    setReports([...reports, newReport])
  }

  const updateReport = (id: string, reportData: Partial<Report>) => {
    setReports(reports.map((report) => (report.id === id ? { ...report, ...reportData } : report)))
  }

  const removeReport = (id: string) => {
    setReports(reports.filter((report) => report.id !== id))
  }

  const value = {
    users,
    addUser,
    updateUser,
    removeUser,
    projects,
    addProject,
    updateProject,
    removeProject,
    tasks,
    addTask,
    updateTask,
    removeTask,
    messages,
    addMessage,
    notes,
    addNote,
    updateNote,
    removeNote,
    meetings,
    addMeeting,
    updateMeeting,
    removeMeeting,
    files,
    addFile,
    removeFile,
    reports,
    addReport,
    updateReport,
    removeReport,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
