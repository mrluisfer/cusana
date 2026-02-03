import { Amazon } from "@/assets/icons/amazon";
import { Apple } from "@/assets/icons/apple";
import { AppleMusic } from "@/assets/icons/apple-music";
import { AppStore } from "@/assets/icons/appstore";
import { ClaudeAI } from "@/assets/icons/claude";
import { GitHubCopilot } from "@/assets/icons/copilot";
import { Discord } from "@/assets/icons/discord";
import { Disney } from "@/assets/icons/disney";
import { Google } from "@/assets/icons/google";
import { GooglePlay } from "@/assets/icons/google-play";
import { HBO } from "@/assets/icons/hbo";
import { MercadoLibre } from "@/assets/icons/mercado-libre";
import { Netflix } from "@/assets/icons/netfilix";
import { Other } from "@/assets/icons/other";
import { Patreon } from "@/assets/icons/patreon";
import { Primevideo } from "@/assets/icons/prime-video";
import { Spotify } from "@/assets/icons/spotify";
import { TIDAL } from "@/assets/icons/tidal";
import { XformerlyTwitter } from "@/assets/icons/twitter";
import { Twitch } from "@/assets/icons/twtich";
import { Uber } from "@/assets/icons/uber";
import { Xbox } from "@/assets/icons/xbox";
import { YouTube } from "@/assets/icons/youtube";
import { AllowedPlatforms } from "./allowed-platforms";

type ServiceCategory =
  | "streaming"
  | "music"
  | "ai"
  | "developer"
  | "productivity"
  | "gaming"
  | "transport"
  | "marketplace"
  | "creator"
  | "social"
  | "store"
  | "device";

type ServiceIcon = {
  name: AllowedPlatforms;
  label: string;
  color: string;
  bgColor: string;
  darkColor?: string;
  category?: ServiceCategory;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
};

const DEFAULT_BG_ALPHA = "1F";

const withAlpha = (hex: string, alpha = DEFAULT_BG_ALPHA) => `${hex}${alpha}`;

export const serviceIcons = {
  netflix: {
    name: AllowedPlatforms.NETFLIX,
    label: "Netflix",
    color: "#E50914",
    bgColor: withAlpha("#E50914"),
    category: "streaming",
    icon: Netflix,
  },
  spotify: {
    name: AllowedPlatforms.SPOTIFY,
    label: "Spotify",
    color: "#1DB954",
    bgColor: withAlpha("#1DB954"),
    category: "music",
    icon: Spotify,
  },
  claude: {
    name: AllowedPlatforms.CLAUDE,
    label: "Claude",
    color: "#F97316",
    bgColor: withAlpha("#F97316"),
    category: "ai",
    icon: ClaudeAI,
  },
  youtube: {
    name: AllowedPlatforms.YOUTUBE,
    label: "YouTube",
    color: "#FF0033",
    bgColor: withAlpha("#FF0033"),
    category: "streaming",
    icon: YouTube,
  },
  disney: {
    name: AllowedPlatforms.DISNEY,
    label: "Disney+",
    color: "#1D4ED8",
    bgColor: withAlpha("#1D4ED8"),
    category: "streaming",
    icon: Disney,
  },
  twitch: {
    name: AllowedPlatforms.TWITCH,
    label: "Twitch",
    color: "#9146FF",
    bgColor: withAlpha("#9146FF"),
    category: "streaming",
    icon: Twitch,
  },
  google: {
    name: AllowedPlatforms.GOOGLE,
    label: "Google",
    color: "#4285F4",
    bgColor: withAlpha("#4285F4"),
    category: "productivity",
    icon: Google,
  },
  prime_video: {
    name: AllowedPlatforms.PRIME_VIDEO,
    label: "Prime Video",
    color: "#00A8E1",
    bgColor: withAlpha("#00A8E1"),
    category: "streaming",
    icon: Primevideo,
  },
  copilot: {
    name: AllowedPlatforms.COPILOT,
    label: "GitHub Copilot",
    color: "#7C3AED",
    bgColor: withAlpha("#7C3AED"),
    category: "developer",
    icon: GitHubCopilot,
  },
  uber: {
    name: AllowedPlatforms.UBER,
    label: "Uber",
    color: "#111111",
    bgColor: withAlpha("#111111"),
    darkColor: "#F8FAFC",
    category: "transport",
    icon: Uber,
  },
  xbox: {
    name: AllowedPlatforms.XBOX,
    label: "Xbox",
    color: "#107C10",
    bgColor: withAlpha("#107C10"),
    category: "gaming",
    icon: Xbox,
  },
  apple_music: {
    name: AllowedPlatforms.APPLE_MUSIC,
    label: "Apple Music",
    color: "#FA233B",
    bgColor: withAlpha("#FA233B"),
    category: "music",
    icon: AppleMusic,
  },
  apple: {
    name: AllowedPlatforms.APPLE,
    label: "Apple",
    color: "#0F0F0F",
    bgColor: withAlpha("#0F0F0F"),
    darkColor: "#F8FAFC",
    category: "device",
    icon: Apple,
  },
  tidal: {
    name: AllowedPlatforms.TIDAL,
    label: "TIDAL",
    color: "#0F0F0F",
    bgColor: withAlpha("#0F0F0F"),
    darkColor: "#F8FAFC",
    category: "music",
    icon: TIDAL,
  },
  appstore: {
    name: AllowedPlatforms.APPSTORE,
    label: "App Store",
    color: "#0A84FF",
    bgColor: withAlpha("#0A84FF"),
    category: "store",
    icon: AppStore,
  },
  google_play: {
    name: AllowedPlatforms.GOOGLE_PLAY,
    label: "Google Play",
    color: "#34A853",
    bgColor: withAlpha("#34A853"),
    category: "store",
    icon: GooglePlay,
  },
  mercado_libre: {
    name: AllowedPlatforms.MERCADO_LIBRE,
    label: "Mercado Libre",
    color: "#FDE047",
    bgColor: withAlpha("#FDE047", "33"),
    category: "marketplace",
    icon: MercadoLibre,
  },
  patreon: {
    name: AllowedPlatforms.PATREON,
    label: "Patreon",
    color: "#F96854",
    bgColor: withAlpha("#F96854"),
    category: "creator",
    icon: Patreon,
  },
  twitter: {
    name: AllowedPlatforms.TWITTER,
    label: "X (Twitter)",
    color: "#0F1419",
    bgColor: withAlpha("#0F1419"),
    darkColor: "#F8FAFC",
    category: "social",
    icon: XformerlyTwitter,
  },
  otros: {
    name: AllowedPlatforms.OTROS,
    label: "Otros (Puedes modificarlo después)",
    color: "#64748B",
    bgColor: withAlpha("#64748B"),
    icon: Other,
  },
  amazon: {
    name: AllowedPlatforms.AMAZON,
    label: "Amazon",
    color: "#FF9900",
    bgColor: withAlpha("#FF9900"),
    category: "marketplace",
    icon: Amazon,
  },
  hbo: {
    name: AllowedPlatforms.HBO,
    label: "HBO",
    color: "#000000",
    bgColor: withAlpha("#000000"),
    darkColor: "#F8FAFC",
    category: "streaming",
    icon: HBO,
  },
  discord: {
    name: AllowedPlatforms.DISCORD,
    label: "Discord",
    color: "#5865F2",
    bgColor: withAlpha("#5865F2"),
    category: "social",
    icon: Discord,
  },
} as const satisfies Record<string, ServiceIcon>;

export type ServiceKey = keyof typeof serviceIcons;
