import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuthStore } from "@/stores/authStore";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  LogIn,
  LogOut,
  MapPin,
  Menu,
  User,
  Users,
  Waves,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close notifications when clicking outside or pressing ESC
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showNotifications]);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-900 text-white shadow-xl backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-b-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo Section */}
        <Link
          to="/"
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur opacity-30"></div>
            <div className="relative bg-white/10 p-2 rounded-full backdrop-blur border border-white/20">
              <Waves className="h-6 w-6 text-cyan-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              OceanEye
            </span>
            <span className="text-xs text-cyan-200/80 font-medium">
              Coastal Monitoring
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link to="/">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-cyan-100 transition-all duration-200"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-cyan-100 transition-all duration-200 relative"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Dashboard
              <Badge className="ml-2 bg-red-500 hover:bg-red-500 text-white text-xs">
                Live
              </Badge>
            </Button>
          </Link>
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-white">
                  {user?.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white hover:bg-white/10 hover:text-cyan-100 transition-all duration-200"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 hover:text-cyan-100 transition-all duration-200"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            </Link>
          )}

          {/* Status Indicators */}
          <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-white/20">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Activity className="h-4 w-4 text-green-400 animate-pulse" />
                <span className="text-sm text-green-400 font-medium">
                  Active
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-cyan-300" />
              <span className="text-sm text-cyan-100">328 Online</span>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-80 bg-gradient-to-b from-blue-900 to-blue-800 text-white border-blue-700 overflow-y-auto"
            >
              <div className="flex flex-col space-y-4 mt-6 pb-6">
                {/* Mobile Logo */}
                <div className="flex items-center space-x-3 pb-4 border-b border-white/20">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur opacity-30"></div>
                    <div className="relative bg-white/10 p-2 rounded-full backdrop-blur border border-white/20">
                      <Waves className="h-5 w-5 text-cyan-300" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold">OceanEye</span>
                    <span className="text-sm text-cyan-200">
                      Coastal Monitoring
                    </span>
                  </div>
                </div>

                {/* Mobile Navigation Links */}
                <div className="space-y-3">
                  <Link to="/">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-white/10 h-12"
                    >
                      <MapPin className="mr-3 h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">Home</div>
                        <div className="text-xs text-cyan-200">
                          Project Overview & Features
                        </div>
                      </div>
                    </Button>
                  </Link>

                  <Link to="/dashboard">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-white/10 h-12"
                    >
                      <AlertTriangle className="mr-3 h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium flex items-center">
                          Dashboard
                          <Badge className="ml-2 bg-red-500 text-white text-xs">
                            Live
                          </Badge>
                        </div>
                        <div className="text-xs text-cyan-200">
                          Real-time Monitoring & Reports
                        </div>
                      </div>
                    </Button>
                  </Link>

                  {/* Additional Feature Links for Mobile */}
                  <div className="pt-3 border-t border-white/10">
                    <div className="text-xs text-cyan-200 font-medium mb-3 px-3">
                      FEATURES
                    </div>
                    
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-white/10 h-10 mb-2"
                    >
                      <Waves className="mr-3 h-4 w-4" />
                      <div className="text-left">
                        <div className="text-sm font-medium">Citizen Reports</div>
                        <div className="text-xs text-cyan-200">Community Alerts</div>
                      </div>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-white/10 h-10 mb-2"
                    >
                      <Activity className="mr-3 h-4 w-4" />
                      <div className="text-left">
                        <div className="text-sm font-medium">Social Monitoring</div>
                        <div className="text-xs text-cyan-200">Social Media Analysis</div>
                      </div>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-white/10 h-10 mb-2"
                    >
                      <MapPin className="mr-3 h-4 w-4" />
                      <div className="text-left">
                        <div className="text-sm font-medium">Interactive Map</div>
                        <div className="text-xs text-cyan-200">Real-time Locations</div>
                      </div>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-white/10 h-10"
                    >
                      <AlertTriangle className="mr-3 h-4 w-4" />
                      <div className="text-left">
                        <div className="text-sm font-medium">Early Warnings</div>
                        <div className="text-xs text-cyan-200">Hazard Alerts</div>
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Mobile Authentication Section */}
                {isAuthenticated ? (
                  <div className="space-y-3 pt-4 border-t border-white/20">
                    <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm">
                          {user?.name}
                        </div>
                        <div className="text-xs text-cyan-200">Logged in</div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full justify-start text-white hover:bg-white/10 h-10"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      <div className="text-left">
                        <div className="text-sm font-medium">Logout</div>
                        <div className="text-xs text-cyan-200">Sign out</div>
                      </div>
                    </Button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-white/20">
                    <Link to="/login">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-white hover:bg-white/10 h-10"
                      >
                        <LogIn className="mr-3 h-4 w-4" />
                        <div className="text-left">
                          <div className="text-sm font-medium">Login</div>
                          <div className="text-xs text-cyan-200">
                            Sign in to account
                          </div>
                        </div>
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Mobile Status Cards */}
                <div className="space-y-2 pt-4 border-t border-white/20">
                  <div className="text-xs text-cyan-200 font-medium mb-2 px-3">
                    SYSTEM STATUS
                  </div>
                  
                  <Card className="bg-white/10 border-white/20 text-white">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4 text-green-400 animate-pulse" />
                          <span className="text-sm font-medium">System</span>
                        </div>
                        <Badge className="bg-green-500 text-white text-xs">
                          Active
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 border-white/20 text-white">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-cyan-300" />
                          <span className="text-sm font-medium">Online</span>
                        </div>
                        <span className="text-cyan-100 font-mono text-sm">328</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
