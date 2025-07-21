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
  const [searchQuery, setSearchQuery] = useState("");
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
    if (searchQuery.trim()) {
      return files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return files.filter((file) => {
      const filePath = file.path.substring(0, file.path.lastIndexOf("/") + 1);
      return filePath === currentPath;
    });
  }


  useEffect(() => {
    const checkToken = async () => {
      if (!(await verifyToken())) navigate("/login")
    }
    checkToken();

    const loadFiles = async () => {
      try {
        const token = localStorage.getItem("x-auth-token");
        const response = await fetch(`${SERVER_URL}/api/getAllFiles`, {
          method : "GET",
          headers : {
            "Content-Type" : "application/json",
            Authorization : `Bearer ${token}`
          },
          credentials: 'include',
        });
        const res = await response.json();
        if (!res.files) return;
        const rawFiles = res.files as any[];
        console.log(rawFiles);

        const flatFiles: FileItem[] = rawFiles.map((f) => {
          // const strippedName = f.name.includes("-") ? f.name.substring(0, f.name.lastIndexOf("-")) : f.name;
          console.log(f);
          return {
            id: f.fid,
            name: f.customname,
            size: parseInt(f.size),
            type: f.type,
            path: f.path,
            uploadedAt: f.uploadedAt || "",
            isFolder: false,
          };
        });

        const folderPaths = new Set<string>();
        flatFiles.forEach(file => {
          const parts = file.path.split('/').filter(Boolean);
          for (let i = 1; i < parts.length; i++) {
            const folderPath = '/' + parts.slice(0, i).join('/');
            folderPaths.add(folderPath);
          }
        });

        const folderFiles: FileItem[] = Array.from(folderPaths).map((path) => {
          const name = path.split('/').filter(Boolean).pop() || '';
          return {
            id: `folder-${path}`,
            name,
            size: 0,
            type: 'folder',
            path,
            uploadedAt: "",
            isFolder: true,
          };
        });

        const allFiles = [...folderFiles, ...flatFiles];
        setFiles(allFiles);
      } catch (error) {
        setToast({ message: "Error loading files", type: "error" });
      } finally {
        setIsLoading(false);
      }
    }
    loadFiles()
  }, [])

  const handleDropFileToFolder = async (fileId: string, targetFolderPath: string) => {
    const file = files.find(f => f.id === fileId && !f.isFolder);
    if (!file) return;
    const newPath = `${targetFolderPath}${file.name}`;
    console.log(file);
    try {
      const token = localStorage.getItem("x-auth-token");
      const res = await fetch(`${SERVER_URL}/api/updateFile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ fid: file.id, name: file.name, path: newPath })
      });

      if (!res.ok) throw new Error("Failed to move file");
      setFiles(prev => prev.map(f => f.id === fileId ? { ...f, path: newPath } : f));
      setToast({ message: `Moved "${file.name}"`, type: "success" });
    } catch {
      setToast({ message: "Failed to move file", type: "error" });
    }
  }

  const handleRenameFile = async (fileId: string, newName: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;
    const newPath = file.path.replace(/[^/]+$/, newName);
    try {
      const token = localStorage.getItem("x-auth-token");
      const res = await fetch(`${SERVER_URL}/api/updateFile`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
          Authorization : `Bearer ${token}`
        },
        credentials: "include",
        body: JSON.stringify({ fid: file.id, name: newName, path: newPath })
      });
      if (!res.ok) throw new Error("Failed to rename");
      setFiles(prev => prev.map(f => f.id === fileId ? { ...f, name: newName, path: newPath } : f));
      setToast({ message: `Renamed to "${newName}"`, type: "success" });
    } catch {
      setToast({ message: "Rename failed", type: "error" });
    }
  }

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
    localStorage.removeItem("x-auth-token");
    navigate("/login");
    // try {
    //   const res = await fetch(`${SERVER_URL}/logout`, {
    //     method: "POST",
    //     credentials: "include",
    //   })

    //   if (res.ok) {
    //     navigate("/login")
    //     setToast({ message: "Logged out successfully", type: "success" })
    //   } else {
    //     setToast({ message: "Logout failed", type: "error" })
    //   }
    // } catch (error) {
    //   setToast({ message: "Something went wrong during logout", type: "error" })
    // }
  }


  const handleFileUpload = async (file: File, fileName: string) => {
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("fileName", fileName)

      const fullPath = currentPath === "/" ? `/${fileName}` : `${currentPath}${fileName}`

      
      // formData.append("metadata", JSON.stringify(metadata))
      formData.append("path", fullPath)
      // console.log(metadata);
      const token = localStorage.getItem("x-auth-token");
      const response = await fetch(`${SERVER_URL}/api/uploadFile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization : `Bearer ${token}`
        },
        credentials: 'include',
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        const errorMsg = result.message || "Upload failed";
        setToast({ message: errorMsg, type: "error" });
        throw new Error(errorMsg);
      }
      
      const presignedURL = result.presignedURL;
      const fid = result.fid;
      const metadata = {
        originalName: file.name,
        customName: fileName,
        size: file.size,
        type: file.type || "application/octet-stream",
        path: fullPath,
        fid : fid
      }

      const s3UploadResponse = await fetch(presignedURL, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
      })

      if (!s3UploadResponse.ok) {
        const errorMsg = "Upload to S3 failed";
        setToast({ message: errorMsg, type: "error" });
        throw new Error(errorMsg);
      }

      const sucessVerification = await fetch(`${SERVER_URL}/api/uploadFileSucess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization : `Bearer ${token}`
        },
        credentials: 'include',
        body : JSON.stringify(metadata)
      })
      if(!sucessVerification.ok){
        const errorMsg = "Upload verification failed";
        setToast({message : errorMsg, type:"error"})
        throw new Error(errorMsg);
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
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-black border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <File className="h-6 w-6 text-white" />
          <h1 className="text-xl font-semibold text-white">FileShare</h1>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setIsUploadModalOpen(true)}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 border-white text-white hover:bg-white hover:text-black bg-black"
          >
            <Upload className="h-4 w-4" />
            <span>Upload</span>
          </Button>

          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 border-white text-white hover:bg-white hover:text-black bg-black"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </header>

      {/* Main Layout */}
      <div ref={containerRef} className="flex h-[calc(100vh-73px)] relative">
        {/* Left Sidebar - File List */}
        <div
          ref={sidebarRef}
          className="border-r border-gray-800 bg-black flex-shrink-0"
          style={{ width: `${sidebarWidth}px` }}
        >
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

        {/* Resize Handle */}
        <div
          className="w-1 bg-gray-800 hover:bg-gray-600 cursor-col-resize flex-shrink-0 transition-colors duration-200 relative group"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-y-0 left-0 w-1 bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <div className="absolute inset-y-0 -left-1 -right-1 w-3" />
        </div>

        {/* Right Content Area - Analytics */}
        <div className="flex-1 bg-black min-w-0">
          <div className="p-6">
            {selectedFile && !selectedFile.isFolder ? (
              <div className="space-y-6">
                {/* File Info */}
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

                {/* Generate URL Button */}
                <div className="flex justify-center space-x-4">
                  {" "}
                  {/* Added space-x-4 for spacing */}
                  <Button
                    onClick={() => setIsGenerateUrlModalOpen(true)}
                    className="bg-white text-black hover:bg-gray-200 font-medium px-6 py-2"
                  >
                    Generate Sharing URL
                  </Button>
                  <Button
                    onClick={() =>
                      window.open(`/view?id=${selectedFile.id}&name=${encodeURIComponent(selectedFile.name)}`, "_blank")
                    }
                    className="bg-black text-white hover:bg-gray-900 font-medium px-6 py-2"
                  >
                    View File
                  </Button>
                </div>

                {/* Placeholder for Analytics */}
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

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleFileUpload}
        currentPath={currentPath}
      />

      {/* Create Folder Modal */}
      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
        onCreateFolder={handleCreateFolder}
        currentPath={currentPath}
      />

      {/* Generate URL Modal */}
      <GenerateUrlModal
        isOpen={isGenerateUrlModalOpen}
        onClose={() => setIsGenerateUrlModalOpen(false)}
        onGenerateUrl={handleGenerateUrl}
        selectedFile={selectedFile}
      />
    </div>
  )

}