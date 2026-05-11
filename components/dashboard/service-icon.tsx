import { serviceIcons, ServiceKey } from "@/constants/icons";
import { cn } from "@/lib/utils";

interface ServiceIconProps {
  service: ServiceKey;
  size?: "2xs" | "xs" | "sm" | "md" | "lg";
  className?: string;
  /** Override del label accesible cuando el contexto ya lo describe. */
  "aria-label"?: string;
}

const sizeClasses = {
  "2xs": "size-5 rounded",
  xs: "size-8 rounded-md",
  sm: "size-10 rounded-lg",
  md: "size-12 rounded-xl",
  lg: "size-14 rounded-2xl",
} as const;

const iconSizeClasses = {
  "2xs": "size-3",
  xs: "size-4",
  sm: "size-5",
  md: "size-6",
  lg: "size-7",
} as const;

// Compartido entre branches: garantiza que el icono se vea consistente
// sin importar el contenedor padre (flex shrink, selección, recortes, etc.).
const wrapperBase =
  "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden ring-1 ring-inset ring-black/5 dark:ring-white/10";

const svgBase = "pointer-events-none";

export function ServiceIcon({
  service,
  size = "md",
  className,
  "aria-label": ariaLabel,
}: ServiceIconProps) {
  const config = serviceIcons[service];
  const iconClass = iconSizeClasses[size];

  if (!config) {
    return (
      <div
        role="img"
        aria-label={ariaLabel ?? "Servicio desconocido"}
        className={cn(
          wrapperBase,
          "bg-muted text-muted-foreground",
          sizeClasses[size],
          className,
        )}
      >
        <span aria-hidden="true" className="text-sm font-semibold">
          ?
        </span>
      </div>
    );
  }

  const { icon: Icon, color, name, label, bgColor } = config;
  // `as const satisfies` quita las props opcionales del tipo cuando faltan,
  // así que las leemos con `in` narrowing para que TS las reconozca.
  const DarkIcon = "darkIcon" in config ? config.darkIcon : undefined;
  const darkColor = "darkColor" in config ? config.darkColor : undefined;

  const accessibleLabel = ariaLabel ?? label ?? name;
  const hasDarkVariant = Boolean(DarkIcon) || Boolean(darkColor);
  const ResolvedDarkIcon = DarkIcon ?? Icon;
  const resolvedDarkColor = darkColor ?? color;

  return (
    <div
      role="img"
      aria-label={accessibleLabel}
      style={{ backgroundColor: bgColor }}
      className={cn(wrapperBase, sizeClasses[size], className)}
    >
      <Icon
        aria-hidden="true"
        focusable="false"
        className={cn(svgBase, iconClass, hasDarkVariant && "dark:hidden")}
        style={{ color }}
      />
      {hasDarkVariant && (
        <ResolvedDarkIcon
          aria-hidden="true"
          focusable="false"
          className={cn(svgBase, iconClass, "absolute hidden dark:block")}
          style={{ color: resolvedDarkColor }}
        />
      )}
    </div>
  );
}

export type { ServiceKey };
