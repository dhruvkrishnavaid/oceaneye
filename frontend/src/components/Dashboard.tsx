import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Activity,
  AlertTriangle,
  Camera,
  Clock,
  Eye,
  Hash,
  MapPin,
  MessageCircle,
  Navigation,
  Share2,
  ShieldAlert,
  TrendingUp,
  Users,
  Waves,
  Wind
} from 'lucide-react'
import { useState } from 'react'
import { MapPlaceholder } from './MapPlaceholder'
import UserProfile from './UserProfile'

// Mock data for user reports
const mockUserReports = [
  {
    id: 1,
    title: "High Waves at Marina Beach",
    description: "Unusual wave patterns observed, waves reaching 3-4 meters",
    location: "Marina Beach, Chennai",
    coordinates: [13.0478, 80.2619],
    timestamp: "2025-09-22T10:30:00Z",
    severity: "medium",
    type: "high_waves",
    author: "Coastal Volunteer",
    verified: true,
    images: 2,
    videos: 1
  },
  {
    id: 2,
    title: "Storm Surge Alert - Visakhapatnam",
    description: "Water levels rising rapidly, flooding in low-lying areas",
    location: "Visakhapatnam Port",
    coordinates: [17.6868, 83.2185],
    timestamp: "2025-09-22T09:15:00Z",
    severity: "high",
    type: "storm_surge",
    author: "Port Authority",
    verified: true,
    images: 5,
    videos: 2
  },
  {
    id: 3,
    title: "Unusual Tide Behavior",
    description: "Tide receding much faster than predicted",
    location: "Puri Beach, Odisha",
    coordinates: [19.8135, 85.8312],
    timestamp: "2025-09-22T08:45:00Z",
    severity: "low",
    type: "unusual_tide",
    author: "Local Fisherman",
    verified: false,
    images: 1,
    videos: 0
  },
  {
    id: 4,
    title: "Coastal Erosion Observed",
    description: "Significant erosion noticed after recent storms",
    location: "Kovalam Beach, Kerala",
    coordinates: [8.4004, 76.9784],
    timestamp: "2025-09-22T07:20:00Z",
    severity: "medium",
    type: "coastal_damage",
    author: "Environmental Group",
    verified: true,
    images: 8,
    videos: 1
  }
]

// Mock data for social media posts
const mockSocialPosts = [
  {
    id: 1,
    platform: "Twitter",
    content: "Massive waves hitting the shore at #MarinaBeach! Stay safe everyone 🌊 #ChennaiWeather #OceanAlert",
    author: "@Chennai_Updates",
    timestamp: "2025-09-22T11:45:00Z",
    engagement: { likes: 245, retweets: 89, replies: 34 },
    hashtags: ["#MarinaBeach", "#ChennaiWeather", "#OceanAlert"],
    location: "Chennai, Tamil Nadu",
    sentiment: "concern",
    verified: true
  },
  {
    id: 2,
    platform: "Facebook",
    content: "Fishermen advised not to venture into sea today due to rough weather conditions. Waves up to 4m expected.",
    author: "Kerala Fisheries Department",
    timestamp: "2025-09-22T10:20:00Z",
    engagement: { likes: 156, shares: 78, comments: 23 },
    hashtags: ["#FishermenSafety", "#KeralaWeather"],
    location: "Kerala",
    sentiment: "advisory",
    verified: true
  },
  {
    id: 3,
    platform: "Twitter",
    content: "Beautiful but dangerous waves at #PuriBeach today. Tourists please maintain safe distance! 📸 #OdishaCoast",
    author: "@OdishaTourism",
    timestamp: "2025-09-22T09:55:00Z",
    engagement: { likes: 89, retweets: 23, replies: 12 },
    hashtags: ["#PuriBeach", "#OdishaCoast", "#SafetyFirst"],
    location: "Puri, Odisha",
    sentiment: "caution",
    verified: true
  },
  {
    id: 4,
    platform: "YouTube",
    content: "Live: Storm surge footage from Visakhapatnam port - Emergency response in action",
    author: "News24x7",
    timestamp: "2025-09-22T09:30:00Z",
    engagement: { views: 12500, likes: 234, comments: 67 },
    hashtags: ["#StormSurge", "#Visakhapatnam", "#EmergencyResponse"],
    location: "Visakhapatnam, Andhra Pradesh",
    sentiment: "urgent",
    verified: true
  }
]

// Mock trending hashtags
const trendingHashtags = [
  { tag: "#OceanAlert", count: 1245, trend: "up" },
  { tag: "#CoastalSafety", count: 892, trend: "up" },
  { tag: "#MarinaBeach", count: 567, trend: "up" },
  { tag: "#StormSurge", count: 445, trend: "stable" },
  { tag: "#TsunamiWatch", count: 234, trend: "down" }
]

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high': return 'destructive'
    case 'medium': return 'default'
    case 'low': return 'secondary'
    default: return 'secondary'
  }
}

const getSeverityIcon = (type: string) => {
  switch (type) {
    case 'high_waves': return <Waves className="h-4 w-4" />
    case 'storm_surge': return <Wind className="h-4 w-4" />
    case 'unusual_tide': return <Navigation className="h-4 w-4" />
    case 'coastal_damage': return <AlertTriangle className="h-4 w-4" />
    default: return <Activity className="h-4 w-4" />
  }
}

const getPlatformColor = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'twitter': return 'bg-blue-500'
    case 'facebook': return 'bg-blue-600'
    case 'youtube': return 'bg-red-500'
    default: return 'bg-gray-500'
  }
}

export function Dashboard() {
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all')
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('24h')

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">OceanEye Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time monitoring of coastal hazards and public awareness
          </p>
        </div>
        <div className="flex items-center gap-4">
          <UserProfile />
          <Select
            value={selectedTimeRange}
            onValueChange={setSelectedTimeRange}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last Week</SelectItem>
              <SelectItem value="30d">Last Month</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="tamil_nadu">Tamil Nadu</SelectItem>
              <SelectItem value="kerala">Kerala</SelectItem>
              <SelectItem value="odisha">Odisha</SelectItem>
              <SelectItem value="andhra_pradesh">Andhra Pradesh</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Verified Incidents
            </CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Reports
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">+12 from last hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Social Mentions
            </CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+89 from last hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">328</div>
            <p className="text-xs text-muted-foreground">Online now</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Citizen Reports
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Hash className="h-4 w-4" />
            Social Media Activity
          </TabsTrigger>
        </TabsList>

        {/* Citizen Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Section - Placeholder */}
            <div className="lg:col-span-2">
              <Card className="pb-0!">
                <CardHeader>
                  <CardTitle>Interactive Map</CardTitle>
                  <CardDescription>
                    Real-time locations of reported incidents
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-96 p-0">
                  <MapPlaceholder reports={mockUserReports} />
                </CardContent>
              </Card>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recent Reports</h3>
                <Select
                  value={selectedSeverity}
                  onValueChange={setSelectedSeverity}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="All Severities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-106">
                {mockUserReports.map((report) => (
                  <Card key={report.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(report.type)}
                          <h4 className="font-medium text-sm">
                            {report.title}
                          </h4>
                        </div>
                        <Badge variant={getSeverityColor(report.severity)}>
                          {report.severity}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {report.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {report.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(report.timestamp).toLocaleTimeString()}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>by {report.author}</span>
                          {report.verified && (
                            <Badge variant="outline" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {report.images > 0 && (
                            <div className="flex items-center gap-1">
                              <Camera className="h-3 w-3" />
                              {report.images}
                            </div>
                          )}
                          {report.videos > 0 && (
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {report.videos}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Social Media Tab */}
        <TabsContent value="social" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Trending Hashtags */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Trending Hashtags
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {trendingHashtags.map((hashtag, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Hash className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {hashtag.tag.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {hashtag.count}
                        </span>
                        <TrendingUp
                          className={`h-3 w-3 ${
                            hashtag.trend === "up"
                              ? "text-green-500"
                              : hashtag.trend === "down"
                                ? "text-red-500"
                                : "text-gray-500"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Social Media Posts */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Social Media Monitoring
                </h3>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {mockSocialPosts.map((post) => (
                  <Card key={post.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full ${getPlatformColor(post.platform)}`}
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">
                                {post.author}
                              </span>
                              {post.verified && (
                                <Badge variant="outline" className="text-xs">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {post.platform}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(post.timestamp).toLocaleString()}
                        </div>
                      </div>

                      <p className="text-sm">{post.content}</p>

                      <div className="flex flex-wrap gap-1">
                        {post.hashtags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {post.location}
                        </div>
                        <div className="flex items-center gap-4">
                          {post.platform === "Twitter" && (
                            <>
                              <span>❤️ {post.engagement.likes}</span>
                              <span>🔄 {post.engagement.retweets}</span>
                              <span>💬 {post.engagement.replies}</span>
                            </>
                          )}
                          {post.platform === "Facebook" && (
                            <>
                              <span>👍 {post.engagement.likes}</span>
                              <span>📤 {post.engagement.shares}</span>
                              <span>💬 {post.engagement.comments}</span>
                            </>
                          )}
                          {post.platform === "YouTube" && (
                            <>
                              <span>👁️ {post.engagement.views}</span>
                              <span>👍 {post.engagement.likes}</span>
                              <span>💬 {post.engagement.comments}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}