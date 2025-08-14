export default function LoadingSpinner({
  size = "md",
  className = "",
}: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  return (
    <div
      className={`${sizeClasses[size]} border-2 border-black border-t-transparent rounded-full animate-spin ${className}`}
    />
  )
}
