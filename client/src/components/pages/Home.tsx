import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, LogOut, File } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { verifyToken } from "../../verify"
import { Toast } from "@/components/ui/toast";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const Home = () => {
    const [uploadStatus, setUploadStatus] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "info" | "error" | "success" } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = async () => {
            if (!(await verifyToken())) {
                navigate("/login")
            }
        };
        checkToken();
    }, []);

    const handleLogout = async () => {
        await axios.post(`${SERVER_URL}/logout`, {}, {
            withCredentials: true,
        });

        setToast({ message: "Logged out!", type: "success" });
        navigate("/login");
    };

    const handleFileUpload = async (event: any) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setUploadStatus('');

        try {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('file', file);

            // In a real implementation, you'd send this to your backend
            await axios.get(`${SERVER_URL}/api/uploadFile`,{
                withCredentials : true
            })

            // Simulate upload delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            setUploadStatus(`File "${file.name}" uploaded successfully!`);
            setToast({ message: `File "${file.name}" uploaded successfully!`, type: "success" });
        } catch (error) {
            setUploadStatus('Error uploading file');
            setToast({ message: "Error uploading file", type: "error" });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Header with logout button */}
            <header className="flex justify-between items-center p-6 bg-black border-b border-gray-800">
                <div className="flex items-center space-x-2">
                    <File className="h-6 w-6 text-white" />
                    <h1 className="text-xl font-semibold text-white">FileShare</h1>
                </div>

                <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2 border-white text-white hover:bg-white hover:text-black bg-black"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                </Button>
            </header>

            {/* Main content */}
            <main className="flex items-center justify-center min-h-[calc(100vh-88px)] p-6">
                <div className="w-full max-w-md">
                    <Card className="shadow-2xl border-2 border-white bg-white">
                        <CardHeader className="text-center pb-4">
                            <div className="mx-auto mb-4 p-3 bg-black rounded-full w-fit">
                                <Upload className="h-8 w-8 text-white" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-black">
                                Upload Your File
                            </CardTitle>
                            <CardDescription className="text-gray-600">
                                Share your files securely with others
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* File Upload Button */}
                            <div className="relative">
                                <input
                                    type="file"
                                    id="file-upload"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleFileUpload}
                                    disabled={isUploading}
                                />
                                <Button
                                    className="w-full h-12 bg-black text-white font-medium hover:bg-gray-900 transition-colors duration-200 border-2 border-black"
                                    disabled={isUploading}
                                >
                                    {isUploading ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Uploading...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <Upload className="h-5 w-5" />
                                            <span>Choose File to Upload</span>
                                        </div>
                                    )}
                                </Button>
                            </div>

                            {/* Upload Status */}
                            {uploadStatus && (
                                <Alert className={`border-2 ${uploadStatus.includes('Error') ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'}`}>
                                    <AlertDescription className={`font-medium ${uploadStatus.includes('Error') ? 'text-red-700' : 'text-green-700'}`}>
                                        {uploadStatus}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Additional Info */}
                            <div className="text-center text-sm text-gray-500 border-t border-gray-200 pt-4">
                                <p className="font-medium">Supported formats: All file types</p>
                                <p className="font-medium">Maximum file size: 100MB</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default Home;