"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Plus, Search, FileText, Download, Eye, Users, FolderPlus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useApp } from "@/context/app-context"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

// Define a type for report categories
interface ReportCategory {
  id: string
  name: string
  color: string
}

export default function ReportsPage() {
  const { reports, users, addReport, removeReport } = useApp()
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryColor, setNewCategoryColor] = useState("#3b82f6") // Default blue

  // Sample categories - in a real app, these would be stored in the database
  const [categories, setCategories] = useState<ReportCategory[]>([
    { id: "financial", name: "Financial", color: "#3b82f6" },
    { id: "marketing", name: "Marketing", color: "#10b981" },
    { id: "technical", name: "Technical", color: "#f59e0b" },
    { id: "hr", name: "HR", color: "#8b5cf6" },
  ])

  const [reportData, setReportData] = useState({
    title: "",
    description: "",
    category: "",
    viewPermissions: [] as string[],
  })

  if (!user) return null

  // Filter reports that the current user has permission to view
  const filteredReports = reports.filter(
    (report) =>
      (report.viewPermissions.includes(user.id) || report.uploadedBy === user.id) &&
      (report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedCategory === "all" || report.category === selectedCategory),
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const toggleUserPermission = (userId: string) => {
    setReportData((prev) => ({
      ...prev,
      viewPermissions: prev.viewPermissions.includes(userId)
        ? prev.viewPermissions.filter((id) => id !== userId)
        : [...prev.viewPermissions, userId],
    }))
  }

  const handleUploadReport = () => {
    if (!selectedFile || !reportData.title || !reportData.category) {
      toast({
        title: "Error",
        description: "Please provide a title, select a category, and select a file",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would upload the file to a storage service
    const fakeUrl = URL.createObjectURL(selectedFile)

    addReport({
      title: reportData.title,
      description: reportData.description,
      fileUrl: fakeUrl,
      fileSize: selectedFile.size,
      fileType: selectedFile.type,
      uploadedBy: user.id,
      category: reportData.category,
      viewPermissions: [...reportData.viewPermissions, user.id], // Always include current user
    })

    toast({
      title: "Report uploaded",
      description: "Your report has been uploaded successfully",
    })

    // Reset form and close dialog
    setSelectedFile(null)
    setReportData({
      title: "",
      description: "",
      category: "",
      viewPermissions: [],
    })
    setIsUploadDialogOpen(false)
  }

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Please provide a category name",
        variant: "destructive",
      })
      return
    }

    const newCategory: ReportCategory = {
      id: newCategoryName.toLowerCase().replace(/\s+/g, "-"),
      name: newCategoryName,
      color: newCategoryColor,
    }

    setCategories([...categories, newCategory])

    toast({
      title: "Category added",
      description: `${newCategoryName} has been added to categories`,
    })

    // Reset form and close dialog
    setNewCategoryName("")
    setNewCategoryColor("#3b82f6")
    setIsNewCategoryDialogOpen(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  const getUploader = (userId: string) => {
    return users.find((u) => u.id === userId)
  }

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.color : "#64748b" // Default slate color
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.name : "Uncategorized"
  }

  const colors = [
    { value: "#3b82f6", label: "Blue" },
    { value: "#10b981", label: "Green" },
    { value: "#f59e0b", label: "Amber" },
    { value: "#8b5cf6", label: "Purple" },
    { value: "#ef4444", label: "Red" },
  ]

  // Update the layout to be more responsive
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground md:flex-row">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        {/* Categories sidebar - hidden on mobile, shown as dropdown */}
        <div className="hidden w-64 border-r bg-card overflow-y-auto md:block">
          <div className="p-4">
            <h2 className="font-semibold mb-4">Categories</h2>
            <div className="space-y-1">
              <button
                className={`w-full text-left px-3 py-2 rounded-md ${selectedCategory === "all" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                onClick={() => setSelectedCategory("all")}
              >
                All Reports
              </button>

              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2 ${selectedCategory === category.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                  <span>{category.name}</span>
                </button>
              ))}

              <button
                className="w-full text-left px-3 py-2 rounded-md flex items-center gap-2 text-muted-foreground hover:bg-muted mt-4"
                onClick={() => setIsNewCategoryDialogOpen(true)}
              >
                <FolderPlus className="h-4 w-4" />
                <span>New Category</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-auto pb-16 pt-16 md:pt-0">
          <div className="container mx-auto p-4">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-xl md:text-2xl font-bold">Reports</h1>
                <p className="text-muted-foreground">
                  {selectedCategory === "all"
                    ? "View and manage all reports"
                    : `${getCategoryName(selectedCategory)} reports`}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                {/* Mobile category selector */}
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm md:hidden"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Reports</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button onClick={() => setIsUploadDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Report
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredReports.map((report) => {
                const uploader = getUploader(report.uploadedBy)
                return (
                  <Card key={report.id} className="overflow-hidden">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className="rounded-md p-2 sm:p-3 flex-shrink-0"
                          style={{ backgroundColor: `${getCategoryColor(report.category)}20` }}
                        >
                          <FileText className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: getCategoryColor(report.category) }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-medium truncate">{report.title}</h3>
                            <span
                              className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                              style={{
                                backgroundColor: `${getCategoryColor(report.category)}20`,
                                color: getCategoryColor(report.category),
                              }}
                            >
                              {getCategoryName(report.category)}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{report.description}</p>
                          <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              {uploader && (
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={uploader.avatar || "/placeholder.svg"} alt={uploader.name} />
                                  <AvatarFallback>
                                    {uploader.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {new Date(report.uploadDate).toLocaleDateString()}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">{formatFileSize(report.fileSize)}</span>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" asChild className="flex-shrink-0">
                            <a href={report.fileUrl} download={report.title}>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" asChild className="flex-shrink-0">
                            <a href={report.fileUrl} target="_blank" rel="noopener noreferrer">
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" className="flex-shrink-0">
                            <Users className="mr-2 h-4 w-4" />
                            {report.viewPermissions.length}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>filteredReports.length === 0 && (
              <div className="mt-10 text-center">
                <p className="text-muted-foreground">No reports found</p>
                <Button variant="outline" className="mt-2" onClick={() => setIsUploadDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload a report
                </Button>
              </div>
            )
          </div>
        </main>
      </div>
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload Report</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Report Title*</label>
              <Input
                placeholder="Enter report title"
                value={reportData.title}
                onChange={(e) => setReportData({ ...reportData, title: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Enter report description"
                value={reportData.description}
                onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Category*</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={reportData.category}
                onChange={(e) => setReportData({ ...reportData, category: e.target.value })}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">File*</label>
              {selectedFile ? (
                <div className="rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedFile(null)} className="h-8 w-8 p-0">
                      ×
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center rounded-md border border-dashed p-4">
                  <label className="flex cursor-pointer flex-col items-center">
                    <FileText className="mb-2 h-8 w-8 text-muted-foreground" />
                    <span className="text-sm font-medium">Click to select a file</span>
                    <span className="text-xs text-muted-foreground">PDF, DOCX, XLSX, etc.</span>
                    <Input type="file" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Who can view this report?</label>
              <div className="max-h-[150px] overflow-y-auto rounded-md border p-2">
                {users
                  .filter((u) => u.id !== user.id)
                  .map((u) => (
                    <div key={u.id} className="flex items-center space-x-2 py-1">
                      <Checkbox
                        id={`user-${u.id}`}
                        checked={reportData.viewPermissions.includes(u.id)}
                        onCheckedChange={() => toggleUserPermission(u.id)}
                      />
                      <label
                        htmlFor={`user-${u.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {u.name}
                      </label>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadReport}>Upload Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isNewCategoryDialogOpen} onOpenChange={setIsNewCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Category Name*</label>
              <Input
                placeholder="Enter category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Category Color</label>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`h-8 w-8 rounded-full ${newCategoryColor === color.value ? "ring-2 ring-ring ring-offset-2" : ""}`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setNewCategoryColor(color.value)}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory}>Create Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
