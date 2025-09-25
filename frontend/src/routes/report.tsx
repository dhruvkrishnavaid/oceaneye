import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  AlertTriangle,
  Camera,
  MapPin,
  Upload,
  Waves,
  X,
  FileImage,
  FileVideo,
} from "lucide-react";

export const Route = createFileRoute("/report")({
  component: ReportIncidentPage,
});

// Types matching backend models
type SeverityLevel = "low" | "medium" | "high" | "critical";
type CoastalHazardType =
  | "hurricane"
  | "tsunami"
  | "coastal_erosion"
  | "oil_spill"
  | "harmful_algal_bloom"
  | "flooding"
  | "sea_level_rise"
  | "storm_surge"
  | "earthquake"
  | "landslide"
  | "waterspout"
  | "overfishing"
  | "plastic_debris"
  | "shipping_accident"
  | "maritime_pollution"
  | "ocean_acidification"
  | "ocean_warming"
  | "habitat_destruction"
  | "ocean_noise_pollution"
  | "dangerous_sea_creatures"
  | "high_waves"
  | "unusual_tide"
  | "coastal_damage"
  | "erosion"
  | "debris"
  | "other";

interface IncidentFormData {
  title: string;
  description: string;
  location: string;
  coordinates: [number, number];
  severity: SeverityLevel;
  type: CoastalHazardType;
  author: string;
}

function ReportIncidentPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [locationError, setLocationError] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);

  // Form state
  const [formData, setFormData] = useState<IncidentFormData>({
    title: "",
    description: "",
    location: "",
    coordinates: [0, 0],
    severity: "medium",
    type: "other",
    author: user?.name || "Anonymous",
  });

  // Severity options
  const severityOptions = [
    {
      value: "low",
      label: "Low",
      description: "Minor incident, no immediate danger",
    },
    {
      value: "medium",
      label: "Medium",
      description: "Moderate concern, monitoring needed",
    },
    {
      value: "high",
      label: "High",
      description: "Serious incident, attention required",
    },
    {
      value: "critical",
      label: "Critical",
      description: "Emergency situation, immediate action needed",
    },
  ];

  // Hazard type options
  const hazardTypeOptions = [
    // Weather & Climate Events
    { value: "hurricane", label: "Hurricanes", icon: "�" },
    { value: "storm_surge", label: "Storm Surge", icon: "�" },
    { value: "flooding", label: "Flooding", icon: "💧" },
    { value: "waterspout", label: "Waterspouts", icon: "�🌪️" },
    { value: "high_waves", label: "High Waves", icon: "🌊" },
    { value: "unusual_tide", label: "Unusual Tide", icon: "🌀" },

    // Geological Events
    { value: "tsunami", label: "Tsunamis", icon: "🚨" },
    {
      value: "earthquake",
      label: "Earthquakes (Underwater/Seismic)",
      icon: "📳",
    },
    {
      value: "landslide",
      label: "Landslides (Including Underwater)",
      icon: "🏔️",
    },

    // Erosion & Physical Changes
    { value: "coastal_erosion", label: "Coastal Erosion", icon: "🏖️" },
    { value: "erosion", label: "General Erosion", icon: "🏔️" },
    { value: "sea_level_rise", label: "Sea Level Rise", icon: "📈" },
    { value: "coastal_damage", label: "Coastal Damage", icon: "⚠️" },

    // Pollution & Contamination
    { value: "oil_spill", label: "Oil Spills", icon: "🛢️" },
    {
      value: "maritime_pollution",
      label: "Maritime Pollution (Chemical/Sewage)",
      icon: "☠️",
    },
    { value: "plastic_debris", label: "Plastic and Marine Debris", icon: "🗑️" },
    { value: "debris", label: "General Debris", icon: "�️" },
    {
      value: "ocean_noise_pollution",
      label: "Ocean Noise Pollution",
      icon: "🔊",
    },

    // Biological & Ecological
    {
      value: "harmful_algal_bloom",
      label: "Harmful Algal Blooms (Red Tides)",
      icon: "🦠",
    },
    { value: "overfishing", label: "Overfishing", icon: "🎣" },
    {
      value: "habitat_destruction",
      label: "Habitat Destruction (Dredging/Trawling)",
      icon: "🏗️",
    },
    {
      value: "dangerous_sea_creatures",
      label: "Dangerous Sea Creatures",
      icon: "🦈",
    },

    // Climate & Chemical Changes
    {
      value: "ocean_warming",
      label: "Ocean Warming (Climate Change)",
      icon: "�️",
    },
    { value: "ocean_acidification", label: "Ocean Acidification", icon: "🧪" },

    // Maritime Accidents
    {
      value: "shipping_accident",
      label: "Shipping Accidents and Disasters",
      icon: "�",
    },

    // Other
    { value: "other", label: "Other", icon: "📍" },
  ];

  // Get current location
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser");
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          coordinates: [latitude, longitude],
          location:
            prev.location || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        }));
        setIsGettingLocation(false);
      },
      (error) => {
        setLocationError(`Location error: ${error.message}`);
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate({ to: "/login" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare form data for multipart upload
      const submitFormData = new FormData();
      submitFormData.append("title", formData.title);
      submitFormData.append("description", formData.description);
      submitFormData.append("location", formData.location);
      submitFormData.append("latitude", formData.coordinates[0].toString());
      submitFormData.append("longitude", formData.coordinates[1].toString());
      submitFormData.append("severity", formData.severity);
      submitFormData.append("hazard_type", formData.type);
      submitFormData.append("author", formData.author);

      // Add files to form data
      if (selectedFiles) {
        Array.from(selectedFiles).forEach((file) => {
          submitFormData.append("files", file);
        });
      }

      // Submit to backend API
      const response = await fetch("http://localhost:8000/api/reports", {
        method: "POST",
        body: submitFormData,
        // Don't set Content-Type header - let browser set it with boundary for multipart
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Report submitted successfully:", result);

      // Reset form and redirect
      setFormData({
        title: "",
        description: "",
        location: "",
        coordinates: [0, 0],
        severity: "medium",
        type: "other",
        author: user?.name || "Anonymous",
      });
      setSelectedFiles(null);

      // Navigate to dashboard with success message
      navigate({ to: "/dashboard" });
    } catch (error) {
      console.error("Failed to submit report:", error);
      // TODO: Show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      validateAndSetFiles(files);
    }
  };

  // Validate and set files
  const validateAndSetFiles = (files: FileList) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/mov",
      "video/avi",
      "video/quicktime",
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: Unsupported file type`);
      } else if (file.size > maxSize) {
        errors.push(`${file.name}: File too large (max 10MB)`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      alert("Some files were not added:\n" + errors.join("\n"));
    }

    if (validFiles.length > 0) {
      const dt = new DataTransfer();
      validFiles.forEach((file) => dt.items.add(file));
      setSelectedFiles(dt.files);
    }
  };

  // Handle drag and drop
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndSetFiles(files);
    }
  };

  // Handle file removal
  const removeFile = (indexToRemove: number) => {
    if (selectedFiles) {
      const dt = new DataTransfer();
      Array.from(selectedFiles).forEach((file, index) => {
        if (index !== indexToRemove) {
          dt.items.add(file);
        }
      });
      setSelectedFiles(dt.files.length > 0 ? dt.files : null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="p-3 bg-red-600 rounded-xl">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Report Incident
            </h1>
          </div>
          <p className="text-gray-600">
            Help protect our coastlines by reporting coastal hazards and
            incidents
          </p>
        </div>

        {/* Report Form */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Waves className="h-5 w-5" />
              Incident Details
            </CardTitle>
            <CardDescription>
              Please provide as much detail as possible about the coastal
              incident
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Incident Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Brief description of the incident"
                  required
                  maxLength={200}
                />
              </div>

              {/* Hazard Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Hazard Type *</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      type: e.target.value as CoastalHazardType,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {hazardTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Severity */}
              <div className="space-y-2">
                <Label htmlFor="severity">Severity Level *</Label>
                <select
                  id="severity"
                  value={formData.severity}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      severity: e.target.value as SeverityLevel,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {severityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} - {option.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <div className="flex gap-2">
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    placeholder="Describe the location (e.g., Goa Beach, near lighthouse)"
                    required
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className="shrink-0"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    {isGettingLocation ? "Getting..." : "Current Location"}
                  </Button>
                </div>
                {locationError && (
                  <p className="text-sm text-red-600">{locationError}</p>
                )}
                {formData.coordinates[0] !== 0 &&
                  formData.coordinates[1] !== 0 && (
                    <p className="text-sm text-gray-600">
                      Coordinates: {formData.coordinates[0].toFixed(6)},{" "}
                      {formData.coordinates[1].toFixed(6)}
                    </p>
                  )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Provide detailed information about what you observed, including time, conditions, and any immediate concerns..."
                  rows={4}
                  required
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="files">Photos & Videos (Optional)</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                    isDragOver
                      ? "border-blue-400 bg-blue-50 scale-105 shadow-lg"
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    id="files"
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Label htmlFor="files" className="cursor-pointer block">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="flex justify-center">
                        <Upload
                          className={`h-12 w-12 ${isDragOver ? "text-blue-500" : "text-gray-400"}`}
                        />
                      </div>
                      <div className="text-center space-y-2">
                        <p
                          className={`text-base font-medium ${isDragOver ? "text-blue-700" : "text-gray-700"}`}
                        >
                          {isDragOver
                            ? "Drop files here"
                            : "Click to select photos and videos"}
                        </p>
                        <p className="text-sm text-gray-500">
                          or drag and drop files here
                        </p>
                        <p className="text-xs text-gray-400">
                          Supports: JPG, PNG, MP4, MOV (Max 10MB each)
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>
                {selectedFiles && selectedFiles.length > 0 && (
                  <div className="space-y-3 mt-4">
                    <p className="text-sm font-medium text-gray-700">
                      Selected files ({selectedFiles.length}):
                    </p>
                    <div className="grid gap-3">
                      {Array.from(selectedFiles).map((file, index) => {
                        const isVideo = file.type.startsWith("video/");
                        const isImage = file.type.startsWith("image/");

                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-full bg-white">
                                {isImage ? (
                                  <FileImage className="h-4 w-4 text-blue-500" />
                                ) : isVideo ? (
                                  <FileVideo className="h-4 w-4 text-purple-500" />
                                ) : (
                                  <Camera className="h-4 w-4 text-gray-500" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(file.size / 1024 / 1024).toFixed(1)} MB •{" "}
                                  {file.type}
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Reporter Info */}
              <div className="space-y-2">
                <Label htmlFor="author">Reporter Name</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, author: e.target.value }))
                  }
                  placeholder="Your name or organization"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: "/dashboard" })}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !formData.title ||
                    !formData.description ||
                    !formData.location
                  }
                  className="flex-1"
                >
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-600 rounded-lg shrink-0">
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-blue-900">
                  Important Notice
                </h3>
                <p className="text-sm text-blue-700">
                  For immediate emergencies, please contact local emergency
                  services (Coast Guard: 1554) before submitting this report.
                  This system is for monitoring and documentation purposes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
