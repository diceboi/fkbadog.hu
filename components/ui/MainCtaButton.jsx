import Link from "next/link";
import { useId } from "react";

export default function MainCtaButton({
  children,
  href,
  onClick,
  className = "",
  type = "button",
  variant = "accent", // "accent" | "black"
  ...props
}) {
  const isBlack = variant === "black";
  const mainColor = isBlack ? "#1D1D1E" : "#D6DF27";
  const textColor = isBlack ? "text-white" : "text-black";
  const id = useId();
  const gradId = `btn-grad-${id.replace(/:/g, "")}`;

  const ButtonContent = () => (
    <>
      {/* 1. Left solid green background (translates on hover, has 12px overlap to prevent gaps) */}
      <div
        className="absolute top-0 left-0 h-full w-[calc(100%+12px)] transition-transform duration-300 ease-out -translate-x-[44px] xl:-translate-x-[50px] group-hover:translate-x-0 z-0"
        style={{ backgroundColor: mainColor }}
      />

      {/* 2. Right square SVG containing the 90-degree rounded chevron and gradient */}
      <svg
        className="absolute top-0 right-0 h-full aspect-square pointer-events-none transition-transform duration-300 ease-out translate-x-0 group-hover:translate-x-[44px] xl:group-hover:translate-x-[50px] z-10"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={mainColor} stopOpacity="1" />
            <stop offset="100%" stopColor={mainColor} stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Right gradient section (underneath) */}
        <path
          d="M 25,0 H 100 V 100 H 25 L 60,65 C 70,55 70,45 60,35 Z"
          fill={`url(#${gradId})`}
        />

        {/* Left solid section of the square */}
        <path
          d="M 0,0 H 25 L 60,35 C 70,45 70,55 60,65 L 25,100 H 0 Z"
          fill={mainColor}
        />
      </svg>

      {/* 3. Label */}
      <span className={`flex-grow text-center font-bold text-[12px] xl:text-[12px] uppercase py-2.5 px-5 xl:px-6 select-none z-20 ${textColor}`}>
        {children}
      </span>
    </>
  );


  const baseClasses = `
    group relative inline-flex items-center justify-between
    bg-transparent rounded-[14px] overflow-hidden
    transition-all duration-300 h-[44px] xl:h-[50px]
    min-w-[120px] xl:min-w-[140px]
    hover:scale-[1.01] active:scale-[0.99] cursor-pointer
  `;

  if (href) {
    return (
      <Link href={href} className={`${baseClasses} ${className}`} {...props}>
        <ButtonContent />
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${className}`}
      {...props}
    >
      <ButtonContent />
    </button>
  );
}
