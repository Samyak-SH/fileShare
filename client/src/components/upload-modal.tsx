"use client"

import type React from "react"
import { FileIcon } from "lucide-react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (file: File, fileName: string) => Promise<void>
  currentPath: string
}

export function UploadModal({ isOpen, onClose, onUpload, currentPath }: UploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setFileName("") // Start with empty name to force user input
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !fileName.trim()) return

    setIsUploading(true)
    try {
      await onUpload(selectedFile, fileName.trim())
      handleClose()
    } catch (error) {
      // Error is handled in parent component
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setFileName("")
    setIsUploading(false)
    setDragActive(false)
    onClose()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-black/70 border-2 border-cyan-700 backdrop-blur-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-cyan-300">Upload File</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Path Display */}
          <div className="text-sm text-cyan-200">
            <span className="font-medium">Upload to:</span> {currentPath}
          </div>

          {/* File Drop Zone */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center transition-colors relative",
              dragActive ? "border-cyan-400 bg-black/40" : "border-cyan-700 bg-black/30",
              "hover:border-cyan-400 hover:bg-black/40",
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="space-y-2">
                <FileIcon className="h-8 w-8 mx-auto text-cyan-400" />
                <div className="text-sm font-medium text-cyan-100">{selectedFile.name}</div>
                <div className="text-xs text-cyan-400">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type}
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelectedFile(null)} className="mt-2 border-cyan-700 text-cyan-200 hover:bg-cyan-900/30 hover:text-white bg-transparent">
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-8 w-8 mx-auto text-cyan-400" />
                <div className="text-sm text-cyan-400">Drag and drop a file here, or click to select</div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  style={{ left: 0, top: 0, right: 0, bottom: 0 }}
                  tabIndex={-1}
                />
              </div>
            )}
          </div>

          {/* File Name Input */}
          {selectedFile && (
            <div className="space-y-2">
              <Label htmlFor="fileName" className="text-cyan-200">
                File Name
              </Label>
              <Input
                id="fileName"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Enter a custom name for your file"
                className="border-cyan-700 focus:border-cyan-400 bg-black/40 text-cyan-100 placeholder-cyan-700"
              />
              {selectedFile && fileName.trim().length === 0 && (
                <div className="text-xs text-red-400 mt-1">File name is required</div>
              )}
            </div>
          )}

          {/* Upload Button */}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isUploading}
              className="border-cyan-700 text-cyan-200 hover:bg-cyan-900/30 hover:text-white bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || !fileName.trim() || fileName.trim().length === 0 || isUploading}
              className="bg-cyan-500 text-white hover:bg-cyan-600"
            >
              {isUploading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Upload</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
