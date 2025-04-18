import type { User, Project, Task, Message, Note, Meeting, Report } from "./types"

export const initialUsers: User[] = [
  {
    id: "user-1",
    name: "Alex Schmidt",
    email: "demo@icmw.de",
    role: "Project Manager",
    avatar: "/avatar.png",
    department: "Management",
    joinDate: "2022-01-15",
    isAdmin: true,
  },
  {
    id: "user-2",
    name: "Jane Doe",
    email: "jane@icmw.com",
    role: "UI Designer",
    avatar: "/avatar2.png",
    department: "Design",
    joinDate: "2022-03-10",
  },
  {
    id: "user-3",
    name: "Mike Thompson",
    email: "mike@icmw.com",
    role: "Frontend Developer",
    avatar: "/avatar3.png",
    department: "Development",
    joinDate: "2022-02-20",
  },
  {
    id: "user-4",
    name: "Sarah Lee",
    email: "sarah@icmw.com",
    role: "Marketing Specialist",
    avatar: "/avatar4.png",
    department: "Marketing",
    joinDate: "2022-04-05",
  },
]

export const initialProjects: Project[] = [
  {
    id: "project-1",
    name: "Eluxpro Website Redesign",
    description: "Complete redesign of the Eluxpro corporate website with new branding and improved UX.",
    progress: 65,
    status: "In Progress",
    priority: "High",
    startDate: "2024-07-01",
    dueDate: "2024-08-15",
    team: ["user-1", "user-2", "user-3"],
    color: "#3b82f6", // blue-500
  },
  {
    id: "project-2",
    name: "Yuzz Energy Marketing Campaign",
    description: "Digital marketing campaign for Yuzz Energy's new sustainable product line.",
    progress: 25,
    status: "Planning",
    priority: "Medium",
    startDate: "2024-08-01",
    dueDate: "2024-09-21",
    team: ["user-1", "user-4"],
    color: "#f59e0b", // amber-500
  },
  {
    id: "project-3",
    name: "Prendi Coffee Product Launch",
    description: "Product launch campaign for Prendi Coffee's new premium coffee line.",
    progress: 100,
    status: "Completed",
    priority: "High",
    startDate: "2024-06-01",
    dueDate: "2024-07-30",
    team: ["user-1", "user-2", "user-3", "user-4"],
    color: "#10b981", // emerald-500
  },
]

export const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Finalize homepage design",
    description: "Complete the final design for the homepage based on client feedback.",
    projectId: "project-1",
    status: "In Progress",
    priority: "High",
    assignees: ["user-2"],
    dueDate: "2024-08-12",
    createdBy: "user-1",
    createdAt: "2024-07-25",
  },
  {
    id: "task-2",
    title: "Finalize marketing budget",
    description: "Review and finalize the marketing budget for Q3 campaign.",
    projectId: "project-2",
    status: "To Do",
    priority: "High",
    assignees: ["user-4"],
    dueDate: "2024-08-15",
    createdBy: "user-1",
    createdAt: "2024-08-01",
  },
  {
    id: "task-3",
    title: "Mobile responsive testing",
    description: "Test website responsiveness across various mobile devices and browsers.",
    projectId: "project-1",
    status: "To Do",
    priority: "Medium",
    assignees: ["user-3"],
    dueDate: "2024-08-16",
    createdBy: "user-1",
    createdAt: "2024-08-02",
  },
  {
    id: "task-4",
    title: "Weekly team meeting",
    description: "Regular team sync to discuss project progress and blockers.",
    projectId: "project-1",
    status: "To Do",
    priority: "Medium",
    assignees: ["user-1", "user-2", "user-3", "user-4"],
    dueDate: "2024-08-18",
    createdBy: "user-1",
    createdAt: "2024-08-01",
  },
  {
    id: "task-5",
    title: "Create social media graphics",
    description: "Design promotional graphics for Instagram, Facebook, and Twitter.",
    projectId: "project-2",
    status: "In Progress",
    priority: "Medium",
    assignees: ["user-2"],
    dueDate: "2024-08-20",
    createdBy: "user-1",
    createdAt: "2024-08-05",
  },
  {
    id: "task-6",
    title: "Develop landing page",
    description: "Create responsive landing page for the new product line.",
    projectId: "project-2",
    status: "To Do",
    priority: "High",
    assignees: ["user-3"],
    dueDate: "2024-08-25",
    createdBy: "user-1",
    createdAt: "2024-08-07",
  },
  {
    id: "task-7",
    title: "SEO optimization",
    description: "Optimize website content for search engines.",
    projectId: "project-1",
    status: "To Do",
    priority: "Low",
    assignees: ["user-4"],
    dueDate: "2024-08-30",
    createdBy: "user-1",
    createdAt: "2024-08-08",
  },
]

export const initialMessages: Message[] = [
  {
    id: "message-1",
    senderId: "user-1",
    content: "Good morning team! Let's have a productive day.",
    timestamp: "2024-08-13T08:00:00Z",
    channelId: "general",
  },
  {
    id: "message-2",
    senderId: "user-2",
    content: "Morning Alex! I've completed the homepage mockups, will share in our meeting.",
    timestamp: "2024-08-13T08:05:00Z",
    channelId: "general",
  },
  {
    id: "message-3",
    senderId: "user-3",
    content: "I've fixed the responsive issues on the about page. Ready for review!",
    timestamp: "2024-08-13T08:10:00Z",
    channelId: "general",
  },
  {
    id: "message-4",
    senderId: "user-4",
    content: "Just got approval for the marketing budget. We're good to go!",
    timestamp: "2024-08-13T08:15:00Z",
    channelId: "general",
  },
  {
    id: "message-5",
    senderId: "user-2",
    content: "Hey Alex, can we discuss the color palette for the Eluxpro project?",
    timestamp: "2024-08-13T09:30:00Z",
    recipientId: "user-1",
  },
]

export const initialNotes: Note[] = [
  {
    id: "note-1",
    userId: "user-1",
    title: "Eluxpro Client Meeting Notes",
    content:
      "- Client prefers blue color scheme\n- Need to emphasize sustainability\n- Launch planned for September\n- Budget approved for extra features",
    timestamp: "2024-08-10T14:30:00Z",
    color: "#3b82f6",
    projectId: "project-1",
    isPublic: true,
  },
  {
    id: "note-2",
    userId: "user-1",
    title: "Team 1-on-1 Schedule",
    content: "- Jane: Mondays 10am\n- Mike: Tuesdays 2pm\n- Sarah: Wednesdays 11am",
    timestamp: "2024-08-11T09:15:00Z",
    color: "#10b981",
    isPublic: false,
  },
  {
    id: "note-3",
    userId: "user-1",
    title: "Project Ideas",
    content: "- Mobile app for Eluxpro\n- Sustainability dashboard\n- Customer feedback portal",
    timestamp: "2024-08-12T16:45:00Z",
    color: "#f59e0b",
    isPublic: true,
  },
]

export const initialMeetings: Meeting[] = [
  {
    id: "meeting-1",
    title: "Marketing Team Sync",
    description: "Weekly sync with marketing team to discuss campaign progress",
    startTime: "2024-08-13T10:00:00Z",
    endTime: "2024-08-13T10:30:00Z",
    location: "Zoom Meeting",
    organizer: "user-1",
    attendees: ["user-1", "user-4"],
  },
  {
    id: "meeting-2",
    title: "Eluxpro Design Review",
    description: "Review latest design mockups with the client",
    startTime: "2024-08-13T13:30:00Z",
    endTime: "2024-08-13T14:30:00Z",
    location: "Conference Room",
    organizer: "user-1",
    attendees: ["user-1", "user-2"],
  },
  {
    id: "meeting-3",
    title: "Budget Planning",
    description: "Q3 budget planning session",
    startTime: "2024-08-13T15:00:00Z",
    endTime: "2024-08-13T15:45:00Z",
    location: "Office",
    organizer: "user-1",
    attendees: ["user-1"],
  },
  {
    id: "meeting-4",
    title: "Client Call: Prendi Coffee",
    description: "Follow-up call with Prendi Coffee about product launch results",
    startTime: "2024-08-13T16:30:00Z",
    endTime: "2024-08-13T17:00:00Z",
    location: "Phone",
    organizer: "user-1",
    attendees: ["user-1", "user-4"],
  },
]

export const initialReports: Report[] = [
  {
    id: "report-1",
    title: "Q2 Marketing Performance",
    description: "Detailed analysis of Q2 marketing campaigns and performance metrics",
    fileUrl: "/reports/q2-marketing-performance.pdf",
    fileSize: 2500000,
    fileType: "application/pdf",
    uploadedBy: "user-4",
    uploadDate: "2024-07-15T10:30:00Z",
    viewPermissions: ["user-1", "user-4"],
    category: "marketing",
  },
  {
    id: "report-2",
    title: "Eluxpro Website Analytics",
    description: "Website traffic and user engagement analysis for Eluxpro",
    fileUrl: "/reports/eluxpro-analytics.xlsx",
    fileSize: 1800000,
    fileType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    uploadedBy: "user-1",
    uploadDate: "2024-08-01T14:45:00Z",
    viewPermissions: ["user-1", "user-2", "user-3"],
    category: "technical",
  },
  {
    id: "report-3",
    title: "Prendi Coffee Launch Results",
    description: "Post-launch analysis of the Prendi Coffee product line",
    fileUrl: "/reports/prendi-launch-results.pdf",
    fileSize: 3200000,
    fileType: "application/pdf",
    uploadedBy: "user-1",
    uploadDate: "2024-08-05T09:15:00Z",
    viewPermissions: ["user-1", "user-2", "user-3", "user-4"],
    category: "marketing",
  },
]
