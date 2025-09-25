import { Waves, Wind, Navigation, AlertTriangle, Activity } from "lucide-react";

const getSeverityIcon = (type: string) => {
  switch (type) {
    case "high_waves":
      return <Waves className="h-4 w-4" />;
    case "storm_surge":
      return <Wind className="h-4 w-4" />;
    case "unusual_tide":
      return <Navigation className="h-4 w-4" />;
    case "coastal_damage":
      return <AlertTriangle className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

export default getSeverityIcon;