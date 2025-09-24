import { useEffect, useState } from 'react'

interface Report {
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

interface InteractiveMapProps {
    reports: Report[]
    className?: string
}

// Client-side only map component
function ClientOnlyMap({ reports, className = "" }: InteractiveMapProps) {
    const [MapContainer, setMapContainer] = useState<any>(null)
    const [TileLayer, setTileLayer] = useState<any>(null)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        // Only load Leaflet on client side
        const loadLeaflet = async () => {
            try {
                const [leaflet, reactLeaflet] = await Promise.all([
                    import('leaflet'),
                    import('react-leaflet')
                ])

                // Fix for default markers in react-leaflet
                delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl
                leaflet.default.Icon.Default.mergeOptions({
                    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                })

                setMapContainer(() => reactLeaflet.MapContainer)
                setTileLayer(() => reactLeaflet.TileLayer)
                setIsLoaded(true)
            } catch (error) {
                console.error('Failed to load Leaflet:', error)
            }
        }

        loadLeaflet()
    }, [])

    // Default center on Indian Ocean (suitable for coastal monitoring)
    const defaultCenter: [number, number] = [15.0, 75.0]
    const defaultZoom = 6

    // Ensure reports is always an array
    const safeReports = Array.isArray(reports) ? reports : []

    if (!isLoaded || !MapContainer || !TileLayer) {
        return (
            <div className={`h-full w-full rounded-lg overflow-hidden bg-gray-50 ${className}`}>
                <div className="h-full flex items-center justify-center">
                    <div className="text-center p-6">
                        <div className="text-4xl mb-2">🌊</div>
                        <h3 className="font-semibold text-gray-700 mb-1">Loading Interactive Map...</h3>
                        <p className="text-sm text-gray-500">Please wait while the map loads</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`h-full w-full rounded-lg overflow-hidden ${className}`}>
            <MapContainer
                center={defaultCenter}
                zoom={defaultZoom}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Default message when no reports */}
                {safeReports.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50/90 backdrop-blur-sm z-10">
                        <div className="text-center p-6">
                            <div className="text-4xl mb-2">🌊</div>
                            <h3 className="font-semibold text-gray-700 mb-1">Interactive Map Loaded</h3>
                            <p className="text-sm text-gray-500">Reports will appear here when available</p>
                        </div>
                    </div>
                )}
            </MapContainer>
        </div>
    )
}

export function InteractiveMap({ reports, className = "" }: InteractiveMapProps) {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    // Show loading state until client-side rendering is ready
    if (!isClient) {
        return (
            <div className={`h-full w-full rounded-lg overflow-hidden bg-gray-50 ${className}`}>
                <div className="h-full flex items-center justify-center">
                    <div className="text-center p-6">
                        <div className="text-4xl mb-2">🌊</div>
                        <h3 className="font-semibold text-gray-700 mb-1">Loading Interactive Map...</h3>
                        <p className="text-sm text-gray-500">Preparing map for display</p>
                    </div>
                </div>
            </div>
        )
    }

    return <ClientOnlyMap reports={reports} className={className} />
}
