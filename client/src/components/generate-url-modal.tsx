"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Link, Clock, Eye, AlertCircle } from "lucide-react"

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

interface GenerateUrlModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerateUrl: (settings: {
    viewOnce: boolean
    expireHours?: number
    maxViews?: number
  }) => Promise<void>
  selectedFile: FileItem | null
}

export function GenerateUrlModal({ isOpen, onClose, onGenerateUrl, selectedFile }: GenerateUrlModalProps) {
  const [viewOnce, setViewOnce] = useState(false)
  const [expireHours, setExpireHours] = useState<number | undefined>(24)
  const [maxViews, setMaxViews] = useState<number | undefined>(10)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateUrl = async () => {
    if (!selectedFile) return

    setIsGenerating(true)
    try {
      const settings = {
        viewOnce,
        expireHours: viewOnce ? undefined : expireHours,
        maxViews: viewOnce ? undefined : maxViews,
      }

      await onGenerateUrl(settings)
      handleClose()
    } catch (error) {
      // Error is handled in parent component
    } finally {
      setIsGenerating(false)
    }
  }

  const handleClose = () => {
    setViewOnce(false)
    setExpireHours(24)
    setMaxViews(10)
    setIsGenerating(false)
    onClose()
  }

  const handleViewOnceChange = (checked: boolean) => {
    setViewOnce(checked)
    if (checked) {
      // Reset other options when view once is selected
      setExpireHours(undefined)
      setMaxViews(undefined)
    } else {
      // Set default values when view once is deselected
      setExpireHours(24)
      setMaxViews(10)
    }
  }

  if (!selectedFile) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white border-2 border-black">
        <DialogHeader>
          <DialogTitle className="text-black flex items-center space-x-2">
            <Link className="h-5 w-5" />
            <span>Generate Sharing URL</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">
              <div className="font-medium text-black mb-1">{selectedFile.name}</div>
              <div>Path: {selectedFile.path}</div>
              <div>Size: {(selectedFile.size / 1024).toFixed(2)} KB</div>
            </div>
          </div>

          {/* Sharing Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-black">Sharing Settings</h3>

            {/* View Once Option */}
            <div className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
              <Checkbox id="viewOnce" checked={viewOnce} onCheckedChange={handleViewOnceChange} className="mt-0.5" />
              <div className="flex-1">
                <Label htmlFor="viewOnce" className="text-black font-medium cursor-pointer">
                  View Once
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  The file can only be viewed once. After viewing, the link becomes invalid.
                </p>
              </div>
            </div>

            {/* Conditional Settings - Only show if View Once is not selected */}
            {!viewOnce && (
              <div className="space-y-4">
                {/* Expire Time */}
                <div className="space-y-2">
                  <Label htmlFor="expireHours" className="text-black flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Expire Time (Hours)</span>
                  </Label>
                  <Input
                    id="expireHours"
                    type="number"
                    min="1"
                    max="8760" // 1 year
                    value={expireHours || ""}
                    onChange={(e) => setExpireHours(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Enter hours (e.g., 24)"
                    className="border-black focus:border-black"
                  />
                  <p className="text-xs text-gray-500">Leave empty for no expiration. Maximum: 8760 hours (1 year)</p>
                </div>

                {/* Max Views */}
                <div className="space-y-2">
                  <Label htmlFor="maxViews" className="text-black flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>Maximum Views</span>
                  </Label>
                  <Input
                    id="maxViews"
                    type="number"
                    min="1"
                    max="1000"
                    value={maxViews || ""}
                    onChange={(e) => setMaxViews(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Enter max views (e.g., 10)"
                    className="border-black focus:border-black"
                  />
                  <p className="text-xs text-gray-500">Leave empty for unlimited views. Maximum: 1000 views</p>
                </div>
              </div>
            )}

            {/* Warning for View Once */}
            {viewOnce && (
              <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <strong>Warning:</strong> With "View Once" enabled, the file can only be accessed one time. After the
                  first view, the sharing link will become permanently invalid.
                </div>
              </div>
            )}
          </div>

          {/* Generate Button */}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isGenerating}
              className="border-black text-black hover:bg-black hover:text-white bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerateUrl}
              disabled={isGenerating}
              className="bg-black text-white hover:bg-gray-900"
            >
              {isGenerating ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link className="h-4 w-4" />
                  <span>Generate URL</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
