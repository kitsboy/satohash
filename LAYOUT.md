# Satohash Layout & Responsive Standards

This document outlines the architectural patterns used to ensure the Satohash v4.0.0-ELITE platform remains centered, responsive, and accessible across all devices.

## 1. Centering & Containers

We use a standardized `.layout-container` utility defined in `src/index.css` (Tailwind 4) to manage page width and alignment.

### Usage Pattern
Every top-level page component should wrap its content in the layout container:
```jsx
export default function PageComponent() {
  return (
    <div className="layout-container min-h-screen pt-24 pb-20">
       {/* Content flows here centered with max-width 7xl */}
    </div>
  )
}
```

### Specifications
- **Max Width**: `max-w-7xl` (80rem / 1280px).
- **Desktop Padding**: `px-6` (24px).
- **Mobile Padding**: `px-4` (16px).
- **Alignment**: `mx-auto` (Auto-centering in horizontal plane).

## 2. Mobile Strategy (Mobile-First)

The platform uses a mobile-first responsive design approach with **Framer Motion** for adaptive transitions.

### Typography Scaling
Headings are strictly capped for narrow viewports to prevent horizontal scroll:
- **Hero Title**: `text-4xl` (Mobile) -> `text-[7.5rem]` (Desktop).
- **Sub-Headings**: `text-2xl` (Mobile) -> `text-5xl` (Desktop).

### Component Adaptations
- **Grids**: Standard `grid-cols-1` for mobile, shifting to `lg:grid-cols-3` or `md:grid-cols-2`.
- **Navigation**: The mobile menu uses a high-fidelity drawer with `backdrop-blur-2xl` to ensure legibility over complex backgrounds.

## 3. Accessibility & Contrast

The v4.0.0-ELITE interface prioritizes WCAG 2.1 compliance through the "Institutional Noir" design system.

### Color Tokens (Tailwind 4)
- **--text-base**: `#1a1d2e` (High contrast primary text).
- **--text-muted**: `#475569` (Secondary descriptors).
- **--text-faint**: `#64748b` (Meta-information and placeholders).

## 4. Performance & Motion
All layout shifts are managed via `AnimatePresence` and `layout` props in Framer Motion to ensure a "liquid" feel during responsive resizing.

---
© 2026 Satahash Institutional Division
