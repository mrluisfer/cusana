import { LucideIcon } from "lucide-react";

type CardHeaderIconProps = {
  icon: LucideIcon;
};
export const CardHeaderIcon = ({ icon }: CardHeaderIconProps) => {
  const Icon = icon;
  return (
    <div className="bg-primary/10 flex h-7 w-7 items-center justify-center">
      <Icon className="text-primary h-4 w-4" />
    </div>
  );
};
