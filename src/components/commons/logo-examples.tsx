/**
 * Logo Component Usage Examples
 * This file demonstrates different ways to use the Logo component
 */

import { Logo, LogoIcon, LogoText } from './logo';

// Example 1: Basic usage in navigation
export function NavigationExample() {
  return (
    <nav className="flex items-center justify-between p-4">
      <Logo size="default" />
      {/* Navigation items */}
    </nav>
  );
}

// Example 2: Footer with white variant
export function FooterExample() {
  return (
    <footer className="bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Logo size="default" variant="white" />
        <p className="text-gray-400 mt-4">
          Building financial resilience through community savings.
        </p>
      </div>
    </footer>
  );
}

// Example 3: Hero section with large logo
export function HeroExample() {
  return (
    <section className="text-center py-20">
      <Logo size="xl" />
      <h1 className="text-4xl font-bold mt-4">Welcome to Jamii Save</h1>
    </section>
  );
}

// Example 4: Mobile header with small logo
export function MobileHeaderExample() {
  return (
    <header className="flex items-center justify-between p-2">
      <Logo size="sm" />
      {/* Mobile menu button */}
    </header>
  );
}

// Example 5: Icon only for favicon/app icon
export function IconOnlyExample() {
  return (
    <div className="flex items-center gap-4">
      <LogoIcon size="lg" />
      <span>Just the icon</span>
    </div>
  );
}

// Example 6: Text only
export function TextOnlyExample() {
  return (
    <div className="flex items-center gap-4">
      <LogoText size="lg" />
      <span>Just the text</span>
    </div>
  );
}

// Example 7: Custom styling
export function CustomStylingExample() {
  return (
    <div className="flex items-center gap-4">
      <Logo
        size="lg"
        variant="white"
        className="hover:opacity-80 transition-opacity cursor-pointer"
        text="Custom Brand"
      />
    </div>
  );
}

// Example 8: Different variants
export function VariantsExample() {
  return (
    <div className="flex items-center gap-4 p-4">
      {/* Default variant */}
      <Logo size="default" variant="default" />

      {/* White variant for dark backgrounds */}
      <div className="bg-gray-900 p-2 rounded">
        <Logo size="default" variant="white" />
      </div>

      {/* Dark variant */}
      <Logo size="default" variant="dark" />
    </div>
  );
}

// Example 9: Size comparison
export function SizeComparisonExample() {
  return (
    <div className="flex items-center gap-4 p-4">
      <Logo size="sm" />
      <Logo size="default" />
      <Logo size="lg" />
      <Logo size="xl" />
    </div>
  );
}
