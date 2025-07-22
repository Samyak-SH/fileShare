"use client"
import {
  FileIcon,
  FileText,
  ImageIcon,
  Archive,
  Music,
  Video,
  Code,
  Loader2,
  Folder,
  FolderPlus,
  ArrowUp,
  ChevronRight,
  MoreHorizontal,
  FilePenLine,
} from "lucide-react"
import type React from "react"
import { AnimatePresence, motion } from "framer-motion"

import { useState } from "react" // Import useState for drag state
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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

interface FileListProps {
  files: FileItem[]
  selectedFile: FileItem | null
  onFileSelect: (file: FileItem) => void
  onCreateFolder: () => void
  currentPath: string
  onNavigateUp: () => void
  onBreadcrumbClick: (index: number) => void
  isLoading: boolean
  onRenameFile: (file: FileItem) => void
  onMoveFile: (draggedFileId: string, targetPath: string) => void
}

const getFileIcon = (type: string, isFolder: boolean) => {
  if (isFolder) return Folder
  if (type.startsWith("image/")) return ImageIcon
  if (type.startsWith("video/")) return Video
  if (type.startsWith("audio/")) return Music
  if (type.includes("pdf") || type.includes("document")) return FileText
  if (type.includes("zip") || type.includes("rar")) return Archive
  if (type.includes("javascript") || type.includes("typescript") || type.includes("json")) return Code
  return FileIcon
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return ""
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function FileList({
  files,
  selectedFile,
  onFileSelect,
  onCreateFolder,
  currentPath,
  onNavigateUp,
  onBreadcrumbClick,
  isLoading,
  onRenameFile,
  onMoveFile,
}: FileListProps) {
  const [isDraggingOverList, setIsDraggingOverList] = useState(false)

  // Create breadcrumb items
  const getBreadcrumbs = () => {
    if (currentPath === "/") return [{ name: "Root", path: "/" }]

    const parts = currentPath.split("/").filter(Boolean)
    const breadcrumbs = [{ name: "Root", path: "/" }]

    parts.forEach((part, index) => {
      const path = `/${parts.slice(0, index + 1).join("/")}/`
      breadcrumbs.push({ name: part, path })
    })

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  const handleDragStart = (e: React.DragEvent, fileId: string) => {
    e.dataTransfer.setData("fileId", fileId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault() // Necessary to allow dropping
    e.dataTransfer.dropEffect = "move"
    setIsDraggingOverList(true) // Set state for visual feedback
  }

  const handleDragLeave = (e: React.DragEvent) => {
    setIsDraggingOverList(false) // Reset state when drag leaves
  }

  const handleDropOnFolder = (e: React.DragEvent, targetFolder: FileItem) => {
    e.preventDefault()
    setIsDraggingOverList(false) // Reset state on drop
    const draggedFileId = e.dataTransfer.getData("fileId")
    if (draggedFileId && targetFolder.isFolder) {
      onMoveFile(draggedFileId, targetFolder.path)
    }
  }

  const handleDropOnList = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingOverList(false) // Reset state on drop
    const draggedFileId = e.dataTransfer.getData("fileId")
    if (draggedFileId) {
      // Move to the current directory (parent of the items in this list)
      onMoveFile(draggedFileId, currentPath)
    }
  }

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-black/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
      {/* Header with breadcrumbs */}
      <div className="p-6 border-b border-gray-800 flex-shrink-0 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-white uppercase tracking-wide drop-shadow">Files ({files.length})</h2>
          <Button
            onClick={onCreateFolder}
            variant="outline"
            size="sm"
            className="flex items-center space-x-1 border-cyan-600 text-cyan-300 hover:bg-cyan-900/30 hover:text-white bg-transparent text-xs shadow"
          >
            <FolderPlus className="h-4 w-4" />
            <span>New Folder</span>
          </Button>
        </div>

        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-1 text-xs text-cyan-300 overflow-x-auto">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.path} className="flex items-center space-x-1 flex-shrink-0">
              <button
                onClick={() => onBreadcrumbClick(index)}
                className={cn(
                  "hover:text-cyan-400 transition-colors font-medium",
                  index === breadcrumbs.length - 1 ? "text-white font-bold" : "text-cyan-300",
                )}
              >
                {crumb.name}
              </button>
              {index < breadcrumbs.length - 1 && <ChevronRight className="h-3 w-3 text-cyan-700" />}
            </div>
          ))}
        </div>

        {/* Up Navigation Button */}
        {currentPath !== "/" && (
          <Button
            onClick={onNavigateUp}
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2 text-cyan-400 hover:text-white hover:bg-cyan-900/30 mt-2 w-full justify-start p-2"
          >
            <ArrowUp className="h-4 w-4" />
            <span>Go up</span>
          </Button>
        )}
      </div>

      {/* File List - Main Drop Target */}
      <div
        className={cn(
          "flex-1 overflow-y-auto p-4 bg-black/30",
          isDraggingOverList && "border-2 border-dashed border-cyan-500 rounded-xl", // Visual feedback
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDropOnList} // Handle drop for moving to current directory
      >
        {files.length === 0 ? (
          <div className="p-4">
            <div className="text-center text-cyan-300 py-8">
              <Folder className="h-12 w-12 mx-auto mb-3 opacity-50 text-cyan-700" />
              <p className="text-base">This folder is empty</p>
              <p className="text-xs mt-1">Upload files or create folders to get started</p>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {/* Sort folders first, then files */}
            {[...files]
              .sort((a, b) => {
                if (a.isFolder && !b.isFolder) return -1
                if (!a.isFolder && b.isFolder) return 1
                return a.name.localeCompare(b.name)
              })
              .map((file) => {
                const IconComponent = getFileIcon(file.type, file.isFolder)
                const isSelected = selectedFile?.id === file.id

                return (
                  <motion.div
                    key={file.id}
                    layout
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    onClick={() => onFileSelect(file)}
                    draggable={true} // Make files/folders draggable
                    onDragStart={(e) => handleDragStart(e as any, file.id)}
                    onDragOver={file.isFolder ? handleDragOver : undefined} // Only folders are drop targets
                    onDrop={file.isFolder ? (e) => handleDropOnFolder(e, file) : undefined} // Only folders are drop targets
                    className={cn(
                      "flex items-center space-x-4 p-4 rounded-xl cursor-pointer transition-all duration-200 relative group shadow-sm",
                      "hover:bg-cyan-900/30 hover:shadow-lg",
                      isSelected && "bg-cyan-800/60 border-2 border-cyan-400 shadow-xl",
                      file.isFolder && "hover:bg-cyan-900/40",
                    )}
                    style={{
                      boxShadow: isSelected ? '0 4px 32px 0 rgba(0,255,255,0.10)' : undefined,
                    }}
                  >
                    <div className={cn("flex items-center justify-center h-9 w-9 rounded-lg",
                      file.isFolder ? "bg-cyan-900/40" : "bg-gray-800/60"
                    )}>
                      <IconComponent
                        className={cn("h-5 w-5 flex-shrink-0", file.isFolder ? "text-cyan-400" : "text-gray-300")}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className={cn("text-base font-semibold truncate flex items-center gap-1",
                        isSelected ? "text-cyan-200" : "text-white"
                      )} title={file.name}>
                        {file.name}
                        {file.isFolder && <span className="text-cyan-500 ml-1">/</span>}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-cyan-300 mt-1">
                        {!file.isFolder && (
                          <>
                            <span>{formatFileSize(file.size)}</span>
                            <span>•</span>
                          </>
                        )}
                        <span>{formatDate(file.uploadedAt)}</span>
                      </div>
                    </div>

                    {/* Dropdown Menu for actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 focus:opacity-100 bg-cyan-900/30 text-cyan-300 hover:text-white hover:bg-cyan-800/60"
                          onClick={(e) => e.stopPropagation()} // Prevent file selection on menu click
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-black/90 border-cyan-800 text-cyan-100 shadow-xl">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            onRenameFile(file)
                          }}
                          className="hover:bg-cyan-800/40 cursor-pointer"
                        >
                          <FilePenLine className="mr-2 h-4 w-4" />
                          <span>Rename</span>
                        </DropdownMenuItem>
                        {/* Add other actions here like Delete, Share etc. */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </motion.div>
                )
              })}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
