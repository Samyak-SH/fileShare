"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FolderPlus } from "lucide-react"

interface CreateFolderModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateFolder: (folderName: string) => Promise<void>
  currentPath: string
}

export function CreateFolderModal({ isOpen, onClose, onCreateFolder, currentPath }: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateFolder = async () => {
    if (!folderName.trim()) return

    // Validate folder name (no special characters that could break paths)
    const invalidChars = /[<>:"/\\|?*]/
    if (invalidChars.test(folderName)) {
      return // Could show error toast here
    }

    setIsCreating(true)
    try {
      await onCreateFolder(folderName.trim())
      handleClose()
    } catch (error) {
      // Error is handled in parent component
    } finally {
      setIsCreating(false)
    }
  }

  const handleClose = () => {
    setFolderName("")
    setIsCreating(false)
    onClose()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreateFolder()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white border-2 border-black">
        <DialogHeader>
          <DialogTitle className="text-black flex items-center space-x-2">
            <FolderPlus className="h-5 w-5" />
            <span>Create New Folder</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Path Display */}
          <div className="text-sm text-gray-600">
            <span className="font-medium">Location:</span> {currentPath}
          </div>

          {/* Folder Name Input */}
          <div className="space-y-2">
            <Label htmlFor="folderName" className="text-black">
              Folder Name
            </Label>
            <Input
              id="folderName"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter folder name"
              className="border-black focus:border-black"
              autoFocus
            />
            {folderName.trim().length === 0 && folderName.length > 0 && (
              <div className="text-xs text-red-600 mt-1">Folder name cannot be empty</div>
            )}
            {/[<>:"/\\|?*]/.test(folderName) && (
              <div className="text-xs text-red-600 mt-1">Folder name cannot contain: {'< > : " / \\ | ? *'}</div>
            )}
          </div>

          {/* Create Button */}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isCreating}
              className="border-black text-black hover:bg-black hover:text-white bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateFolder}
              disabled={!folderName.trim() || /[<>:"/\\|?*]/.test(folderName) || isCreating}
              className="bg-black text-white hover:bg-gray-900"
            >
              {isCreating ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <FolderPlus className="h-4 w-4" />
                  <span>Create Folder</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
