const getPlatformColor = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'twitter': return 'bg-blue-500'
    case 'facebook': return 'bg-blue-600'
    case 'youtube': return 'bg-red-500'
    default: return 'bg-gray-500'
  }
}

export default getPlatformColor