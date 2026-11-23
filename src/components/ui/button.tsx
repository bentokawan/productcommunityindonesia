import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "group inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border-[1.5px] px-7 py-4 text-button transition-colors duration-(--duration-fast) ease-(--ease-out) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-focus) disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 cursor-pointer select-none whitespace-nowrap",
  {
    variants: {
      variant: {
        primary:
          "border-brand-500 bg-brand-500 text-ink-900 hover:bg-brand-500/90 hover:border-brand-500/90",
        outline:
          "border-(--color-outline) bg-transparent text-(--color-fg) hover:bg-(--color-fg)/8",
        dark: "border-ink-900 bg-ink-900 text-white hover:bg-ink-800 hover:border-ink-800",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      fullWidth: false,
    },
  },
);

type BaseProps = VariantProps<typeof buttonVariants> & {
  children: ReactNode;
  className?: string;
  external?: boolean;
};

type ButtonAsLink = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
  };

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

export type ButtonProps = ButtonAsLink | ButtonAsButton;

export function Button(props: ButtonProps) {
  const {
    variant,
    fullWidth,
    external = false,
    className,
    children,
    ...rest
  } = props;

  const classes = cn(buttonVariants({ variant, fullWidth }), className);
  const content = (
    <>
      <span>{children}</span>
      {external && (
        <ArrowUpRight
          className="h-[18px] w-[18px] shrink-0 transition-transform duration-(--duration-fast) group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      )}
    </>
  );

  if ("href" in props && props.href !== undefined) {
    const { href, ...linkRest } = rest as Omit<
      ButtonAsLink,
      keyof BaseProps
    >;
    if (external || href.startsWith("http") || href.startsWith("#")) {
      return (
        <a
          href={href}
          className={classes}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          {...linkRest}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...linkRest}>
        {content}
      </Link>
    );
  }

  const buttonRest = rest as Omit<ButtonAsButton, keyof BaseProps>;
  return (
    <button type="button" className={classes} {...buttonRest}>
      {content}
    </button>
  );
}
