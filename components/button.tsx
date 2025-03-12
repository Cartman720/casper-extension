import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function Button({
  children,
  onClick,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      onClick={onClick}
      className={cn(
        "!bg-[#FE2C55] !font-medium justify-center !text-white !px-4 !py-2 !rounded-md",
        "!inline-flex !items-center !gap-2",
        className
      )}
    >
      {children}
    </button>
  );
}
