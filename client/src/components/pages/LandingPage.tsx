import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { File, BarChart3, ScanLine, Upload, Users, Lock, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const AnimatedGrid = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.3 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 h-full w-full bg-gradient-to-b from-gray-900 to-black"
    >
      <div
        className="absolute inset-0 bg-grid-white/[0.1] bg-center"
        style={{
          maskImage: "linear-gradient(to bottom, transparent, black, transparent)",
        }}
      ></div>
    </motion.div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()

  const features = [
    {
      icon: File,
      title: "Advanced Security",
      description: "End-to-end encryption ensures your files remain private and secure during transfer and storage.",
      glowColor: "from-cyan-500 to-blue-500",
    },
    {
      icon: ScanLine,
      title: "Virus Scanning",
      description: "Real-time malware detection and virus scanning protects against malicious files.",
      glowColor: "from-green-500 to-teal-500",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track file sharing activity, download statistics, and user engagement metrics.",
      glowColor: "from-purple-500 to-indigo-500",
    },
    {
      icon: Upload,
      title: "Easy Upload",
      description: "Drag and drop interface with support for large files and batch uploads.",
      glowColor: "from-yellow-500 to-orange-500",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share files with teams, set permissions, and manage access controls effortlessly.",
      glowColor: "from-pink-500 to-rose-500",
    },
    {
      icon: Lock,
      title: "Access Control",
      description: "Password protection, expiration dates, and download limits for enhanced security.",
      glowColor: "from-red-500 to-pink-500",
    },
  ]

  const stats = [
    { number: "99.9%", label: "Uptime Guarantee" },
    { number: "256-bit", label: "Encryption Standard" },
    { number: "10GB", label: "Max File Size" },
    { number: "24/7", label: "Support Available" },
  ]

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <AnimatedGrid />
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <File className="w-8 h-8 text-cyan-400" />
            <span className="text-2xl font-bold">SecureShare</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button size="sm" onClick={() => navigate("/signup")} className="bg-cyan-500 hover:bg-cyan-600">
              Sign Up
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Share Files
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 block">
              Securely & Smartly
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            The most secure file sharing platform with built-in analytics and virus scanning. Protect your data while gaining
            insights into your sharing activity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8 py-6 bg-cyan-500 hover:bg-cyan-600">
              Get Started Free
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Watch Demo
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">{stat.number}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose SecureShare?</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Built with security-first principles and packed with features that make file sharing simple yet powerful.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative group"
            >
              <div
                className={cn(
                  "absolute -inset-0.5 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-300",
                  `bg-gradient-to-r ${feature.glowColor}`,
                )}
              ></div>
              <Card className="bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors duration-300 relative">
                <CardHeader>
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed text-gray-400">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Secure Your Files?</h2>
          <p className="text-lg text-gray-400 mb-8">
            Join thousands of users who trust SecureShare for their file sharing needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6 bg-cyan-500 hover:bg-cyan-600">
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Contact Sales
            </Button>
          </div>
          <div className="flex items-center justify-center gap-4 mt-8 text-sm text-gray-300">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <File className="w-6 h-6 text-cyan-400" />
              <span className="text-xl font-bold">SecureShare</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Support
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            © 2025 SecureShare. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}