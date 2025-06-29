import { cn } from '../../lib/cn';

const LoadingSpinner = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <div className={cn('flex justify-center items-center', className)}>
      <div className={cn(
        'animate-spin rounded-full border-2 border-neutral-200 border-t-primary-500',
        sizeClasses[size]
      )} />
    </div>
  );
};

export default LoadingSpinner; 