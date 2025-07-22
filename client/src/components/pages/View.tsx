"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Download, Scan, Loader2, XCircle, FileIcon } from "lucide-react" // Renamed File to FileIcon
import { Toast } from "@/components/ui/toast"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3001"

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

const AnimatedGrid = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.3 }}
    transition={{ duration: 1 }}
    className="absolute inset-0 h-full w-full bg-gradient-to-b from-gray-900 to-black"
  >
    <div
      className="absolute inset-0 bg-grid-white/[0.08] bg-center"
      style={{
        maskImage: "linear-gradient(to bottom, transparent, black, transparent)",
      }}
    ></div>
  </motion.div>
)

export default function ViewFilePage() {
  const [searchParams] = useSearchParams();
  const fileId = searchParams.get("id")
  const fileName = searchParams.get("name")

  const [fileDetails, setFileDetails] = useState<FileItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [scanStatus, setScanStatus] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "default" | "destructive" } | null>(null)

  useEffect(() => {
    if (!fileId || !fileName) {
      setToast({ message: "File ID or Name missing from URL.", type: "destructive" })
      setIsLoading(false)
      return
    }

    // Simulate fetching file details from the server
    // In a real application, you would fetch a presigned URL for the file content
    const fetchFileDetails = async () => {
      setIsLoading(true)
      try {
        // Mock file details based on query params
        const mockFile: FileItem = {
          id: fileId,
          name: fileName,
          size: 1024 * 1024, // Example size
          type: getMockFileType(fileName), // Determine type based on extension
          uploadedAt: new Date().toISOString(),
          path: `/uploads/${fileName}`,
          isFolder: false,
          metadata: {},
        }
        setFileDetails(mockFile)
      } catch (error) {
        setToast({ message: "Failed to load file details.", type: "destructive" })
      } finally {
        setIsLoading(false)
      }
    }

    fetchFileDetails()
  }, [fileId, fileName])

  const getMockFileType = (name: string): string => {
    const ext = name.split(".").pop()?.toLowerCase()
    switch (ext) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
        return `image/${ext}`
      case "mp4":
      case "webm":
      case "ogg":
        return `video/${ext}`
      case "mp3":
      case "wav":
        return `audio/${ext}`
      case "pdf":
        return "application/pdf"
      case "txt":
        return "text/plain"
      default:
        return "application/octet-stream" // Generic binary file
    }
  }

  const handleDownload = () => {
    if (!fileDetails) return

    // In a real application, you would request a download URL from your server
    // For now, we'll use a placeholder or a direct link if available
    const downloadUrl = `${SERVER_URL}/api/downloadFile?id=${fileDetails.id}&name=${encodeURIComponent(fileDetails.name)}`
    window.open(downloadUrl, "_blank")
    setToast({ message: `Downloading ${fileDetails.name}...`, type: "default" })
  }

  const handleScanVirus = async () => {
    if (!fileDetails) return

    setIsScanning(true)
    setScanStatus(null)
    try {
      // Simulate API call to scan for viruses
      // In a real implementation, send fileId to your backend for scanning
      const response = await fetch(`${SERVER_URL}/api/scanVirus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileId: fileDetails.id, fileName: fileDetails.name }),
      })

      const result = await response.json()

      if (response.ok) {
        if (result.isClean) {
          setScanStatus("No threats detected.")
          setToast({ message: "Virus scan completed: No threats detected.", type: "default" })
        } else {
          setScanStatus(`Threats detected: ${result.threats.join(", ")}`)
          setToast({ message: `Virus scan completed: Threats detected!`, type: "destructive" })
        }
      } else {
        setScanStatus(`Scan failed: ${result.message || "Unknown error"}`)
        setToast({ message: `Virus scan failed: ${result.message || "Unknown error"}`, type: "destructive" })
      }
    } catch (error) {
      setScanStatus("Scan failed due to network error.")
      setToast({ message: "Virus scan failed due to network error.", type: "destructive" })
    } finally {
      setIsScanning(false)
    }
  }

  const renderFileContent = () => {
    if (!fileDetails) return null

    const fileUrl = `/placeholder.svg?height=400&width=600` // Generic placeholder for now
    // In a real app, this would be a presigned URL from your backend
    // const fileUrl = `${SERVER_URL}/api/getFileContent?id=${fileDetails.id}`

    if (fileDetails.type.startsWith("image/")) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={fileUrl || "/placeholder.svg"}
          alt={fileDetails.name}
          className="max-w-full max-h-[70vh] object-contain mx-auto"
        />
      )
    } else if (fileDetails.type.startsWith("video/")) {
      return (
        <video controls className="max-w-full max-h-[70vh] mx-auto bg-black">
          <source src={fileUrl} type={fileDetails.type} />
          Your browser does not support the video tag.
        </video>
      )
    } else if (fileDetails.type.startsWith("audio/")) {
      return (
        <audio controls className="max-w-full mx-auto">
          <source src={fileUrl} type={fileDetails.type} />
          Your browser does not support the audio element.
        </audio>
      )
    } else {
      return (
        <div className="text-center text-gray-400 p-8 border border-gray-700 rounded-lg">
          <XCircle className="h-12 w-12 mx-auto mb-4 text-gray-500" />
          <p className="text-lg font-semibold text-white mb-2">Cannot display this file type directly.</p>
          <p className="text-sm text-gray-500">
            File Name: {fileDetails.name}
            <br />
            File Type: {fileDetails.type}
          </p>
          <Button onClick={handleDownload} className="mt-6 bg-white text-black hover:bg-gray-200">
            <Download className="h-4 w-4 mr-2" />
            Download File
          </Button>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-x-hidden">
      <AnimatedGrid />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50 shadow-lg"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileIcon className="w-8 h-8 text-cyan-400" />
            <span className="text-2xl font-bold">File Viewer</span>
            {fileDetails && <span className="text-cyan-300 ml-4">/ {fileDetails.name}</span>}
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleScanVirus}
              disabled={isScanning || !fileDetails}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 border-cyan-400 text-cyan-300 hover:bg-cyan-900/30 hover:text-white bg-transparent"
            >
              {isScanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Scan className="h-4 w-4" />}
              <span>{isScanning ? "Scanning..." : "Scan Virus"}</span>
            </Button>
            <Button
              onClick={handleDownload}
              disabled={!fileDetails}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 border-cyan-400 text-cyan-300 hover:bg-cyan-900/30 hover:text-white bg-transparent"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </Button>
          </div>
        </div>
      </motion.header>
      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-6 overflow-auto relative z-10">
        {isLoading ? (
          <div className="flex flex-col items-center text-cyan-300">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>Loading file...</p>
          </div>
        ) : fileDetails ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="bg-black/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800 p-8 max-w-2xl w-full">
              {renderFileContent()}
              {scanStatus && (
                <div
                  className={`mt-6 p-4 rounded-lg text-base font-semibold ${
                    scanStatus.includes("No threats") ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200"
                  }`}
                >
                  {scanStatus}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-cyan-400">
            <p className="text-lg font-medium">No file selected or found.</p>
            <p className="text-sm mt-2">Please navigate from the home page to view a file.</p>
          </div>
        )}
      </main>
    </div>
  )
}
