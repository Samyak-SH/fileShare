"use client"
import {
  File,
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
  onDropFileToFolder?: (fileId: string, targetFolderPath: string) => void
  onRenameFile?: (fileId: string, newName: string) => void
}

const getFileIcon = (type: string, isFolder: boolean) => {
  if (isFolder) return Folder
  if (type.startsWith("image/")) return ImageIcon
  if (type.startsWith("video/")) return Video
  if (type.startsWith("audio/")) return Music
  if (type.includes("pdf") || type.includes("document")) return FileText
  if (type.includes("zip") || type.includes("rar")) return Archive
  if (type.includes("javascript") || type.includes("typescript") || type.includes("json")) return Code
  return File
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
  onDropFileToFolder,
  onRenameFile,
}: FileListProps) {
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

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wide">Files ({files.length})</h2>
          <Button
            onClick={onCreateFolder}
            variant="outline"
            size="sm"
            className="flex items-center space-x-1 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent text-xs"
          >
            <FolderPlus className="h-3 w-3" />
            <span>New Folder</span>
          </Button>
        </div>

        <div className="flex items-center space-x-1 text-xs text-gray-400 overflow-x-auto">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.path} className="flex items-center space-x-1 flex-shrink-0">
              <button
                onClick={() => onBreadcrumbClick(index)}
                className={cn(
                  "hover:text-white transition-colors",
                  index === breadcrumbs.length - 1 ? "text-white font-medium" : "text-gray-400",
                )}
              >
                {crumb.name}
              </button>
              {index < breadcrumbs.length - 1 && <ChevronRight className="h-3 w-3 text-gray-600" />}
            </div>
          ))}
        </div>

        {currentPath !== "/" && (
          <Button
            onClick={onNavigateUp}
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2 text-gray-400 hover:text-white hover:bg-gray-800 mt-2 w-full justify-start p-2"
          >
            <ArrowUp className="h-4 w-4" />
            <span>Go up</span>
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {files.length === 0 ? (
          <div className="p-4">
            <div className="text-center text-gray-400 py-8">
              <Folder className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">This folder is empty</p>
              <p className="text-xs mt-1">Upload files or create folders to get started</p>
            </div>
          </div>
        ) : (
          <div className="p-2">
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
                  <div
                    key={file.id}
                    draggable={!file.isFolder}
                    onDragStart={(e) => e.dataTransfer.setData("text/plain", file.id)}
                    onDragOver={(e) => {
                      if (file.isFolder) e.preventDefault()
                    }}
                    onDrop={(e) => {
                      if (file.isFolder) {
                        const draggedFileId = e.dataTransfer.getData("text/plain")
                        onDropFileToFolder?.(draggedFileId, file.path.endsWith("/") ? file.path : file.path + "/")
                      }
                    }}
                    onClick={() => onFileSelect(file)}
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-colors",
                      "hover:bg-gray-900",
                      isSelected && "bg-gray-800 border border-gray-700",
                      file.isFolder && "hover:bg-gray-800"
                    )}
                  >
                    <IconComponent
                      className={cn("h-4 w-4 flex-shrink-0", file.isFolder ? "text-blue-400" : "text-gray-400")}
                    />

                    <div className="flex-1 min-w-0">
                      <div
                        contentEditable={!file.isFolder}
                        suppressContentEditableWarning
                        onDoubleClick={(e) => e.currentTarget.focus()}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            (e.currentTarget as HTMLElement).blur();
                          }
                        }}
                        onBlur={(e) => {
                          const newName = e.currentTarget.textContent?.trim();
                          if (newName && newName !== file.name) {
                            onRenameFile?.(file.id, newName);
                          }
                        }}
                        className="text-sm font-medium text-white truncate cursor-text"
                      >
                        {file.name}
                        {file.isFolder && <span className="text-gray-500 ml-1">/</span>}
                      </div>


                      <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                        {!file.isFolder && (
                          <>
                            <span>{formatFileSize(file.size)}</span>
                            <span>•</span>
                          </>
                        )}
                        <span>{formatDate(file.uploadedAt)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        )}
      </div>
    </div>
  )
}