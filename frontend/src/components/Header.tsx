import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuthStore } from "@/stores/authStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  LogIn,
  LogOut,
  MapPin,
  Menu,
  Shield,
  User,
  Users,
  Waves,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();

  // Subscribe to unreadCount with proper reactivity
  const unreadCount = useNotificationStore(state => state.unreadCount);
  const fetchNotifications = useNotificationStore(state => state.fetchNotifications);

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Fetch notifications when component mounts
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

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

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
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

            {/* {isAuthenticated && (
              <div className="flex items-center space-x-2 relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNotificationClick}
                  className="text-white hover:bg-white/10 hover:text-cyan-100 transition-all duration-200 relative"
                >
                  <Bell className="h-4 w-4 text-yellow-400" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>

                {showNotifications && (
                  <div
                    ref={notificationRef}
                    className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                      <h3 className="text-lg font-semibold text-gray-900">Active Reports</h3>
                        </h3>
                        <div className="flex items-center space-x-2">
                          {unreadCount > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={markAllAsRead}
                              className="text-blue-600 hover:text-blue-800 text-xs"
                            >
                              Mark all read
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowNotifications(false)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                          <p>No active reports</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 ${getSeverityColor(notification.severity, notification.unread)} border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-medium text-gray-900 text-sm">
                                    {notification.title}
                                  </h4>
                                  {notification.unread && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  )}
                                  <Badge
                                    className={`${getSeverityBadgeColor(notification.severity)} text-xs`}
                                  >
                                    {notification.severity}
                                  </Badge>
                                </div>
                                <p className="text-gray-600 text-sm mt-1">
                                  {notification.message}
                                </p>
                                <div className="flex items-center space-x-1 mt-2">
                                  <Clock className="h-3 w-3 text-gray-400" />
                                  <span className="text-xs text-gray-500">
                                    {notification.time}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <div className="p-3 bg-gray-50 border-t border-gray-200">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          View all reports
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )} */}
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
              className="w-80 bg-gradient-to-b from-blue-900 to-blue-800 text-white border-blue-700"
            >
              <div className="flex flex-col space-y-6 mt-8">
                {/* Mobile Logo */}
                <div className="flex items-center space-x-3 pb-6 border-b border-white/20">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur opacity-30"></div>
                    <div className="relative bg-white/10 p-2 rounded-full backdrop-blur border border-white/20">
                      <Waves className="h-6 w-6 text-cyan-300" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold">OceanEye</span>
                    <span className="text-sm text-cyan-200">
                      Coastal Monitoring Platform
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
                          Project Overview
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
                          Real-time Monitoring
                        </div>
                      </div>
                    </Button>
                  </Link>
                </div>

                {/* Mobile Authentication Section */}
                {isAuthenticated ? (
                  <div className="space-y-3 pt-6 border-t border-white/20">
                    <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {user?.name}
                        </div>
                        <div className="text-sm text-cyan-200">Logged in</div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full justify-start text-white hover:bg-white/10 h-12"
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">Logout</div>
                        <div className="text-xs text-cyan-200">Sign out</div>
                      </div>
                    </Button>
                  </div>
                ) : (
                  <div className="pt-6 border-t border-white/20">
                    <Link to="/login">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-white hover:bg-white/10 h-12"
                      >
                        <LogIn className="mr-3 h-5 w-5" />
                        <div className="text-left">
                          <div className="font-medium">Login</div>
                          <div className="text-xs text-cyan-200">
                            Sign in to account
                          </div>
                        </div>
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Mobile Status Cards */}
                <div className="space-y-3 pt-6 border-t border-white/20">
                  <Card className="bg-white/10 border-white/20 text-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4 text-green-400 animate-pulse" />
                          <span className="font-medium">System Status</span>
                        </div>
                        <Badge className="bg-green-500 text-white">
                          Active
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 border-white/20 text-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-cyan-300" />
                          <span className="font-medium">Online Users</span>
                        </div>
                        <span className="text-cyan-100 font-mono">328</span>
                      </div>
                    </CardContent>
                  </Card>

                  {isAuthenticated && (
                    <Card
                      className="bg-white/10 border-white/20 text-white cursor-pointer hover:bg-white/20 transition-colors"
                      onClick={handleNotificationClick}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Shield className="h-4 w-4 text-yellow-400" />
                            <span className="font-medium">Active Alerts</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">
                              {unreadCount}
                            </Badge>
                            {unreadCount > 0 && (
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
