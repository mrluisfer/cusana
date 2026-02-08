import React from "react";

export const FlowerIcon = ({
  size = 100,
  primaryColor = "#4F46E5",
  secondaryColor = "#3730A3",
  petalColor = "white",
  className = "",
}) => {
  const gradientId = React.useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor} />
          <stop offset="100%" stopColor={secondaryColor} />
        </linearGradient>
      </defs>

      {/* Círculo de fondo */}
      <circle cx="50" cy="50" r="48" fill={`url(#${gradientId})`} />

      {/* Pétalos */}
      <ellipse
        cx="50"
        cy="32"
        rx="10"
        ry="14"
        fill={petalColor}
        opacity="0.95"
      />
      <ellipse
        cx="50"
        cy="32"
        rx="10"
        ry="14"
        fill={petalColor}
        opacity="0.9"
        transform="rotate(72 50 50)"
      />
      <ellipse
        cx="50"
        cy="32"
        rx="10"
        ry="14"
        fill={petalColor}
        opacity="0.85"
        transform="rotate(144 50 50)"
      />
      <ellipse
        cx="50"
        cy="32"
        rx="10"
        ry="14"
        fill={petalColor}
        opacity="0.85"
        transform="rotate(216 50 50)"
      />
      <ellipse
        cx="50"
        cy="32"
        rx="10"
        ry="14"
        fill={petalColor}
        opacity="0.9"
        transform="rotate(288 50 50)"
      />

      {/* Centro */}
      <circle cx="50" cy="50" r="11" fill={petalColor} />
      <circle cx="50" cy="50" r="5" fill={`url(#${gradientId})`} />
    </svg>
  );
};

export function Logo() {
  return (
    <div className="flex items-center justify-start gap-1 select-none">
      <FlowerIcon className="size-10" />
      <span className="font-mono text-xl font-extrabold">TrackO.</span>
    </div>
  );
}
