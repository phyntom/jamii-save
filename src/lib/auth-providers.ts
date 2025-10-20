import { ComponentProps, ElementType } from 'react';
import { MsftIcon, MetaIcon, GoogleIcon } from '@/components/auth-icons';

export const availableAuthProviders = ['microsoft', 'google', 'facebook'] as const;

export type SupportedAuthProviders = (typeof availableAuthProviders)[number];

type IconProps = {
  size?: 'sm' | 'default' | 'lg' | 'xl';
  title?: string;
};

export const getAuthProviderIcon: Record<
  SupportedAuthProviders,
  { Icon: React.ComponentType<IconProps> }
> = {
  microsoft: { Icon: MsftIcon },
  google: { Icon: GoogleIcon },
  facebook: { Icon: MetaIcon },
};
