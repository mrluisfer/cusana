import type { LucideIcon } from "lucide-react";

type CardHeaderIconProps = {
  icon: LucideIcon;
};
export const CardHeaderIcon = ({ icon }: CardHeaderIconProps) => {
  const Icon = icon;
  return (
    <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
      <Icon className="size-4 text-primary" />
    </div>
  );
};
