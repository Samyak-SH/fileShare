"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Upload, LogOut, File } from "lucide-react"
import { FileList } from "@/components/file-list"
import { UploadModal } from "@/components/upload-modal"
import { CreateFolderModal } from "@/components/create-folder-modal"
import { GenerateUrlModal } from "@/components/generate-url-modal"
import { Toast } from "@/components/ui/toast"
import { useNavigate } from "react-router-dom"
import { verifyToken } from "../../verify"

const SERVER_URL = import.meta.env.VITE_SERVER_URL

interface FileItem {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: string
  path: string
  isFolder: boolean
  metadata?: any
}

// Map custom toast types to actual types supported by the Toast component
const mapToastType = (type: "info" | "error" | "success"): "default" | "destructive" => {
  return type === "error" ? "destructive" : "default"
}

export default function Home() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileItem[]>([])
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [currentPath, setCurrentPath] = useState("/")
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false)
  const [isGenerateUrlModalOpen, setIsGenerateUrlModalOpen] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "info" | "error" | "success" } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarWidth, setSidebarWidth] = useState(320)
  const [isResizing, setIsResizing] = useState(false)

  const sidebarRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const MIN_SIDEBAR_WIDTH = 250
  const MAX_SIDEBAR_WIDTH = 600

  const getCurrentPathFiles = () => {
    return files.filter((file) => {
      const filePath = file.path.substring(0, file.path.lastIndexOf("/") + 1)
      return filePath === currentPath
    })
  }

  useEffect(() => {
    const checkToken = async () => {
      if (!(await verifyToken())) {
        navigate("/login")
      }
    };
    checkToken();
    const loadFiles = async () => {
      try {
        const mockFiles: FileItem[] = [
          { id: "1", name: "Documents", size: 0, type: "folder", uploadedAt: "2024-01-15T10:30:00Z", path: "/Documents", isFolder: true },
          { id: "2", name: "Images", size: 0, type: "folder", uploadedAt: "2024-01-14T15:45:00Z", path: "/Images", isFolder: true },
          { id: "3", name: "document.pdf", size: 2048576, type: "application/pdf", uploadedAt: "2024-01-15T10:30:00Z", path: "/Documents/document.pdf", isFolder: false },
          { id: "4", name: "image.jpg", size: 1024000, type: "image/jpeg", uploadedAt: "2024-01-14T15:45:00Z", path: "/Images/image.jpg", isFolder: false },
          { id: "5", name: "spreadsheet.xlsx", size: 512000, type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", uploadedAt: "2024-01-13T09:20:00Z", path: "/spreadsheet.xlsx", isFolder: false },
          { id: "6", name: "Subfolder", size: 0, type: "folder", uploadedAt: "2024-01-12T08:15:00Z", path: "/Documents/Subfolder", isFolder: true },
          { id: "7", name: "nested-file.txt", size: 1024, type: "text/plain", uploadedAt: "2024-01-12T08:20:00Z", path: "/Documents/Subfolder/nested-file.txt", isFolder: false },
        ]
        setFiles(mockFiles)
      } catch (error) {
        setToast({ message: "Error loading files", type: "error" })
      } finally {
        setIsLoading(false)
      }
    }

    loadFiles()
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true)
    e.preventDefault()
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return
      const containerRect = containerRef.current.getBoundingClientRect()
      const newWidth = e.clientX - containerRect.left
      if (newWidth >= MIN_SIDEBAR_WIDTH && newWidth <= MAX_SIDEBAR_WIDTH) {
        setSidebarWidth(newWidth)
      }
    },
    [isResizing],
  )

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.body.style.cursor = ""
        document.body.style.userSelect = ""
      }
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  const handleLogout = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/logout`, {
        method: "POST",
        credentials: "include",
      })

      if (res.ok) {
        navigate("/login")
        setToast({ message: "Logged out successfully", type: "success" })
      } else {
        setToast({ message: "Logout failed", type: "error" })
      }
    } catch (error) {
      setToast({ message: "Something went wrong during logout", type: "error" })
    }
  }


  const handleFileUpload = async (file: File, fileName: string) => {
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("fileName", fileName)

      const fullPath = currentPath === "/" ? `/${fileName}` : `${currentPath}${fileName}`

      const metadata = {
        originalName: file.name,
        customName: fileName,
        size: file.size,
        type: file.type || "application/octet-stream",
        path: fullPath,
      }

      formData.append("metadata", JSON.stringify(metadata))
      formData.append("path", fullPath)
      // console.log(metadata);

      const response = await fetch(`${SERVER_URL}/api/uploadFile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(metadata),
      })

      const result = await response.json()
      console.log("result ", result.presignedURL)

      if (!response.ok) {
        setToast({ message: result.message || "Upload failed", type: "error" })
        return
      }
      
      const s3UploadResponse = await fetch(result.presignedURL, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
      })

      if (!s3UploadResponse.ok) {
        setToast({ message: "Upload failed", type: "error" })
        return
      }


      const newFile: FileItem = {
        id: Date.now().toString(),
        name: fileName,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        path: fullPath,
        isFolder: false,
        metadata,
      }

      setFiles((prev) => [newFile, ...prev])
      setSelectedFile(newFile)
      setToast({ message: `File "${fileName}" uploaded to ${fullPath}`, type: "success" })
    } catch (error) {
      console.error(error);
      setToast({ message: "Error uploading file", type: "error" })
      throw error
    }
  }

  const handleCreateFolder = async (folderName: string) => {
    try {
      const fullPath = currentPath === "/" ? `/${folderName}` : `${currentPath}${folderName}`
      const folderExists = files.some((file) => file.path === fullPath && file.isFolder)
      if (folderExists) {
        setToast({ message: "Folder already exists", type: "error" })
        return
      }

      const metadata = {
        name: folderName,
        path: fullPath,
        createdAt: new Date().toISOString(),
      }

      const newFolder: FileItem = {
        id: Date.now().toString(),
        name: folderName,
        size: 0,
        type: "folder",
        uploadedAt: new Date().toISOString(),
        path: fullPath,
        isFolder: true,
        metadata,
      }

      setFiles((prev) => [newFolder, ...prev])
      setToast({ message: `Folder "${folderName}" created at ${fullPath}`, type: "success" })
    } catch (error) {
      setToast({ message: "Error creating folder", type: "error" })
      throw error
    }
  }

  const handleGenerateUrl = async (settings: {
    viewOnce: boolean
    expireHours?: number
    maxViews?: number
  }) => {
    if (!selectedFile) return

    try {
      const requestData = {
        fileId: selectedFile.id,
        fileName: selectedFile.name,
        filePath: selectedFile.path,
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
        metadata: selectedFile.metadata,
        settings,
        createdAt: new Date().toISOString(),
      }

      const mockUrl = `https://share.example.com/${selectedFile.id}/${Date.now()}`

      setToast({ message: `Sharing URL generated successfully! URL: ${mockUrl}`, type: "success" })
      navigator.clipboard?.writeText(mockUrl)
    } catch (error) {
      setToast({ message: "Error generating sharing URL", type: "error" })
      throw error
    }
  }

  const handleFileSelect = (file: FileItem) => {
    if (file.isFolder) {
      const newPath = file.path === "/" ? "/" : `${file.path}/`
      setCurrentPath(newPath)
      setSelectedFile(null)
    } else {
      setSelectedFile(file)
    }
  }

  const handleNavigateUp = () => {
    if (currentPath === "/") return
    const pathParts = currentPath.split("/").filter(Boolean)
    pathParts.pop()
    const newPath = pathParts.length === 0 ? "/" : `/${pathParts.join("/")}/`
    setCurrentPath(newPath)
    setSelectedFile(null)
  }

  const handleBreadcrumbClick = (index: number) => {
    if (index === 0) {
      setCurrentPath("/")
    } else {
      const pathParts = currentPath.split("/").filter(Boolean)
      const newPath = `/${pathParts.slice(0, index).join("/")}/`
      setCurrentPath(newPath)
    }
    setSelectedFile(null)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {toast && (
        <Toast
          id="manual-toast"
          title={toast.message}
          type={mapToastType(toast.type)}
          onClose={() => setToast(null)}
        />
      )}

      <header className="flex justify-between items-center p-4 bg-black border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <File className="h-6 w-6 text-white" />
          <h1 className="text-xl font-semibold text-white">FileShare</h1>
        </div>

        <div className="flex items-center space-x-3">
          <Button onClick={() => setIsUploadModalOpen(true)} variant="outline" size="sm" className="flex items-center space-x-2 border-white text-white hover:bg-white hover:text-black bg-black">
            <Upload className="h-4 w-4" />
            <span>Upload</span>
          </Button>

          <Button onClick={handleLogout} variant="outline" size="sm" className="flex items-center space-x-2 border-white text-white hover:bg-white hover:text-black bg-black">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </header>

      <div ref={containerRef} className="flex h-[calc(100vh-73px)] relative">
        <div ref={sidebarRef} className="border-r border-gray-800 bg-black flex-shrink-0" style={{ width: `${sidebarWidth}px` }}>
          <FileList
            files={getCurrentPathFiles()}
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
            onCreateFolder={() => setIsCreateFolderModalOpen(true)}
            currentPath={currentPath}
            onNavigateUp={handleNavigateUp}
            onBreadcrumbClick={handleBreadcrumbClick}
            isLoading={isLoading}
          />
        </div>

        <div className="w-1 bg-gray-800 hover:bg-gray-600 cursor-col-resize flex-shrink-0 transition-colors duration-200 relative group" onMouseDown={handleMouseDown}>
          <div className="absolute inset-y-0 left-0 w-1 bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <div className="absolute inset-y-0 -left-1 -right-1 w-3" />
        </div>

        <div className="flex-1 bg-black min-w-0">
          <div className="p-6">
            {selectedFile && !selectedFile.isFolder ? (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-white mb-2">{selectedFile.name}</h2>
                  <p className="text-sm text-gray-500 mb-4">Path: {selectedFile.path}</p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                    <span>Size: {(selectedFile.size / 1024).toFixed(2)} KB</span>
                    <span>•</span>
                    <span>Type: {selectedFile.type}</span>
                    <span>•</span>
                    <span>Uploaded: {new Date(selectedFile.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button onClick={() => setIsGenerateUrlModalOpen(true)} className="bg-white text-black hover:bg-gray-200 font-medium px-6 py-2">
                    Generate Sharing URL
                  </Button>
                </div>

                <div className="text-center text-gray-400 mt-8">
                  <p>File analytics and additional details will be displayed here</p>
                </div>
              </div>
            ) : selectedFile && selectedFile.isFolder ? (
              <div className="text-center text-gray-400">
                <h2 className="text-xl font-semibold text-white mb-2">{selectedFile.name}</h2>
                <p className="text-sm text-gray-500 mb-4">Path: {selectedFile.path}</p>
                <p>Folder analytics will be displayed here</p>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <p>Select a file from the sidebar to view details and generate sharing URLs</p>
                <p className="text-sm text-gray-500 mt-2">Current path: {currentPath}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} onUpload={handleFileUpload} currentPath={currentPath} />
      <CreateFolderModal isOpen={isCreateFolderModalOpen} onClose={() => setIsCreateFolderModalOpen(false)} onCreateFolder={handleCreateFolder} currentPath={currentPath} />
      <GenerateUrlModal isOpen={isGenerateUrlModalOpen} onClose={() => setIsGenerateUrlModalOpen(false)} onGenerateUrl={handleGenerateUrl} selectedFile={selectedFile} />
    </div>
  )
}
