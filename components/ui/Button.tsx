import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import Icon from "./Icon";

/**
 * The page's only button. Every CTA is a pill; the variants differ only in
 * ground and ink so the shape reads as one system across light sections and
 * over photography.
 */
type Variant = "primary" | "white" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-dark shadow-[0_6px_18px_rgb(7_140_200/0.28)]",
  white: "bg-white text-ink hover:bg-white shadow-[0_8px_24px_rgb(16_43_78/0.18)]",
  outline: "bg-white text-brand border border-brand/45 hover:border-brand hover:bg-wash",
  ghost: "bg-transparent text-white hover:bg-white/10",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-[52px] px-7 text-[15px]",
};

type Props = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  withArrow?: boolean;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "className" | "children">;

export default function Button({
  children,
  variant = "primary",
  size = "md",
  withArrow = false,
  className = "",
  ...rest
}: Props) {
  return (
    <Link
      className={[
        "group inline-flex items-center justify-center gap-2 rounded-pill font-semibold",
        "transition-[transform,background-color,border-color,box-shadow] duration-200",
        "hover:-translate-y-px motion-reduce:hover:translate-y-0",
        VARIANTS[variant],
        SIZES[size],
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
      {withArrow && (
        <Icon
          name="arrowRight"
          size={16}
          className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
        />
      )}
    </Link>
  );
}
