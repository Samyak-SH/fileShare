import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, BarChart3, ScanLine, Upload, Users, Lock, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Shield,
      title: "Advanced Security",
      description: "End-to-end encryption ensures your files remain private and secure during transfer and storage."
    },
    {
      icon: ScanLine,
      title: "Virus Scanning",
      description: "Real-time malware detection and virus scanning protects against malicious files."
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track file sharing activity, download statistics, and user engagement metrics."
    },
    {
      icon: Upload,
      title: "Easy Upload",
      description: "Drag and drop interface with support for large files and batch uploads."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share files with teams, set permissions, and manage access controls effortlessly."
    },
    {
      icon: Lock,
      title: "Access Control",
      description: "Password protection, expiration dates, and download limits for enhanced security."
    }
  ];

  const stats = [
    { number: "99.9%", label: "Uptime Guarantee" },
    { number: "256-bit", label: "Encryption Standard" },
    { number: "10GB", label: "Max File Size" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">SecureShare</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              Login
            </Button>
            <Button size="sm">
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Share Files
            <span className="text-primary block">Securely & Smartly</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The most secure file sharing platform with built-in analytics and virus scanning. 
            Protect your data while gaining insights into your sharing activity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started Free
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose SecureShare?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built with security-first principles and packed with features that make file sharing simple yet powerful.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Security Focus Section */}
      <section className="bg-slate-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Enterprise-Grade Security
            </h2>
            <p className="text-lg text-slate-300 mb-12">
              Your files are protected with the same level of security used by Fortune 500 companies.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">End-to-End Encryption</h3>
                <p className="text-slate-300">Files encrypted before leaving your device</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ScanLine className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Scanning</h3>
                <p className="text-slate-300">Advanced threat detection and prevention</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Audit Trails</h3>
                <p className="text-slate-300">Complete visibility into file access</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Secure Your Files?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of users who trust SecureShare for their file sharing needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6">
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Contact Sales
            </Button>
          </div>
          <div className="flex items-center justify-center gap-4 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Shield className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">SecureShare</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-300">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-400">
            © 2025 SecureShare. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}