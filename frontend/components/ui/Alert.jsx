import { cn } from '../../lib/cn';

const alertVariants = {
  variant: {
    info: 'bg-primary-50 border-primary-200 text-primary-800',
    success: 'bg-success-50 border-success-200 text-success-800',
    warning: 'bg-warning-50 border-warning-200 text-warning-800',
    danger: 'bg-danger-50 border-danger-200 text-danger-800',
  },
};

const Alert = ({ 
  variant = 'info', 
  title, 
  children, 
  icon: Icon,
  action,
  className 
}) => {
  return (
    <div className={cn(
      'rounded-lg border p-4 animate-slide-down',
      alertVariants.variant[variant],
      className
    )}>
      <div className="flex items-start">
        {Icon && (
          <div className="flex-shrink-0">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium mb-1">{title}</h3>
          )}
          <div className="text-sm">{children}</div>
        </div>
        {action && (
          <div className="ml-4">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert; 