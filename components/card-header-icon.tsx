import { LucideIcon } from "lucide-react";

type CardHeaderIconProps = {
  icon: LucideIcon;
};
export const CardHeaderIcon = ({ icon }: CardHeaderIconProps) => {
  const Icon = icon;
  return (
    <div className="bg-primary/10 flex size-7 items-center justify-center rounded-md">
      <Icon className="text-primary size-4" />
    </div>
  );
};
