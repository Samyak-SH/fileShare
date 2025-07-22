import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, File } from 'lucide-react';
import {verifyToken} from "../../verify"
import axios from "axios"
import { motion } from 'framer-motion';
import { ToastContext } from '@/components/ui/toast';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

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
);

export default function Login() {
  const navigate = useNavigate();
  const { addToast } = useContext(ToastContext);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      if (await verifyToken()) {
        navigate("/home");
      }
    };
    checkToken();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${SERVER_URL}/login`, {
        email: formData.email,
        password: formData.password,
      }, {
        withCredentials: true,
      });
      if(response.status===200){
        const token = response.headers['x-auth-token'];
        localStorage.setItem('x-auth-token', token);
        addToast({ id: Date.now().toString(), title: 'Login successful!', type: 'default' });
        navigate("/home")
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        addToast({ id: Date.now().toString(), title: "User not found, Please sign up", type: "destructive" });
      } else if (error.response?.status === 401) {
        addToast({ id: Date.now().toString(), title: "Invalid Credentials", type: "destructive" });
      } else {
        addToast({ id: Date.now().toString(), title: "Login failed", type: "destructive" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedGrid />
      <Card className="w-full max-w-md bg-gray-900/80 border border-gray-800 shadow-xl backdrop-blur-md relative">
        <CardHeader className="text-center flex flex-col items-center gap-2">
          <File className="w-10 h-10 text-cyan-400 mb-2" />
          <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
          <CardDescription className="text-gray-300">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <Alert className="bg-gray-900 border-cyan-700">
                    <AlertDescription className="text-cyan-400 text-sm">
                      {errors.email}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500 pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <Alert className="bg-gray-900 border-cyan-700">
                    <AlertDescription className="text-cyan-400 text-sm">
                      {errors.password}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              {/* Forgot Password */}
              <div className="text-right">
                <button
                  type="button"
                  className="text-cyan-400 hover:text-cyan-300 text-sm font-medium underline"
                >
                  Forgot password?
                </button>
              </div>
              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50"
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-300 text-sm">
              Don't have an account?{' '}
              <button 
                onClick={() => navigate('/signup')}
                className="text-cyan-400 hover:text-cyan-300 font-medium underline"
              >
                Create account
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}