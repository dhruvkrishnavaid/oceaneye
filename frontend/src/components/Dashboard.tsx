import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useReportsStore } from '@/stores/reportsStore'
import {
  AlertTriangle,
  Camera,
  CheckCircle,
  Clock,
  Eye,
  Hash,
  MapPin,
  MessageCircle,
  Share2,
  ShieldAlert,
  TrendingUp,
  X,
  XCircle
} from 'lucide-react'
import { useState, useEffect } from 'react'
import UserProfile from './UserProfile'
import { InteractiveMap } from './InteractiveMap'
import getSeverityColor from '@/lib/getSeverityColor'
import getVerificationBadge from '@/lib/getVerificationBadge'
import getSeverityIcon from '@/lib/getSeverityIcon'
import getPlatformColor from '@/lib/getPlatformColor'
import SeverityProgress from './SeverityProgress'

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

// Mock trending hashtags (same as original)
const trendingHashtags = [
  { tag: "#OceanAlert", count: 1245, trend: "up" },
  { tag: "#CoastalSafety", count: 892, trend: "up" },
  { tag: "#MarinaBeach", count: 567, trend: "up" },
  { tag: "#StormSurge", count: 445, trend: "stable" },
  { tag: "#TsunamiWatch", count: 234, trend: "down" }
]

export function Dashboard() {
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all')
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('24h')
  const [showActiveReportsModal, setShowActiveReportsModal] = useState(false)
  const [showVerifiedReportsModal, setShowVerifiedReportsModal] = useState(false)
  const [showFakePostsModal, setShowFakePostsModal] = useState(false)
  
  const { 
    reports, 
    fetchReports,
    markAsVerified,
    markAsFake,
    markAsRead,
    resetVerificationStatus,
    getPendingReports,
    getVerifiedReports,
    getFakeReports,
    getUnreadCount,
    getVerifiedCount
  } = useReportsStore();

  // Get computed values
  const pendingReports = getPendingReports();
  const verifiedReports = getVerifiedReports();
  const fakeReports = getFakeReports();
  const unreadCount = getUnreadCount();
  const verifiedCount = getVerifiedCount();
  const fakeCount = fakeReports.length;

  // Fetch active reports when component mounts
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">OceanEye Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time monitoring of coastal hazards and public awareness
          </p>
        </div>
        {/* Header controls remain the same */}
        <div className="flex items-center gap-4">
          <UserProfile />
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
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
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow duration-200"
          onClick={() => setShowVerifiedReportsModal(true)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Verified Incidents
            </CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedCount}</div>
            <p className="text-xs text-muted-foreground">
              Click to view details
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow duration-200"
          onClick={() => setShowActiveReportsModal(true)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Reports
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">Click to manage</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow duration-200"
          onClick={() => setShowFakePostsModal(true)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fake Posts</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fakeCount}</div>
            <p className="text-xs text-muted-foreground">Click to manage</p>
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
      </div>

      {/* Tabs section - simplified for now */}
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

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Section */}
            <div className="lg:col-span-2">
              <Card className="pb-0!">
                <CardHeader>
                  <CardTitle>Interactive Map</CardTitle>
                  <CardDescription>
                    Real-time locations of reported incidents
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-96 p-0">
                  <InteractiveMap reports={reports} />
                </CardContent>
              </Card>
            </div>

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
                    <SelectItem value="high">High (75+)</SelectItem>
                    <SelectItem value="medium">Medium (25-74)</SelectItem>
                    <SelectItem value="low">Low (0-24)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-106">
                {reports
                  .filter(
                    (report) =>
                      selectedSeverity === "all" ||
                      (selectedSeverity === "high" && report.severity >= 75) ||
                      (selectedSeverity === "medium" && report.severity >= 25 && report.severity < 75) ||
                      (selectedSeverity === "low" && report.severity < 25),
                  )
                  .map((report) => (
                    <Card key={report.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {getSeverityIcon(report.type)}
                            <h4 className="font-medium text-sm">
                              {report.title}
                            </h4>
                          </div>
                          <div className="min-w-0 w-24">
                            <SeverityProgress severity={report.severity} />
                          </div>
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
                            {report.verified === "verified" && (
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
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">
                          {hashtag.count}
                        </span>
                        <TrendingUp className="h-3 w-3 text-gray-500" />
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

      {/* Active Reports Management Modal */}
      <Dialog
        open={showActiveReportsModal}
        onOpenChange={setShowActiveReportsModal}
      >
        <DialogContent className="max-w-4xl max-h-[85vh] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 border-b border-gray-200">
            <DialogTitle className="flex items-center gap-2" tabIndex={-1}>
              <AlertTriangle className="h-5 w-5" />
              Active Reports Management
            </DialogTitle>
          </DialogHeader>

          <div className="max-h-[calc(85vh-120px)] overflow-y-auto px-6 py-4" tabIndex={0}>
            {pendingReports.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No active reports available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-4 border-l-4 border border-gray-200 rounded-lg shadow-sm"
                    style={{ borderLeftColor: getSeverityColor(report.severity) }}
                  >
                    <div className="flex flex-col space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                              {report.title}
                            </h3>
                            {(report.unread ||
                              report.verified === "pending") && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                            {getVerificationBadge(report.verified)}
                          </div>
                          
                          <div className="flex flex-col items-start gap-1 pb-2 min-w-0 w-32 mt-2">
                            <SeverityProgress severity={report.severity} />
                          </div>

                          <p className="text-gray-700 text-sm mb-3 break-words">
                            {report.description}
                          </p>

                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                            <Clock className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{report.time}</span>
                            <MapPin className="h-4 w-4 flex-shrink-0 ml-2" />
                            <span className="truncate">{report.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {report.verified === "pending" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white flex-shrink-0"
                              onClick={() => {
                                markAsVerified(report.id);
                                markAsRead(report.id);
                              }}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Mark as </span>
                              Verified
                            </Button>
                            <Button
                              size="sm"
                              className="bg-red-600 hover:bg-red-700 text-white flex-shrink-0"
                              onClick={() => {
                                markAsFake(report.id);
                                markAsRead(report.id);
                              }}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Mark as </span>
                              Fake
                            </Button>
                          </>
                        )}

                        {report.verified === "verified" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-shrink-0 text-gray-600 hover:text-gray-800"
                              onClick={() => resetVerificationStatus(report.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Undo Verified
                            </Button>
                            <Button
                              size="sm"
                              className="bg-red-600 hover:bg-red-700 text-white flex-shrink-0"
                              onClick={() => markAsFake(report.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Mark as </span>
                              Fake
                            </Button>
                          </>
                        )}

                        {report.verified === "fake" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white flex-shrink-0"
                              onClick={() => markAsVerified(report.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Mark as </span>
                              Verified
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-shrink-0 text-gray-600 hover:text-gray-800"
                              onClick={() => resetVerificationStatus(report.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Undo Fake
                            </Button>
                          </>
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

      {/* Verified Reports Modal */}
      <Dialog
        open={showVerifiedReportsModal}
        onOpenChange={setShowVerifiedReportsModal}
      >
        <DialogContent className="max-w-4xl max-h-[85vh] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 border-b border-gray-200">
            <DialogTitle className="flex items-center gap-2" tabIndex={-1}>
              <ShieldAlert className="h-5 w-5 text-green-600" />
              Verified Reports ({verifiedCount})
            </DialogTitle>
          </DialogHeader>

          <div className="max-h-[calc(85vh-120px)] overflow-y-auto px-6 py-4" tabIndex={0}>
            {verifiedReports.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <ShieldAlert className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No verified reports available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {verifiedReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-4 border-l-4 border border-gray-200 rounded-lg shadow-sm"
                    style={{ borderLeftColor: getSeverityColor(report.severity) }}
                  >
                    <div className="flex flex-col space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                              {report.title}
                            </h3>
                            <Badge className="bg-green-500 text-white">
                              Verified
                            </Badge>
                          </div>
                          
                          <div className="flex flex-col items-start gap-1 pb-2 min-w-0 w-32 mt-2">
                            <SeverityProgress severity={report.severity} />
                          </div>

                          <p className="text-gray-700 text-sm mb-3 break-words">
                            {report.description}
                          </p>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">
                                {report.location}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{report.time}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <span>by {report.author}</span>
                            </div>
                            <div className="flex items-center gap-3">
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
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white flex-shrink-0"
                          onClick={() => markAsFake(report.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Mark as </span>Fake
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-shrink-0 text-gray-600 hover:text-gray-800"
                          onClick={() => resetVerificationStatus(report.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Undo Verified
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Fake Posts Modal */}
      <Dialog open={showFakePostsModal} onOpenChange={setShowFakePostsModal}>
        <DialogContent className="max-w-4xl max-h-[85vh] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 border-b border-gray-200">
            <DialogTitle className="flex items-center gap-2" tabIndex={-1}>
              <XCircle className="h-5 w-5 text-red-600" />
              Fake Posts ({fakeCount})
            </DialogTitle>
          </DialogHeader>

          <div className="max-h-[calc(85vh-120px)] overflow-y-auto px-6 py-4" tabIndex={0}>
            {fakeReports.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <XCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No fake posts available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {fakeReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-4 border border-gray-200 rounded-lg shadow-sm"
                  >
                    <div className="flex flex-col space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                              {report.title}
                            </h3>
                            <Badge className="bg-red-500 text-white">
                              Fake
                            </Badge>
                          </div>
                          
                          <div className="flex flex-col items-start gap-1 pb-2 min-w-0 w-32 mt-2">
                            <SeverityProgress severity={report.severity} />
                          </div>

                          <p className="text-gray-700 text-sm mb-3 break-words">
                            {report.description}
                          </p>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">
                                {report.location}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{report.time}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <span>by {report.author}</span>
                            </div>
                            <div className="flex items-center gap-3">
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
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white flex-shrink-0"
                          onClick={() => {
                            // This would call an API to take down the post
                            console.log(`Taking down fake post: ${report.id}`);
                          }}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Take Down </span>
                          Post
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-shrink-0 text-gray-600 hover:text-gray-800"
                          onClick={() => resetVerificationStatus(report.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Undo Mark as Fake
                        </Button>
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
  );
}