import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  /**
   * Size of the logo
   * @default "default"
   */
  size?: 'sm' | 'default' | 'lg' | 'xl';
  /**
   * Whether to show the text alongside the icon
   * @default true
   */
  showText?: boolean;
  /**
   * Custom className for styling
   */
  className?: string;
  /**
   * Custom text to display instead of "Jamii Save"
   */
  text?: string;
  /**
   * Whether to use a different color scheme
   * @default false
   */
  variant?: 'default' | 'white' | 'dark';
}

const textSizeClasses = {
  sm: 'text-sm',
  default: 'text-lg',
  lg: 'text-xl',
  xl: 'text-2xl',
};

const imageSizeClasses = {
  sm: 24,
  default: 32,
  lg: 40,
  xl: 48,
};

export function Logo({
  size = 'default',
  showText = true,
  className,
  text = 'Jamii Save',
  variant = 'default',
}: LogoProps) {
  const logoClasses = cn('flex items-center space-x-2', className);

  const imageSize = imageSizeClasses[size];

  const textClasses = cn(
    'font-bold',
    textSizeClasses[size],
    variant === 'white' && 'text-white',
    variant === 'dark' && 'text-gray-900',
    variant === 'default' && 'text-gray-900',
  );

  return (
    <div className={logoClasses}>
      <Image
        src="/jamii-save.png"
        alt="Jamii Save Logo"
        width={imageSize}
        height={imageSize}
        className="rounded-full"
      />
      {showText && <span className={textClasses}>{text}</span>}
    </div>
  );
}

// Export individual components for more flexibility
export function LogoIcon({ size = 'default', className }: Omit<LogoProps, 'showText' | 'text'>) {
  return <Logo size={size} showText={false} className={className} />;
}

export function LogoText({ size = 'default', className, text }: Omit<LogoProps, 'showText'>) {
  return <Logo size={size} showText={true} className={className} text={text} />;
}
