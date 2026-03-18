import type { Doc } from "@convex/_generated/dataModel"

const defaultThemeName = "SaaS Clean"

export const fonts = [
  // 🧼 Modern Sans-Serif
  {
    category: "sans",
    name: "Inter",
    fontFamily: "'Inter Variable', sans-serif",
    className: "font-inter",
  },
  {
    category: "sans",
    name: "DM Sans",
    fontFamily: "'DM Sans Variable', sans-serif",
    className: "font-dm-sans",
  },
  {
    category: "sans",
    name: "Manrope",
    fontFamily: "'Manrope Variable', sans-serif",
    className: "font-manrope",
  },
  {
    category: "sans",
    name: "Plus Jakarta Sans",
    fontFamily: "'Plus Jakarta Sans Variable', sans-serif",
    className: "font-plus-jakarta-sans",
  },
  {
    category: "sans",
    name: "Outfit",
    fontFamily: "'Outfit Variable', sans-serif",
    className: "font-outfit",
  },
  {
    category: "sans",
    name: "Poppins",
    fontFamily: "'Poppins', sans-serif",
    className: "font-poppins",
  },
  {
    category: "sans",
    name: "Montserrat",
    fontFamily: "'Montserrat Variable', sans-serif",
    className: "font-montserrat",
  },

  // 📚 Serif
  {
    category: "serif",
    name: "Playfair Display",
    fontFamily: "'Playfair Display Variable', serif",
    className: "font-playfair-display",
  },
  {
    category: "serif",
    name: "Merriweather",
    fontFamily: "'Merriweather Variable', serif",
    className: "font-merriweather",
  },
  {
    category: "serif",
    name: "Libre Baskerville",
    fontFamily: "'Libre Baskerville', serif",
    className: "font-libre-baskerville",
  },
  {
    category: "serif",
    name: "Lora",
    fontFamily: "'Lora Variable', serif",
    className: "font-lora",
  },

  // 🎯 Display / Bold
  {
    category: "display",
    name: "Bebas Neue",
    fontFamily: "'Bebas Neue', sans-serif",
    className: "font-bebas-neue",
  },
  {
    category: "display",
    name: "Anton",
    fontFamily: "'Anton', sans-serif",
    className: "font-anton",
  },
  {
    category: "display",
    name: "Archivo Black",
    fontFamily: "'Archivo Black', sans-serif",
    className: "font-archivo-black",
  },
  {
    category: "display",
    name: "Space Grotesk",
    fontFamily: "'Space Grotesk Variable', sans-serif",
    className: "font-space-grotesk",
  },
]

/**
 * Theme settings for a Linktree-style profile page.
 * `buttonShape` controls the silhouette of each link button:
 * square = sharp corners, rounded = soft corners, pill = fully capsule-shaped.
 * `buttonStyle` controls the visual treatment:
 * solid = filled button, outline = transparent fill with a border,
 * shadow = filled button with depth from a drop shadow,
 * ghost = low-emphasis transparent button with minimal chrome,
 * paper = flat cutout/card-like button,
 * 3d = solid button with a slightly detached solid shadow offset to the right
 * to create a raised, layered look.
 */
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

export const basicThemes: Theme[] = [
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
    name: "Neon Mint", // Electric & fresh dark mode
    backgroundColor: "#0A1F1C",
    fontFamily: "Outfit",
    textColor: "#CCFFF2",
    buttonShape: "pill",
    buttonStyle: "outline",
    buttonColor: "#00FFAA",
    buttonTextColor: "#00FFAA",
  },
]

export const themes: Theme[] = [
  ...basicThemes,
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

export function getUserPageFontClassName(fontName: string) {
  return fonts.find((font) => font.name === fontName)?.className ?? "font-sans"
}
