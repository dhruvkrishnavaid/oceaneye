import { useEffect } from "react";

export default function AdminApp() {
  useEffect(() => {
    document.title = "OceanEye Admin Panel";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">
            Manage users, monitor system status, and configure settings.
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">User Management</h2>
          <p className="text-gray-700 mb-6">
            View and manage registered users, assign roles, and monitor activity.
          </p>
          <h2 className="text-2xl font-semibold mb-4">System Monitoring</h2>
          <p className="text-gray-700 mb-6">
            Real-time system status, error logs, and performance metrics.
          </p>
          <h2 className="text-2xl font-semibold mb-4">Settings</h2>
          <p className="text-gray-700">
            Configure application settings, notification preferences, and more.
          </p>
        </div>
      </div>
    </div>
  );
}