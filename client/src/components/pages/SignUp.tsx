import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import axios from "axios"

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
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
          await axios.post(`${SERVER_URL}/signup`, {
            name:formData.name,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword
          });
          // Success feedback
          alert('Signup success, Please login!');
          navigate("/login");
          // Optionally handle response, e.g. navigate or store token
        } catch (error:any) {
          if(error.status===409){
            alert("user already exists");
          }else{
            alert("failed to create user");
          }
        } finally {
          setIsSubmitting(false);
        }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white border-black">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-black">Create Account</CardTitle>
          <CardDescription className="text-black">
            Join us today and get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-black flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-white border-black text-black placeholder-black focus:border-black focus:ring-black"
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <Alert className="bg-white border-black">
                    <AlertDescription className="text-black text-sm">
                      {errors.name}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
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
                    placeholder="Create a password"
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
              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-black flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="bg-white border-black text-black placeholder-black focus:border-black focus:ring-black pr-10"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black hover:text-black"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <Alert className="bg-white border-black">
                    <AlertDescription className="text-black text-sm">
                      {errors.confirmPassword}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black hover:bg-black text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50"
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <p className="text-black text-sm">
              Already have an account?{' '}
              <button 
                onClick={() => navigate('/login')}
                className="text-black hover:text-black font-medium underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}