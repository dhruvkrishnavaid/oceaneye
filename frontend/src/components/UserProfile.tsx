import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";

export default function UserProfile() {
  const { isAuthenticated, user, logout } = useAuthStore();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900">{user.name}</div>
          <div className="text-xs text-gray-500">{user.role}</div>
        </div>
      </div>
      <Button 
        onClick={logout} 
        variant="outline" 
        size="sm"
        className="text-gray-600 hover:text-gray-800"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}