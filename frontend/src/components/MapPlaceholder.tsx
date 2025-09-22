import { AlertTriangle, MapPin, Waves, Wind } from 'lucide-react'

interface MapPlaceholderProps {
  reports: Array<{
    id: number
    title: string
    coordinates: number[]
    severity: string
    type: string
  }>
}

export function MapPlaceholder({ reports }: MapPlaceholderProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'high_waves': return <Waves className="h-3 w-3" />
      case 'storm_surge': return <Wind className="h-3 w-3" />
      case 'coastal_damage': return <AlertTriangle className="h-3 w-3" />
      default: return <MapPin className="h-3 w-3" />
    }
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg overflow-hidden">
      {/* Map Background with Indian Ocean/Coast outline */}
      <div className="absolute inset-0 opacity-20">
        <svg viewBox="0 0 400 300" className="w-full h-full">
          {/* Simplified coastline */}
          <path
            d="M20 50 Q50 40 80 60 T140 70 Q170 80 200 85 T260 100 Q290 110 320 120 T380 140"
            stroke="#1e40af"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M20 150 Q60 140 100 155 T180 165 Q220 175 260 180 T340 195 Q370 200 380 210"
            stroke="#1e40af"
            strokeWidth="3"
            fill="none"
          />
        </svg>
      </div>

      {/* Report Markers */}
      <div className="absolute inset-0">
        {reports.map((report) => {
          // Simple coordinate to pixel conversion for demonstration
          const x = ((report.coordinates[1] + 180) / 360) * 100
          const y = ((90 - report.coordinates[0]) / 180) * 100
          
          return (
            <div
              key={report.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: `${Math.min(Math.max(x, 10), 90)}%`, top: `${Math.min(Math.max(y, 10), 90)}%` }}
            >
              <div className={`w-6 h-6 rounded-full ${getSeverityColor(report.severity)} flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform`}>
                {getTypeIcon(report.type)}
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {report.title}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
        <h4 className="text-sm font-semibold mb-2">Severity Levels</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>High Risk</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Medium Risk</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Low Risk</span>
          </div>
        </div>
      </div>

      {/* Map Controls Placeholder */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg">
        <div className="space-y-2">
          <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-sm font-bold">+</button>
          <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-sm font-bold">-</button>
        </div>
      </div>

      {/* Center Indicator */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow-lg text-sm font-medium">
        India's Coastline
      </div>
    </div>
  )
}