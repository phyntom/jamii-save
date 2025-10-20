import { ComponentProps } from 'react';

interface MsftIconProps extends ComponentProps<'svg'> {
  size?: 'sm' | 'default' | 'lg' | 'xl';
  title?: string;
}

export function MsftIcon({ size = 'default', title, ...props }: MsftIconProps) {
  const sizeClasses = {
    sm: 'size-4', // 16x16px
    default: 'size-6', // 24x24px
    lg: 'size-8', // 32x32px
    xl: 'size-10', // 40x40px
  };
  const sizeClass = sizeClasses[size];
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={sizeClass} {...props}>
      <rect x="1" y="1" width="10" height="10" fill="#F25022" />
      <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
      <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
      <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
      {/* <span className="sr-only">{title}</span> */}
    </svg>
  );
}
