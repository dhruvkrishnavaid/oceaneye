import getSeverityColor from "@/lib/getSeverityColor";

const SeverityProgress = ({ severity }: { severity: number }) => {
  const color = getSeverityColor(severity);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-muted-foreground">
          {severity}% severity
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-300"
          style={{
            width: `${severity}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
};

export default SeverityProgress;