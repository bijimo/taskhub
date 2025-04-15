"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Plus, Search, File, Download, Trash2, Upload, FolderPlus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useApp } from "@/context/app-context"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

export default function FilesPage() {
  const { files, projects, addFile, removeFile } = useApp()
  const { user } = useAuth()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProjectId, setUploadProjectId] = useState("")
  const [newFolderName, setNewFolderName] = useState("")
  const [activeView, setActiveView] = useState<"grid" | "list">("grid")

  if (!user) return null

  // Filter files based on search and selected project
  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesProject = selectedProject ? file.projectId === selectedProject : true
    return matchesSearch && matchesProject
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUploadFile = () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would upload to a storage service and get a URL back
    const fakeUrl = URL.createObjectURL(selectedFile)

    addFile({
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
      url: fakeUrl,
      uploadedBy: user.id,
      projectId: uploadProjectId || undefined,
    })

    toast({
      title: "File uploaded",
      description: `${selectedFile.name} has been uploaded successfully`,
    })

    // Reset form and close dialog
    setSelectedFile(null)
    setUploadProjectId("")
    setIsUploadDialogOpen(false)
  }

  const handleDeleteFile = (fileId: string) => {
    removeFile(fileId)
    toast({
      title: "File deleted",
      description: "The file has been deleted successfully",
    })
  }

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a folder name",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would create a folder in your database
    toast({
      title: "Folder created",
      description: `${newFolderName} has been created successfully`,
    })

    // Reset form and close dialog
    setNewFolderName("")
    setIsNewFolderDialogOpen(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("image")) return "🖼️"
    if (fileType.includes("pdf")) return "📄"
    if (fileType.includes("spreadsheet") || fileType.includes("excel")) return "📊"
    if (fileType.includes("document") || fileType.includes("word")) return "📝"
    if (fileType.includes("presentation") || fileType.includes("powerpoint")) return "📽️"
    return "📁"
  }

  const getProjectColor = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    return project?.color || "#64748b" // Default slate color
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-1 overflow-hidden">
        {/* Project sidebar */}
        <div className="w-64 border-r bg-card overflow-y-auto">
          <div className="p-4">
            <h2 className="font-semibold mb-4">Projects</h2>
            <div className="space-y-1">
              <button
                className={`w-full text-left px-3 py-2 rounded-md ${!selectedProject ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                onClick={() => setSelectedProject(null)}
              >
                All Files
              </button>

              {projects.map((project) => (
                <div key={project.id} className="space-y-1">
                  <button
                    className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between ${selectedProject === project.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                    onClick={() => setSelectedProject(project.id)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: project.color }}></div>
                      <span className="truncate">{project.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {files.filter((f) => f.projectId === project.id).length}
                    </Badge>
                  </button>

                  {selectedProject === project.id && (
                    <div className="ml-5 border-l pl-3 space-y-1">
                      <button
                        className="w-full text-left px-3 py-1.5 rounded-md text-sm flex items-center gap-2 hover:bg-muted"
                        onClick={() => {
                          setUploadProjectId(project.id)
                          setIsUploadDialogOpen(true)
                        }}
                      >
                        <Upload className="h-3.5 w-3.5" />
                        <span>Upload to this project</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}

              <button
                className="w-full text-left px-3 py-2 rounded-md flex items-center gap-2 text-muted-foreground hover:bg-muted mt-4"
                onClick={() => setIsNewFolderDialogOpen(true)}
              >
                <FolderPlus className="h-4 w-4" />
                <span>New Folder</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold">Files</h1>
                <p className="text-muted-foreground">
                  {selectedProject
                    ? `Files for ${projects.find((p) => p.id === selectedProject)?.name}`
                    : "All project files"}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search files..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className={activeView === "grid" ? "bg-muted" : ""}
                    onClick={() => setActiveView("grid")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-grid-2x2"
                    >
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M3 12h18" />
                      <path d="M12 3v18" />
                    </svg>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className={activeView === "list" ? "bg-muted" : ""}
                    onClick={() => setActiveView("list")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-list"
                    >
                      <line x1="8" x2="21" y1="6" y2="6" />
                      <line x1="8" x2="21" y1="12" y2="12" />
                      <line x1="8" x2="21" y1="18" y2="18" />
                      <line x1="3" x2="3.01" y1="6" y2="6" />
                      <line x1="3" x2="3.01" y1="12" y2="12" />
                      <line x1="3" x2="3.01" y1="18" y2="18" />
                    </svg>
                  </Button>
                </div>
                <Button onClick={() => setIsUploadDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload File
                </Button>
              </div>
            </div>

            {activeView === "grid" ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredFiles.map((file) => (
                  <Card key={file.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-xl">
                          {getFileIcon(file.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium truncate">{file.name}</h3>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {formatFileSize(file.size)} • {new Date(file.uploadDate).toLocaleDateString()}
                          </p>
                          {file.projectId && (
                            <div className="mt-2">
                              <span
                                className="inline-flex items-center rounded-full px-2 py-1 text-xs"
                                style={{
                                  backgroundColor: `${getProjectColor(file.projectId)}20`,
                                  color: getProjectColor(file.projectId),
                                }}
                              >
                                {projects.find((p) => p.id === file.projectId)?.name}
                              </span>
                            </div>
                          )}
                          <div className="mt-4 flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <a href={file.url} download={file.name}>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </a>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteFile(file.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="rounded-md border">
                <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b">
                  <div className="col-span-5">Name</div>
                  <div className="col-span-3">Project</div>
                  <div className="col-span-2">Size</div>
                  <div className="col-span-2">Date</div>
                </div>
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/50 border-b last:border-0"
                  >
                    <div className="col-span-5 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-lg">
                        {getFileIcon(file.type)}
                      </div>
                      <span className="truncate">{file.name}</span>
                    </div>
                    <div className="col-span-3">
                      {file.projectId ? (
                        <span
                          className="inline-flex items-center rounded-full px-2 py-1 text-xs"
                          style={{
                            backgroundColor: `${getProjectColor(file.projectId)}20`,
                            color: getProjectColor(file.projectId),
                          }}
                        >
                          {projects.find((p) => p.id === file.projectId)?.name}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </div>
                    <div className="col-span-2 text-sm text-muted-foreground">{formatFileSize(file.size)}</div>
                    <div className="col-span-2 text-sm text-muted-foreground">
                      {new Date(file.uploadDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredFiles.length === 0 && (
              <div className="mt-10 text-center">
                <p className="text-muted-foreground">No files found</p>
                <Button variant="outline" className="mt-2" onClick={() => setIsUploadDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload a file
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Upload File Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {!selectedFile ? (
              <div
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Support for documents, images, and other file types
                </p>
                <Input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
              </div>
            ) : (
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <File className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-medium text-sm">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedFile(null)}>
                    ×
                  </Button>
                </div>
              </div>
            )}

            <div className="grid gap-2">
              <label className="text-sm font-medium">Project (Optional)</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={uploadProjectId}
                onChange={(e) => setUploadProjectId(e.target.value)}
              >
                <option value="">None</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadFile} disabled={!selectedFile}>
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Folder Dialog */}
      <Dialog open={isNewFolderDialogOpen} onOpenChange={setIsNewFolderDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Folder Name*</label>
              <Input
                placeholder="Enter folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewFolderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>Create Folder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
