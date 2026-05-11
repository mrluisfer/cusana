import { Adobe } from "@/assets/icons/adobe";
import { Amazon, DarkAmazon } from "@/assets/icons/amazon";
import { Apple, DarkApple } from "@/assets/icons/apple";
import { AppleMusic } from "@/assets/icons/apple-music";
import { AppStore } from "@/assets/icons/appstore";
import { Azure } from "@/assets/icons/azure";
import { ClaudeAI } from "@/assets/icons/claude";
import { DarkGitHubCopilot, GitHubCopilot } from "@/assets/icons/copilot";
import { Discord } from "@/assets/icons/discord";
import { DarkDisney, Disney } from "@/assets/icons/disney";
import { Dropbox } from "@/assets/icons/dropbox";
import { FacebookIcon } from "@/assets/icons/facebook";
import { Gemini } from "@/assets/icons/gemini";
import { Google } from "@/assets/icons/google";
import { GooglePlay } from "@/assets/icons/google-play";
import { DarkHBO, HBO } from "@/assets/icons/hbo";
import { Hulu } from "@/assets/icons/hulu";
import { HuluDark } from "@/assets/icons/hulu-dark";
import { InstagramIcon } from "@/assets/icons/instagram";
import { KickLight } from "@/assets/icons/kick";
import { KickDark } from "@/assets/icons/kick-dark";
import { Linkedin } from "@/assets/icons/linkedin";
import { MercadoLibre } from "@/assets/icons/mercado-libre";
import { MicrosoftOffice } from "@/assets/icons/microsoft-office";
import { MicrosoftOnedrive } from "@/assets/icons/microsoft-onedrive";
import { Netflix } from "@/assets/icons/netfilix";
import { Other } from "@/assets/icons/other";
import { Patreon } from "@/assets/icons/patreon";
import { Paypal } from "@/assets/icons/paypal";
import { PhotoshopExpress } from "@/assets/icons/photoshop-express";
import { PolarShLight } from "@/assets/icons/polar";
import { PolarShDark } from "@/assets/icons/polar-dark";
import { Primevideo } from "@/assets/icons/prime-video";
import { SoundcloudLogo } from "@/assets/icons/soundcloud";
import { SoundcloudLogoDark } from "@/assets/icons/soundcloud-dark";
import { Spotify } from "@/assets/icons/spotify";
import { DarkTIDAL, TIDAL } from "@/assets/icons/tidal";
import { DarkXformerlyTwitter, XformerlyTwitter } from "@/assets/icons/twitter";
import { Twitch } from "@/assets/icons/twtich";
import { DarkUber, Uber } from "@/assets/icons/uber";
import { Vercel } from "@/assets/icons/vercel";
import { VercelDark } from "@/assets/icons/vercel-dark";
import { Xbox } from "@/assets/icons/xbox";
import { YouTube } from "@/assets/icons/youtube";
import { YoutubeMusic } from "@/assets/icons/youtube-music";
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
  | "device"
  | "finance";

type ServiceIcon = {
  name: AllowedPlatforms;
  label: string;
  color: string;
  bgColor: string;
  darkColor?: string;
  category?: ServiceCategory;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  darkIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
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
    darkIcon: DarkDisney,
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
    darkIcon: DarkGitHubCopilot,
  },
  uber: {
    name: AllowedPlatforms.UBER,
    label: "Uber",
    color: "#111111",
    bgColor: withAlpha("#111111"),
    darkColor: "#F8FAFC",
    category: "transport",
    icon: Uber,
    darkIcon: DarkUber,
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
    darkIcon: DarkApple,
  },
  tidal: {
    name: AllowedPlatforms.TIDAL,
    label: "TIDAL",
    color: "#0F0F0F",
    bgColor: withAlpha("#0F0F0F"),
    darkColor: "#F8FAFC",
    category: "music",
    icon: TIDAL,
    darkIcon: DarkTIDAL,
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
    darkIcon: DarkXformerlyTwitter,
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
    darkIcon: DarkAmazon,
  },
  hbo: {
    name: AllowedPlatforms.HBO,
    label: "HBO",
    color: "#000000",
    bgColor: withAlpha("#000000"),
    darkColor: "#F8FAFC",
    category: "streaming",
    icon: HBO,
    darkIcon: DarkHBO,
  },
  discord: {
    name: AllowedPlatforms.DISCORD,
    label: "Discord",
    color: "#5865F2",
    bgColor: withAlpha("#5865F2"),
    category: "social",
    icon: Discord,
  },
  adobe: {
    name: AllowedPlatforms.ADOBE,
    label: "Adobe",
    color: "#EB1000",
    bgColor: withAlpha("#EB1000"),
    category: "productivity",
    icon: Adobe,
  },
  hulu: {
    name: AllowedPlatforms.HULU,
    label: "Hulu",
    color: "#1CE783",
    bgColor: withAlpha("#1CE783"),
    category: "streaming",
    icon: Hulu,
    darkIcon: HuluDark,
  },
  kick: {
    name: AllowedPlatforms.KICK,
    label: "Kick",
    color: "#53FC18",
    bgColor: withAlpha("#53FC18"),
    category: "streaming",
    icon: KickLight,
    darkIcon: KickDark,
  },
  photoshop_express: {
    name: AllowedPlatforms.PHOTOSHOP_EXPRESS,
    label: "Photoshop Express",
    color: "#31A8FF",
    bgColor: withAlpha("#31A8FF"),
    category: "productivity",
    icon: PhotoshopExpress,
  },
  gemini: {
    name: AllowedPlatforms.GEMINI,
    label: "Gemini",
    color: "#4796E3",
    bgColor: withAlpha("#4796E3"),
    category: "ai",
    icon: Gemini,
  },
  youtube_music: {
    name: AllowedPlatforms.YOUTUBE_MUSIC,
    label: "YouTube Music",
    color: "#FF0000",
    bgColor: withAlpha("#FF0000"),
    category: "music",
    icon: YoutubeMusic,
  },
  vercel: {
    name: AllowedPlatforms.VERCEL,
    label: "Vercel",
    color: "#000000",
    bgColor: withAlpha("#000000"),
    darkColor: "#F8FAFC",
    category: "developer",
    icon: Vercel,
    darkIcon: VercelDark,
  },
  dropbox: {
    name: AllowedPlatforms.DROPBOX,
    label: "Dropbox",
    color: "#0061FF",
    bgColor: withAlpha("#0061FF"),
    category: "productivity",
    icon: Dropbox,
  },
  onedrive: {
    name: AllowedPlatforms.ONEDRIVE,
    label: "OneDrive",
    color: "#0078D4",
    bgColor: withAlpha("#0078D4"),
    category: "productivity",
    icon: MicrosoftOnedrive,
  },
  azure: {
    name: AllowedPlatforms.AZURE,
    label: "Microsoft Azure",
    color: "#0078D4",
    bgColor: withAlpha("#0078D4"),
    category: "developer",
    icon: Azure,
  },
  soundcloud: {
    name: AllowedPlatforms.SOUNDCLOUD,
    label: "SoundCloud",
    color: "#FF5500",
    bgColor: withAlpha("#FF5500"),
    category: "music",
    icon: SoundcloudLogo,
    darkIcon: SoundcloudLogoDark,
  },
  paypal: {
    name: AllowedPlatforms.PAYPAL,
    label: "PayPal",
    color: "#003087",
    bgColor: withAlpha("#003087"),
    category: "finance",
    icon: Paypal,
  },
  polar: {
    name: AllowedPlatforms.POLAR,
    label: "Polar",
    color: "#0062FF",
    bgColor: withAlpha("#0062FF"),
    category: "finance",
    icon: PolarShLight,
    darkIcon: PolarShDark,
  },
  instagram: {
    name: AllowedPlatforms.INSTAGRAM,
    label: "Instagram",
    color: "#E4405F",
    bgColor: withAlpha("#E4405F"),
    category: "social",
    icon: InstagramIcon,
  },
  linkedin: {
    name: AllowedPlatforms.LINKEDIN,
    label: "LinkedIn",
    color: "#0A66C2",
    bgColor: withAlpha("#0A66C2"),
    category: "social",
    icon: Linkedin,
  },
  facebook: {
    name: AllowedPlatforms.FACEBOOK,
    label: "Facebook",
    color: "#1877F2",
    bgColor: withAlpha("#1877F2"),
    category: "social",
    icon: FacebookIcon,
  },
  ms_office: {
    name: AllowedPlatforms.MS_OFFICE,
    label: "Microsoft Office",
    color: "#D83B01",
    bgColor: withAlpha("#D83B01"),
    category: "productivity",
    icon: MicrosoftOffice,
  },
} as const satisfies Record<string, ServiceIcon>;

export type ServiceKey = keyof typeof serviceIcons;
export type { ServiceCategory };

// Todas las keys, tipadas. `Object.keys` devuelve `string[]` por default.
export const serviceKeys = Object.keys(serviceIcons) as ServiceKey[];

// Excluye el placeholder "otros" — útil para showcases, marquees y catálogos.
export const realServiceKeys = serviceKeys.filter(
  (key): key is Exclude<ServiceKey, "otros"> => key !== "otros",
);

// Filtra por categoría — para secciones tipo "Solo streaming" o "Música".
export const getServicesByCategory = (category: ServiceCategory) =>
  realServiceKeys.filter((key) => serviceIcons[key].category === category);
