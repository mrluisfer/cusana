import { ClaudeAI } from "@/assets/icons/claude";
import { Disney } from "@/assets/icons/disney";
import { Netflix } from "@/assets/icons/netfilix";
import { Spotify } from "@/assets/icons/spotify";
import { YouTube } from "@/assets/icons/youtube";
import { AllowedPlatforms } from "./allowed-platforms";

type ServiceIcon = {
  name: string;
  color: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
};

export const serviceIcons = {
  netflix: {
    name: AllowedPlatforms.NETFLIX,
    color: "#E50914",
    icon: Netflix,
  },
  spotify: {
    name: AllowedPlatforms.SPOTIFY,
    color: "#1DB954",
    icon: Spotify,
  },
  claude: {
    name: AllowedPlatforms.CLAUDE,
    color: "#00A67E",
    icon: ClaudeAI,
  },
  youtube: {
    name: AllowedPlatforms.YOUTUBE,
    color: "#FF0000",
    icon: YouTube,
  },
  disney: {
    name: AllowedPlatforms.DISNEY,
    color: "#113CCF",
    icon: Disney,
  },
} as const satisfies Record<string, ServiceIcon>;

export type ServiceKey = keyof typeof serviceIcons;
