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
    name: "Midnight Pro",
    backgroundColor: "#0F172A",
    fontFamily: "Inter",
    textColor: "#F8FAFC",
    buttonShape: "rounded",
    buttonStyle: "solid",
    buttonColor: "#2563EB",
    buttonTextColor: "#FFFFFF",
  },
  {
    name: "Minimal Light",
    backgroundColor: "#FFFFFF",
    fontFamily: "DM Sans",
    textColor: "#111827",
    buttonShape: "rounded",
    buttonStyle: "outline",
    buttonColor: "#111827",
    buttonTextColor: "#111827",
  },
  {
    name: "Founder Dark",
    backgroundColor: "#0B0B0C",
    fontFamily: "Manrope",
    textColor: "#E5E7EB",
    buttonShape: "pill",
    buttonStyle: "solid",
    buttonColor: "#22C55E",
    buttonTextColor: "#0B0B0C",
  },
  {
    name: "Editorial Classic",
    backgroundColor: "#F8F5F2",
    fontFamily: "Playfair Display",
    textColor: "#2C2C2C",
    buttonShape: "rounded",
    buttonStyle: "paper",
    buttonColor: "#2C2C2C",
    buttonTextColor: "#FFFFFF",
  },
  {
    name: "Soft Beige",
    backgroundColor: "#FAF3E0",
    fontFamily: "Lora",
    textColor: "#3A3A3A",
    buttonShape: "rounded",
    buttonStyle: "solid",
    buttonColor: "#C08457",
    buttonTextColor: "#FFFFFF",
  },
  {
    name: "Creator Blue",
    backgroundColor: "#EFF6FF",
    fontFamily: "Outfit",
    textColor: "#1E3A8A",
    buttonShape: "pill",
    buttonStyle: "shadow",
    buttonColor: "#2563EB",
    buttonTextColor: "#FFFFFF",
  },
  {
    name: "Graphite",
    backgroundColor: "#1F2937",
    fontFamily: "Plus Jakarta Sans",
    textColor: "#F9FAFB",
    buttonShape: "square",
    buttonStyle: "outline",
    buttonColor: "#F9FAFB",
    buttonTextColor: "#F9FAFB",
  },
  {
    name: "Luxury Gold",
    backgroundColor: "#111111",
    fontFamily: "Libre Baskerville",
    textColor: "#F5F5F5",
    buttonShape: "rounded",
    buttonStyle: "3d",
    buttonColor: "#D4AF37",
    buttonTextColor: "#111111",
  },
  {
    name: "Modern Mono",
    backgroundColor: "#F4F4F5",
    fontFamily: "Space Grotesk",
    textColor: "#18181B",
    buttonShape: "square",
    buttonStyle: "solid",
    buttonColor: "#18181B",
    buttonTextColor: "#FFFFFF",
  },
  {
    name: "Warm Terracotta",
    backgroundColor: "#FFF7ED",
    fontFamily: "Poppins",
    textColor: "#7C2D12",
    buttonShape: "pill",
    buttonStyle: "paper",
    buttonColor: "#EA580C",
    buttonTextColor: "#FFFFFF",
  },
  {
    name: "Pure Contrast",
    backgroundColor: "#000000",
    fontFamily: "Montserrat",
    textColor: "#FFFFFF",
    buttonShape: "pill",
    buttonStyle: "ghost",
    buttonColor: "#FFFFFF",
    buttonTextColor: "#FFFFFF",
  },
  {
    name: "SaaS Clean",
    backgroundColor: "#F9FAFB",
    fontFamily: "Inter",
    textColor: "#111827",
    buttonShape: "rounded",
    buttonStyle: "shadow",
    buttonColor: "#6366F1",
    buttonTextColor: "#FFFFFF",
  },
  {
    name: "Emerald Pro",
    backgroundColor: "#064E3B",
    fontFamily: "Manrope",
    textColor: "#ECFDF5",
    buttonShape: "rounded",
    buttonStyle: "solid",
    buttonColor: "#10B981",
    buttonTextColor: "#064E3B",
  },
  {
    name: "Soft Lavender",
    backgroundColor: "#F5F3FF",
    fontFamily: "DM Sans",
    textColor: "#4C1D95",
    buttonShape: "pill",
    buttonStyle: "shadow",
    buttonColor: "#8B5CF6",
    buttonTextColor: "#FFFFFF",
  },
  {
    name: "Bold Authority",
    backgroundColor: "#FFFFFF",
    fontFamily: "Bebas Neue",
    textColor: "#111111",
    buttonShape: "square",
    buttonStyle: "solid",
    buttonColor: "#111111",
    buttonTextColor: "#FFFFFF",
  },
  {
    name: "Muted Professional",
    backgroundColor: "#F3F4F6",
    fontFamily: "Plus Jakarta Sans",
    textColor: "#374151",
    buttonShape: "rounded",
    buttonStyle: "outline",
    buttonColor: "#374151",
    buttonTextColor: "#374151",
  },
  {
    name: "Crimson Statement",
    backgroundColor: "#1F0A10",
    fontFamily: "Playfair Display",
    textColor: "#FDECEC",
    buttonShape: "rounded",
    buttonStyle: "3d",
    buttonColor: "#B91C1C",
    buttonTextColor: "#FFFFFF",
  },
  {
    name: "Ocean Depth",
    backgroundColor: "#0C4A6E",
    fontFamily: "Outfit",
    textColor: "#E0F2FE",
    buttonShape: "pill",
    buttonStyle: "shadow",
    buttonColor: "#0284C7",
    buttonTextColor: "#FFFFFF",
  },
  {
    name: "Charcoal Minimal",
    backgroundColor: "#18181B",
    fontFamily: "Space Grotesk",
    textColor: "#F4F4F5",
    buttonShape: "rounded",
    buttonStyle: "ghost",
    buttonColor: "#F4F4F5",
    buttonTextColor: "#F4F4F5",
  },
  {
    name: "Elegant Ivory",
    backgroundColor: "#FFFBF5",
    fontFamily: "Libre Baskerville",
    textColor: "#2A2A2A",
    buttonShape: "rounded",
    buttonStyle: "paper",
    buttonColor: "#2A2A2A",
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
