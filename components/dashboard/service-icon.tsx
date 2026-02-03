import { serviceIcons, ServiceKey } from "@/constants/icons";
import { cn } from "@/lib/utils";

interface ServiceIconProps {
  service: ServiceKey;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "size-10 rounded-lg",
  md: "size-12 rounded-xl",
  lg: "size-14 rounded-2xl",
};

const iconSizeClasses = {
  sm: "size-5",
  md: "size-6",
  lg: "size-7",
};

export function ServiceIcon({
  service,
  size = "md",
  className,
}: ServiceIconProps) {
  const config = serviceIcons[service];

  if (!config) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          sizeClasses[size],
          className,
        )}
      >
        <span className={iconSizeClasses[size]}>?</span>
      </div>
    );
  }

  const { icon: Icon, color, name, label, bgColor } = config;

  return (
    <div
      style={{ backgroundColor: bgColor ?? `${color}15` }}
      className={cn(
        "flex items-center justify-center shadow-sm",
        sizeClasses[size],
        className,
      )}
    >
      <Icon className={iconSizeClasses[size]} style={{ color }} />
      <span className="sr-only">{label ?? name}</span>
    </div>
  );
}

export type { ServiceKey };
