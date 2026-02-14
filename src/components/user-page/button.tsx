import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  `
  up-button
  h-10
  flex items-center justify-center
  whitespace-nowrap
  transition-all
  shrink-0
  outline-none
  select-none
  `,
  {
    variants: {
      buttonStyle: {
        solid: "up-button-solid",

        outline: "up-button-outline",

        paper: "up-button-paper",

        shadow: "up-button-solid up-button-shadow",

        "3d": "up-button-solid up-button-3d",

        ghost: "up-button-ghost",
      },

      shape: {
        square: "up-button-square",
        rounded: "up-button-rounded",
        pill: "up-button-pill",
      },
    },

    defaultVariants: {
      shape: "rounded",
      buttonStyle: "solid",
    },
  },
)

function Button({
  className,
  shape = "rounded",
  buttonStyle = "solid",
  ...props
}: React.ComponentProps<"a"> & VariantProps<typeof buttonVariants>) {
  return (
    <a
      data-slot="button"
      target="_blank"
      className={cn(buttonVariants({ shape, buttonStyle }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
