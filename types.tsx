export interface User {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  department?: string
  joinDate?: string
  isAdmin?: boolean
}

export interface Project {
  id: string
  name: string
  description: string
  progress: number
  status: "Planning" | "In Progress" | "On Hold" | "Completed"
  priority: "Low" | "Medium" | "High"
  startDate: string
  dueDate: string
  team: string[] // User IDs
  color?: string
}

export interface Task {
  id: string
  title: string
  description: string
  projectId: string
  status: "To Do" | "In Progress" | "Review" | "Completed"
  priority: "Low" | "Medium" | "High"
  assignees: string[] // User IDs
  dueDate: string
  createdBy: string // User ID
  createdAt: string
  completedAt?: string
}

export interface Message {
  id: string
  senderId: string
  content: string
  timestamp: string
  channelId?: string // For company chat
  recipientId?: string // For direct messages
}

export interface Note {
  id: string
  userId: string
  title: string
  content: string
  timestamp: string
  color?: string
  projectId?: string // Optional, for project-specific notes
}

export interface Meeting {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  location: string
  organizer: string // User ID
  attendees: string[] // User IDs
  isRecurring?: boolean
  recurrencePattern?: string
}

export interface FileItem {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedBy: string // User ID
  uploadDate: string
  projectId?: string // Optional, for project-specific files
}

export interface Report {
  id: string
  title: string
  description: string
  fileUrl: string
  fileSize: number
  fileType: string
  uploadedBy: string // User ID
  uploadDate: string
  viewPermissions: string[] // User IDs who can view this report
}
