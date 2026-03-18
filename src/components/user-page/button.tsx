import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  `
  flex h-10 flex-1 items-center justify-center
  whitespace-nowrap
  border-2 border-transparent
  px-4 text-sm font-medium
  transition-all duration-150
  outline-none
  select-none
  @md/user-page:px-6 @md/user-page:text-base
  `,
  {
    variants: {
      buttonStyle: {
        solid: "bg-up-button text-up-button-foreground",
        outline: "border-up-button bg-transparent text-up-button",
        paper: "border-black bg-up-button text-up-button-foreground",
        shadow:
          "bg-up-button text-up-button-foreground shadow-[0_6px_12px_rgb(0_0_0_/_0.25)]",
        "3d": "bg-up-button text-up-button-foreground shadow-[6px_6px_0px_0px_black] -translate-y-0.5 active:translate-y-0.5 active:shadow-none",
        ghost: "bg-transparent text-up-button",
      },
      shape: {
        square: "rounded-none",
        rounded: "rounded-lg",
        pill: "rounded-full",
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
