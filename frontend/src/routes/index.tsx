import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Waves,
  MapPin,
  Users,
  AlertTriangle,
  Shield,
  MessageCircle,
  TrendingUp,
  Globe,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex justify-center">
            <div className="bg-blue-900 p-6 rounded-full">
              <Waves className="h-16 w-16 text-white" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-gray-900">OceanEye</h1>
            <h2 className="text-2xl text-blue-700 font-semibold">
              Coastal Hazard Monitoring Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real-time monitoring and reporting platform for coastal hazards
              and ocean events across India's coastline. Empowering communities
              with early warnings and situational awareness.
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <Link to="/dashboard">
              <Button size="lg" className="bg-blue-900 hover:bg-blue-800">
                <AlertTriangle className="mr-2 h-5 w-5" />
                View Dashboard
              </Button>
            </Link>
            <Link to="/report">
              <Button variant="outline" size="lg">
                <Users className="mr-2 h-5 w-5" />
                Report Incident
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Comprehensive Coastal Monitoring
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform integrates citizen reports, social media monitoring,
            and real-time data to provide comprehensive coverage of coastal
            hazards across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-blue-100 p-3 rounded-full w-fit">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Citizen Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Geotagged reports from coastal communities with photos, videos,
                and real-time observations
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-green-100 p-3 rounded-full w-fit">
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Social Media Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                AI-powered analysis of social media posts to detect and track
                coastal hazard discussions
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-orange-100 p-3 rounded-full w-fit">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle>Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Real-time analysis of hazard trends, hotspots, and public
                sentiment across regions
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-purple-100 p-3 rounded-full w-fit">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle>Early Warning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Integration with official warning systems to enhance situational
                awareness and response
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Addressing Critical Coastal Challenges
              </h3>
              <p className="text-gray-600">
                Solution for Smart India Hackathon 2025 Problem Statement
                SIH25039
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-gray-900">
                    The Challenge
                  </h4>
                  <p className="text-gray-600">
                    India's 7,517 km coastline faces numerous ocean hazards
                    including tsunamis, storm surges, high waves, and unusual
                    tidal behavior. Current warning systems lack real-time
                    ground truth and public communication insights.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-gray-900">
                    Our Solution
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-blue-500" />
                      Unified platform for citizen reporting and social media
                      monitoring
                    </li>
                    <li className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      Interactive maps with dynamic hotspot generation
                    </li>
                    <li className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-blue-500" />
                      NLP-powered social media analysis for real-time insights
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      Role-based access for citizens, officials, and analysts
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 p-8 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Key Features
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm text-gray-700">
                      Real-time incident reporting with media upload
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm text-gray-700">
                      Live dashboard with crowdsourced data visualization
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm text-gray-700">
                      Social media integration and NLP analysis
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm text-gray-700">
                      Multilingual support for regional accessibility
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm text-gray-700">
                      Offline capabilities for remote coastal areas
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h3 className="text-3xl font-bold">
              Ready to Explore the Dashboard?
            </h3>
            <p className="text-blue-100">
              Experience real-time coastal hazard monitoring with our
              comprehensive dashboard featuring citizen reports and social media
              analysis.
            </p>
            <Link to="/dashboard">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-blue-900 hover:bg-blue-50"
              >
                <Waves className="mr-2 h-5 w-5" />
                Launch Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
