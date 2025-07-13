import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import {verifyToken} from "../../verify"
import axios from "axios"

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function Login() {

  
  const navigate = useNavigate();
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
    // Clear error when user starts typing
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
      await axios.post(`${SERVER_URL}/login`, {
        email: formData.email,
        password: formData.password,
      }, {
        withCredentials: true,
      });

      alert('Login successful!');
      // navigate("/home");
    } catch (error: any) {
      if (error.response?.status === 404) {
        alert("User not found, Please sign up");
      } else if (error.response?.status === 401) {
        alert("Invalid Credentials");
      } else {
        alert("Login failed");
      }
    } finally {
      setIsSubmitting(false);
    }

};

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white border-black">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-black">Welcome Back</CardTitle>
          <CardDescription className="text-black">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-black flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-white border-black text-black placeholder-black focus:border-black focus:ring-black"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <Alert className="bg-white border-black">
                    <AlertDescription className="text-black text-sm">
                      {errors.email}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-black flex items-center gap-2">
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
                    className="bg-white border-black text-black placeholder-black focus:border-black focus:ring-black pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black hover:text-black"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <Alert className="bg-white border-black">
                    <AlertDescription className="text-black text-sm">
                      {errors.password}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              {/* Forgot Password */}
              <div className="text-right">
                <button
                  type="button"
                  className="text-black hover:text-black text-sm font-medium underline"
                >
                  Forgot password?
                </button>
              </div>
              
              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black hover:bg-black text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50"
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-black text-sm">
              Don't have an account?{' '}
              <button 
                onClick={() => navigate('/signup')}
                className="text-black hover:text-black font-medium underline"
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