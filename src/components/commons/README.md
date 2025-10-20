# Logo Component

A reusable logo component for Jamii Save using the actual `jamii.jpg` image with multiple variants and sizes.

## Usage

### Basic Logo

```tsx
import { Logo } from "@/components/commons/logo"

// Default logo with text
<Logo />

// Logo with custom text
<Logo text="My Custom Text" />
```

### Logo Icon Only

```tsx
import { LogoIcon } from '@/components/commons/logo';

// Just the icon
<LogoIcon size="lg" />;
```

### Logo Text Only

```tsx
import { LogoText } from '@/components/commons/logo';

// Just the text
<LogoText size="xl" text="Jamii Save" />;
```

## Props

### Logo Props

- `size?: "sm" | "default" | "lg" | "xl"` - Size of the logo (default: "default")
- `showText?: boolean` - Whether to show text alongside icon (default: true)
- `className?: string` - Custom CSS classes
- `text?: string` - Custom text to display (default: "Jamii Save")
- `variant?: "default" | "white" | "dark"` - Color variant (default: "default")

### Size Options

- `sm`: 24x24px icon, 14px text
- `default`: 32x32px icon, 18px text
- `lg`: 40x40px icon, 20px text
- `xl`: 48x48px icon, 24px text

### Variant Options

- `default`: Blue gradient icon, dark text
- `white`: White background icon, white text
- `dark`: Dark background icon, dark text

## Examples

### Navigation Bar

```tsx
<Logo size="default" />
```

### Footer (Dark Background)

```tsx
<Logo size="default" variant="white" />
```

### Mobile Header (Small)

```tsx
<Logo size="sm" />
```

### Hero Section (Large)

```tsx
<Logo size="xl" />
```

### Icon Only for Favicon/App Icon

```tsx
<LogoIcon size="lg" />
```

### Custom Styling

```tsx
<Logo
  size="lg"
  variant="white"
  className="hover:opacity-80 transition-opacity"
  text="Custom Brand"
/>
```

## File Structure

```
components/commons/
├── logo.tsx          # Main logo component
├── index.ts          # Export file
└── README.md         # This documentation
```

## Integration

The logo component is already integrated into:

- Landing page navigation
- Landing page footer
- Can be easily added to dashboard header, auth pages, etc.

## Image Usage

The logo component uses the actual `jamii.jpg` image from your design system, maintaining consistency with your original branding. The image is:

- Stored in the `/public` directory as `/jamii.jpg`
- Automatically optimized by Next.js Image component
- Rounded to match your original design (`rounded-full`)
- Responsive across all size variants

## Future Enhancements

- SVG logo support
- Animation variants
- Custom color schemes
- Logo with tagline
- Responsive sizing
