import type { ComponentProps } from 'react';

type AppLogoIconProps = Omit<ComponentProps<'img'>, 'src' | 'alt'>;

export default function AppLogoIcon(props: AppLogoIconProps) {
    return <img {...props} src="/company-logo.png" alt="Company logo" />;
}
