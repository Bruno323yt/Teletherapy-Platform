function Button({
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  className = "",
  ...props
}) {
  const baseClasses =
    "font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"

  const variantClasses = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500",
    secondary: "bg-secondary-100 hover:bg-secondary-200 text-secondary-800 focus:ring-secondary-500",
    outline: "border border-secondary-300 hover:bg-secondary-50 text-secondary-700 focus:ring-secondary-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
  }

  const sizeClasses = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2",
    large: "px-6 py-3 text-lg",
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 animate-spin rounded-full border-2 border-transparent border-t-current mr-2"></div>
          Cargando...
        </div>
      ) : (
        children
      )}
    </button>
  )
}

export default Button
