import type { Doc } from "@convex/_generated/dataModel"

const defaultThemeName = "SaaS Clean"

export const fonts = [
  // 🧼 Modern Sans-Serif
  {
    category: "sans",
    name: "Inter",
    fontFamily: "'Inter', sans-serif",
  },
  {
    category: "sans",
    name: "DM Sans",
    fontFamily: "'DM Sans', sans-serif",
  },
  {
    category: "sans",
    name: "Manrope",
    fontFamily: "'Manrope', sans-serif",
  },
  {
    category: "sans",
    name: "Plus Jakarta Sans",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  {
    category: "sans",
    name: "Outfit",
    fontFamily: "'Outfit', sans-serif",
  },
  {
    category: "sans",
    name: "Poppins",
    fontFamily: "'Poppins', sans-serif",
  },
  {
    category: "sans",
    name: "Montserrat",
    fontFamily: "'Montserrat', sans-serif",
  },

  // 📚 Serif
  {
    category: "serif",
    name: "Playfair Display",
    fontFamily: "'Playfair Display', serif",
  },
  {
    category: "serif",
    name: "Merriweather",
    fontFamily: "'Merriweather', serif",
  },
  {
    category: "serif",
    name: "Libre Baskerville",
    fontFamily: "'Libre Baskerville', serif",
  },
  {
    category: "serif",
    name: "Lora",
    fontFamily: "'Lora', serif",
  },

  // 🎯 Display / Bold
  {
    category: "display",
    name: "Bebas Neue",
    fontFamily: "'Bebas Neue', sans-serif",
  },
  {
    category: "display",
    name: "Anton",
    fontFamily: "'Anton', sans-serif",
  },
  {
    category: "display",
    name: "Archivo Black",
    fontFamily: "'Archivo Black', sans-serif",
  },
  {
    category: "display",
    name: "Space Grotesk",
    fontFamily: "'Space Grotesk', sans-serif",
  },
]

export type Theme = {
  name: string
  backgroundColor: string
  fontFamily: string
  textColor: string
  buttonShape: Doc<"profiles">["buttonShape"]
  buttonStyle: Doc<"profiles">["buttonStyle"]
  buttonColor: string
  buttonTextColor: string
}

export const themes: Theme[] = [
  {
    name: "SaaS Clean", // Default theme preserved but modernized
    backgroundColor: "#F8FAFC",
    fontFamily: "Inter",
    textColor: "#0F172A",
    buttonShape: "rounded",
    buttonStyle: "shadow",
    buttonColor: "#2563EB",
    buttonTextColor: "#FFFFFF",
  },
  {
    name: "Midnight Onyx", // Premium minimal dark mode
    backgroundColor: "#09090B",
    fontFamily: "Manrope",
    textColor: "#FAFAFA",
    buttonShape: "pill",
    buttonStyle: "outline",
    buttonColor: "#FAFAFA",
    buttonTextColor: "#FAFAFA",
  },
  {
    name: "Brutalist Sun", // Neobrutalism (Gen-Z/Designers)
    backgroundColor: "#FEE715",
    fontFamily: "Archivo Black",
    textColor: "#101820",
    buttonShape: "square",
    buttonStyle: "paper",
    buttonColor: "#FFFFFF",
    buttonTextColor: "#101820",
  },
  {
    name: "Earthy Minimal", // Creators/Lifestyle
    backgroundColor: "#FDFBF7",
    fontFamily: "DM Sans",
    textColor: "#4A3F35",
    buttonShape: "pill",
    buttonStyle: "solid",
    buttonColor: "#8C7A6B",
    buttonTextColor: "#FFFFFF",
  },
  {
    name: "Cyber Punk", // Y2K / Tech dark mode
    backgroundColor: "#0D0E15",
    fontFamily: "Space Grotesk",
    textColor: "#E2E8F0",
    buttonShape: "square",
    buttonStyle: "ghost",
    buttonColor: "#39FF14",
    buttonTextColor: "#39FF14",
  },
  {
    name: "Editorial Noir", // Classic Fashion/Art
    backgroundColor: "#EAE8E3",
    fontFamily: "Playfair Display",
    textColor: "#1C1C1C",
    buttonShape: "square",
    buttonStyle: "solid",
    buttonColor: "#1C1C1C",
    buttonTextColor: "#EAE8E3",
  },
  {
    name: "Matcha Latte", // Cozy / Wellness
    backgroundColor: "#F2F5F0",
    fontFamily: "Plus Jakarta Sans",
    textColor: "#2A3B2C",
    buttonShape: "pill",
    buttonStyle: "shadow",
    buttonColor: "#4A6B4E",
    buttonTextColor: "#FFFFFF",
  },
  {
    name: "Lavender Haze", // Soft Gen-Z pastel
    backgroundColor: "#F4F0FF",
    fontFamily: "Outfit",
    textColor: "#2D2145",
    buttonShape: "rounded",
    buttonStyle: "3d",
    buttonColor: "#8A63D2",
    buttonTextColor: "#FFFFFF",
  },
  {
    name: "Retro Pop", // 90s bold & bright
    backgroundColor: "#FF5722",
    fontFamily: "Bebas Neue",
    textColor: "#FFFFFF",
    buttonShape: "pill",
    buttonStyle: "solid",
    buttonColor: "#111111",
    buttonTextColor: "#FFFFFF",
  },
  {
    name: "Deep Ocean", // Corporate Tech / Finance
    backgroundColor: "#041527",
    fontFamily: "Montserrat",
    textColor: "#E0F2FE",
    buttonShape: "rounded",
    buttonStyle: "solid",
    buttonColor: "#0EA5E9",
    buttonTextColor: "#FFFFFF",
  },
  {
    name: "Peach Fuzz", // Pantone-inspired warm tones
    backgroundColor: "#FFF1EB",
    fontFamily: "Poppins",
    textColor: "#522A1E",
    buttonShape: "pill",
    buttonStyle: "shadow",
    buttonColor: "#FF8A65",
    buttonTextColor: "#FFFFFF",
  },
  {
    name: "Hyper Violet", // Web3 / Crypto
    backgroundColor: "#0B0410",
    fontFamily: "Anton",
    textColor: "#F5D0FE",
    buttonShape: "square",
    buttonStyle: "solid",
    buttonColor: "#D946EF",
    buttonTextColor: "#FFFFFF",
  },
  {
    name: "Desert Sand", // Boho aesthetic
    backgroundColor: "#EADFC8",
    fontFamily: "Lora",
    textColor: "#3D2E1F",
    buttonShape: "rounded",
    buttonStyle: "outline",
    buttonColor: "#965B3B",
    buttonTextColor: "#965B3B",
  },
  {
    name: "Monochrome", // Ultimate minimal black & white
    backgroundColor: "#FFFFFF",
    fontFamily: "Inter",
    textColor: "#000000",
    buttonShape: "pill",
    buttonStyle: "solid",
    buttonColor: "#000000",
    buttonTextColor: "#FFFFFF",
  },
  {
    name: "Cherry Blossom", // Cute / Illustration
    backgroundColor: "#FFF0F3",
    fontFamily: "Manrope",
    textColor: "#5C1A2B",
    buttonShape: "rounded",
    buttonStyle: "solid",
    buttonColor: "#FF4D6D",
    buttonTextColor: "#FFFFFF",
  },
  {
    name: "Vintage Paper", // Academics / Writers
    backgroundColor: "#FDF6E3",
    fontFamily: "Libre Baskerville",
    textColor: "#374151",
    buttonShape: "square",
    buttonStyle: "paper",
    buttonColor: "#EAE0C8",
    buttonTextColor: "#374151",
  },
  {
    name: "Neon Mint", // Electric & fresh dark mode
    backgroundColor: "#0A1F1C",
    fontFamily: "Outfit",
    textColor: "#CCFFF2",
    buttonShape: "pill",
    buttonStyle: "outline",
    buttonColor: "#00FFAA",
    buttonTextColor: "#00FFAA",
  },
  {
    name: "Crimson Velvet", // Luxury / Premium
    backgroundColor: "#2B0E11",
    fontFamily: "Merriweather",
    textColor: "#FDE8E9",
    buttonShape: "rounded",
    buttonStyle: "3d",
    buttonColor: "#991B27",
    buttonTextColor: "#FFFFFF",
  },
]

export function getDefaultTheme() {
  const theme = themes.find((theme) => theme.name === defaultThemeName)
  if (!theme) {
    throw new Error(`Default theme '${defaultThemeName}' not found`)
  }

  return theme
}

export function createUpThemeStyles(
  theme: Omit<Theme, "name">,
): React.CSSProperties {
  const radiusMap: Record<Theme["buttonShape"], string> = {
    square: "var(--up-button-radius-square)",
    rounded: "var(--up-button-radius-rounded)",
    pill: "var(--up-button-radius-pill)",
  }

  const font = fonts.find((f) => f.name === theme.fontFamily)

  return {
    /* Base */
    "--up-background-color": theme.backgroundColor,
    // "--up-background-image": theme.backgroundImage
    //   ? `url(${theme.backgroundImage})`
    //   : "none",
    "--up-font-family": font?.fontFamily,
    "--up-text-color": theme.textColor,

    /* Button */
    "--up-button-color": theme.buttonColor,
    "--up-button-text-color": theme.buttonTextColor,

    /* Shape (resolved) */
    "--up-button-radius": radiusMap[theme.buttonShape],
  } as React.CSSProperties
}
