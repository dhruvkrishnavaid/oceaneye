import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useNotificationStore } from '@/stores/notificationStore'
import {
  AlertCircle,
  AlertTriangle,
  Camera,
  CheckCircle,
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
  Wind,
  X,
  XCircle
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { InteractiveMap } from './InteractiveMap'
import UserProfile from './UserProfile'

// Types for API responses
interface UserReport {
  id: string
  title: string
  description: string
  location: string
  coordinates: [number, number]
  severity: string
  type: string
  timestamp: string
  author: string
  verified: boolean
  images: number
  videos: number
}

interface SocialPost {
  id: string
  platform: string
  author: string
  content: string
  timestamp: string
  verified: boolean
  location: string
  hashtags?: string[]
  engagement?: {
    likes?: number
    shares?: number
    comments?: number
    retweets?: number
    replies?: number
    views?: number
  }
}

interface DashboardStats {
  active_reports: number
  social_mentions: number
  active_users: number
  verified_incidents: number
  active_reports_change: string
  social_mentions_change: string
  active_users_description: string
  verified_incidents_description: string
}

export function Dashboard() {
  const [selectedSeverity, setSelectedSeverity] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('24h')
  const [userReports, setUserReports] = useState<UserReport[]>([])
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([])
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showActiveReportsModal, setShowActiveReportsModal] = useState(false)

  const { notifications, unreadCount, fetchNotifications, markAsVerified, markAsFake, markAsRead } = useNotificationStore();

  // Fetch active reports when component mounts
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Mock data for trending hashtags
  const trendingHashtags = [
    { tag: "#CoastalAlert", count: "1.2K", trend: "up" as const },
    { tag: "#OceanSafety", count: "890", trend: "up" as const },
    { tag: "#TsunamiWatch", count: "654", trend: "neutral" as const },
    { tag: "#MarinePollution", count: "432", trend: "down" as const },
    { tag: "#ClimateChange", count: "321", trend: "up" as const }
  ];

  // Use userReports from API or fallback to sample data
  const mockUserReports = userReports.length > 0 ? userReports : [
    {
      id: "1",
      title: "tsunami",
      description: "there are chances of tsunami in the bay of bengal",
      location: "west bengal",
      coordinates: [22.5726, 88.3639] as [number, number],
      severity: "low",
      type: "tsunami",
      timestamp: new Date().toISOString(),
      author: "anand",
      verified: false,
      images: 1,
      videos: 0
    },
    {
      id: "2",
      title: "Hurricanes in the mumbai",
      description: "there is hurricane in the mumbai region.",
      location: "Ghaziabad, Uttar Pradesh India",
      coordinates: [28.6692, 77.4538] as [number, number],
      severity: "medium",
      type: "hurricane",
      timestamp: new Date().toISOString(),
      author: "dhruv",
      verified: false,
      images: 0,
      videos: 0
    }
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('🔄 Starting to fetch dashboard data...')

        // Fetch all data in parallel
        const [statsResponse, reportsResponse, socialResponse] = await Promise.all([
          fetch('http://localhost:8000/api/dashboard/stats'),
          fetch('http://localhost:8000/api/reports'),
          fetch('http://localhost:8000/api/social')
        ])

        console.log('📊 API Responses:', {
          stats: statsResponse.status,
          reports: reportsResponse.status,
          social: socialResponse.status
        })

        if (statsResponse.ok) {
          const stats = await statsResponse.json()
          console.log('✅ Dashboard stats loaded:', stats)
          setDashboardStats(stats)
        } else {
          console.warn('⚠️ Failed to fetch dashboard stats:', statsResponse.status, statsResponse.statusText)
          setDashboardStats({
            active_reports: 0,
            social_mentions: 0,
            active_users: 0,
            verified_incidents: 0,
            active_reports_change: '0%',
            social_mentions_change: '0%',
            active_users_description: '',
            verified_incidents_description: ''
          })
        }

        if (reportsResponse.ok) {
          const reportsData = await reportsResponse.json()
          console.log('✅ Reports data loaded:', reportsData.reports?.length, 'reports')
          setUserReports(reportsData.reports || [])
        } else {
          console.warn('⚠️ Failed to fetch user reports:', reportsResponse.status, reportsResponse.statusText)
        }

        if (socialResponse.ok) {
          const socialData = await socialResponse.json()
          console.log('✅ Social data loaded:', socialData.posts?.length, 'posts')
          setSocialPosts(socialData.posts || [])
        } else {
          console.warn('⚠️ Failed to fetch social media posts:', socialResponse.status, socialResponse.statusText)
        }

      } catch (err) {
        console.error('❌ Error fetching dashboard data:', err)
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
        setError(`Failed to load dashboard data: ${errorMessage}`)
        // Set default stats if everything fails
        setDashboardStats({
          active_reports: 0,
          social_mentions: 0,
          active_users: 0,
          verified_incidents: 0,
          active_reports_change: '0%',
          social_mentions_change: '0%',
          active_users_description: '',
          verified_incidents_description: ''
        })
      } finally {
        setLoading(false)
        console.log('🏁 Dashboard data fetch completed')
      }
    }

    fetchDashboardData()
  }, [])

  const getSeverityIcon = (type: string) => {
    switch (type) {
      case 'oil-spill': return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'debris': return <Hash className="h-4 w-4 text-orange-500" />
      case 'pollution': return <TrendingUp className="h-4 w-4 text-yellow-500" />
      case 'wildlife': return <Eye className="h-4 w-4 text-green-500" />
      case 'high_waves': return <Waves className="h-4 w-4" />
      case 'storm_surge': return <Wind className="h-4 w-4" />
      case 'unusual_tide': return <Navigation className="h-4 w-4" />
      case 'coastal_damage': return <AlertCircle className="h-4 w-4" />
      case 'tsunami': return <Waves className="h-4 w-4 text-red-600" />
      case 'hurricane': return <Wind className="h-4 w-4 text-orange-600" />
      default: return <MessageCircle className="h-4 w-4 text-blue-500" />
    }
  }

  const getSeverityColorForModal = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-l-red-500 text-red-700 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 text-yellow-700 bg-yellow-50';
      case 'low':
        return 'border-l-blue-500 text-blue-700 bg-blue-50';
      default:
        return 'border-l-gray-500 text-gray-700 bg-gray-50';
    }
  };

  const getSeverityBadgeVariant = (severity: string): "destructive" | "default" | "secondary" | "outline" => {
    switch (severity) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getVerificationBadge = (verified?: 'pending' | 'verified' | 'fake') => {
    switch (verified) {
      case 'verified':
        return <Badge className="bg-green-500 text-white">Verified</Badge>;
      case 'fake':
        return <Badge className="bg-red-500 text-white">Fake News</Badge>;
      default:
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Twitter': return 'bg-blue-400'
      case 'Facebook': return 'bg-blue-600'
      case 'YouTube': return 'bg-red-500'
      case 'Instagram': return 'bg-purple-500'
      case 'TikTok': return 'bg-black'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <div className="text-center py-10">
          <p>Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <div className="text-center py-10">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Dashboard Loading Error</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="text-sm text-gray-600 mb-4">
              <p>Possible causes:</p>
              <ul className="list-disc text-left inline-block mt-2">
                <li>Backend server not running on port 8000</li>
                <li>CORS configuration issues</li>
                <li>Network connectivity problems</li>
              </ul>
            </div>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => window.location.reload()} variant="default">
                Retry Loading
              </Button>
              <Button onClick={() => window.open('http://localhost:8000/api/dashboard/stats', '_blank')} variant="outline">
                Test API
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <UserProfile />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4">
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="pacific">Pacific Coast</SelectItem>
                  <SelectItem value="atlantic">Atlantic Coast</SelectItem>
                  <SelectItem value="gulf">Gulf Coast</SelectItem>
                  <SelectItem value="great-lakes">Great Lakes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow duration-200"
              onClick={() => setShowActiveReportsModal(true)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Reports</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{unreadCount}</div>
                <p className="text-xs text-muted-foreground">Click to manage</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Social Mentions</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats?.social_mentions || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats?.active_users || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verified Incidents</CardTitle>
                <ShieldAlert className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats?.verified_incidents || 0}</div>
              </CardContent>
            </Card>
          </div>

          {/* Map and Recent Reports Layout */}
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Interactive Map */}
            <div className="lg:col-span-2">
              <Card className='pb-0!'>
                <CardHeader>
                  <CardTitle>Interactive Map</CardTitle>
                  <CardDescription>Real-time locations of reported incidents across coastal areas</CardDescription>
                </CardHeader>
                <CardContent className="h-[600px] p-0">
                  <InteractiveMap
                    key="dashboard-map"
                    reports={userReports.length > 0 ? userReports : mockUserReports}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Recent Reports Panel */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Reports</CardTitle>
                  <CardDescription>Latest incident reports from the field</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 max-h-[540px] overflow-y-auto">
                  {(userReports.length > 0 ? userReports : mockUserReports).map((report) => (
                    <div key={report.id} className="border-l-4 border-blue-200 pl-4 py-2">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(report.type)}
                          <Badge variant={getSeverityBadgeVariant(report.severity)} className="text-xs">
                            {report.severity}
                          </Badge>
                        </div>
                      </div>

                      <h4 className="font-semibold text-sm mb-1 text-gray-900">{report.title}</h4>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{report.description}</p>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate max-w-[120px]">{report.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(report.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">by {report.author}</span>
                        <div className="flex items-center gap-2">
                          {report.images > 0 && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Camera className="h-3 w-3" />
                              {report.images}
                            </div>
                          )}
                          {report.verified && <Badge variant="outline" className="text-xs">Verified</Badge>}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          {/* Reports Tab Content */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Reports List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recent Reports</h3>
                <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
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

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {(userReports.length > 0 ? userReports : mockUserReports).map((report) => (
                  <Card key={report.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(report.type)}
                          <h4 className="font-medium text-sm">{report.title}</h4>
                        </div>
                        <Badge variant={getSeverityBadgeVariant(report.severity)}>
                          {report.severity}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground">{report.description}</p>

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
                          {report.verified && <Badge variant="outline" className="text-xs">Verified</Badge>}
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

            {/* Interactive Map for Reports Tab */}
            <div>
              <Card className='pb-0!'>
                <CardHeader>
                  <CardTitle>Report Locations</CardTitle>
                  <CardDescription>Interactive map showing incident reports</CardDescription>
                </CardHeader>
                <CardContent className="h-[600px] p-0">
                  <InteractiveMap
                    key="reports-map"
                    reports={userReports.length > 0 ? userReports : mockUserReports}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          {/* Social Media Tab Content */}
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
            {/* Social Media Posts */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Social Media Monitoring</h3>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {socialPosts.map((post) => (
                  <Card key={post.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${getPlatformColor(post.platform)}`} />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{post.author}</span>
                              {post.verified && <Badge variant="outline" className="text-xs">Verified</Badge>}
                            </div>
                            <span className="text-xs text-muted-foreground">{post.platform}</span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(post.timestamp).toLocaleString()}
                        </div>
                      </div>

                      <p className="text-sm">{post.content}</p>

                      <div className="flex flex-wrap gap-1">
                        {post.hashtags?.map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        )) || []}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {post.location}
                        </div>
                        <div className="flex items-center gap-4">
                          {post.platform === 'Twitter' && (
                            <>
                              <span>❤️ {post.engagement?.likes || 0}</span>
                              <span>🔄 {post.engagement?.retweets || 0}</span>
                              <span>💬 {post.engagement?.replies || 0}</span>
                            </>
                          )}
                          {post.platform === 'Facebook' && (
                            <>
                              <span>👍 {post.engagement?.likes || 0}</span>
                              <span>📤 {post.engagement?.shares || 0}</span>
                              <span>💬 {post.engagement?.comments || 0}</span>
                            </>
                          )}
                          {post.platform === 'YouTube' && (
                            <>
                              <span>👁️ {post.engagement?.views || 0}</span>
                              <span>👍 {post.engagement?.likes || 0}</span>
                              <span>💬 {post.engagement?.comments || 0}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Trending Hashtags */}
            <div className="lg:col-span-1">
              <Card className="h-fit sticky top-4">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Trending
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {trendingHashtags.map((tag, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{tag.tag}</p>
                        <p className="text-xs text-muted-foreground">{tag.count} posts</p>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${tag.trend === 'up' ? 'text-green-600 bg-green-100' :
                        tag.trend === 'down' ? 'text-red-600 bg-red-100' :
                          'text-gray-600 bg-gray-100'
                        }`}>
                        {tag.trend === 'up' ? '↗' : tag.trend === 'down' ? '↘' : '→'}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Active Reports Management Modal */}
      <Dialog open={showActiveReportsModal} onOpenChange={setShowActiveReportsModal}>
        <DialogContent className="max-w-4xl max-h-[85vh] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 border-b border-gray-200">
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Active Reports Management
            </DialogTitle>
          </DialogHeader>

          <div className="max-h-[calc(85vh-120px)] overflow-y-auto px-6 py-4">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No active reports available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((report) => (
                  <div
                    key={report.id}
                    className={`p-4 border-l-4 ${getSeverityColorForModal(report.severity)} border border-gray-200 rounded-lg shadow-sm`}
                  >
                    <div className="flex flex-col space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                              {report.title}
                            </h3>
                            {report.unread && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                            {getVerificationBadge(report.verified)}
                          </div>

                          <p className="text-gray-700 text-sm mb-3 break-words">{report.message}</p>

                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                            <Clock className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{report.time}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {report.verified === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white flex-shrink-0"
                              onClick={() => markAsVerified(report.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Mark as </span>Verified
                            </Button>
                            <Button
                              size="sm"
                              className="bg-red-600 hover:bg-red-700 text-white flex-shrink-0"
                              onClick={() => markAsFake(report.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Mark as </span>Fake
                            </Button>
                          </>
                        )}

                        {report.verified === 'verified' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-shrink-0"
                            onClick={() => markAsFake(report.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Mark as Fake
                          </Button>
                        )}

                        {report.verified === 'fake' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-shrink-0"
                            onClick={() => markAsVerified(report.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark as Verified
                          </Button>
                        )}

                        {report.unread && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="flex-shrink-0"
                            onClick={() => markAsRead(report.id)}
                          >
                            Mark as Read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}