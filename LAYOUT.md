# Satohash Layout & Responsive Standards

This document outlines the architectural patterns used to ensure the Satohash v3.0.0-PRO platform remains centered, responsive, and accessible across all devices.

## 1. Centering & Containers

We use a standardized `.layout-container` utility defined in `src/index.css` to manage page width and alignment.

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

The platform uses a mobile-first responsive design approach.

### Typography Scaling
Headings are strictly capped for narrow viewports to prevent horizontal scroll:
- **Hero Title**: `text-4xl` (Mobile) -> `text-[7.5rem]` (Desktop).
- **Sub-Headings**: `text-2xl` (Mobile) -> `text-5xl` (Desktop).

### Component Adaptations
- **Grids**: Standard `grid-cols-1` for mobile, shifting to `lg:grid-cols-3` or `md:grid-cols-2`.
- **Navigation**: The "Dark Vault" toggle is positioned in the **Top-Right** (`top-28 right-6`) to avoid interference with mobile OS bottom gestures and "Toaster" notification stacks.

## 3. Accessibility & Contrast

The light theme migration (v3.0.0-PRO) prioritizes WCAG 2.1 compliance.

### Color Tokens
- **--text-base**: `#1a1d2e` (High contrast primary text).
- **--text-muted**: `#475569` (Secondary descriptors, darkened from v1 for readability).
- **--text-faint**: `#64748b` (Meta-information and placeholders).

## 4. Troubleshooting
If a page appears "left-aligned" on Ultra-Wide monitors:
1. Ensure the root wrapper has `mx-auto`.
2. Verify the `max-w-*` class is applied to the direct child of the main layout container.
