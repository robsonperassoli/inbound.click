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
  w-full
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

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  className?: string
  href?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
  children?: React.ReactNode
  [key: string]: unknown
}

function Button({
  className,
  shape = "rounded",
  buttonStyle = "solid",
  href,
  onClick,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ shape, buttonStyle }), className)

  if (href) {
    return (
      <a
        data-slot="button"
        href={href}
        target="_blank"
        className={classes}
        onClick={onClick}
        {...props}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      data-slot="button"
      type="button"
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export { Button, buttonVariants }
