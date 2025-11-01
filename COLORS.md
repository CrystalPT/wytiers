# WYTiers Color Scheme

This document provides a reference for the OKLCH color system used in WYTiers.

## OKLCH Color Format

OKLCH is a perceptually uniform color space that provides better color consistency:
- **L** (Lightness): 0 to 1
- **C** (Chroma/Saturation): 0 to 0.4
- **H** (Hue): 0 to 360 degrees

## Color Palette

### Background Colors
```css
--bg-dark: oklch(0.1 0.055 305);   /* Dark purple-tinted background */
--bg: oklch(0.15 0.055 305);        /* Medium dark background */
--bg-light: oklch(0.2 0.055 305);   /* Lighter background for cards */
```

### Text Colors
```css
--text: oklch(0.96 0.1 305);        /* Primary text - very light purple-white */
--text-muted: oklch(0.76 0.1 305);  /* Secondary text - muted purple-gray */
```

### Border Colors
```css
--highlight: oklch(0.5 0.11 305);      /* Accent border - bright purple */
--border: oklch(0.4 0.11 305);         /* Normal border - medium purple */
--border-muted: oklch(0.3 0.11 305);   /* Subtle border - dark purple */
```

### Action Colors
```css
--primary: oklch(0.76 0.11 305);    /* Primary action - bright purple */
--secondary: oklch(0.76 0.11 125);  /* Secondary action - bright green */
```

### Alert Colors
```css
--danger: oklch(0.7 0.11 30);    /* Red/orange for errors */
--warning: oklch(0.7 0.11 100);  /* Yellow for warnings */
--success: oklch(0.7 0.11 160);  /* Green for success */
--info: oklch(0.7 0.11 260);     /* Blue for info */
```

## Tier Badge Colors

Tier badges use color gradients to indicate rank:

### Best Tiers (HT1, LT1)
- **Color**: Purple/Pink
- **OKLCH**: `oklch(0.5 0.11 305)`
- **Rank**: 9-10

### High Tiers (HT2, LT2)
- **Color**: Blue
- **OKLCH**: `oklch(0.5 0.11 260)`
- **Rank**: 7-8

### Mid-High Tiers (HT3, LT3)
- **Color**: Cyan
- **OKLCH**: `oklch(0.5 0.11 200)`
- **Rank**: 5-6

### Mid Tiers (HT4, LT4)
- **Color**: Green
- **OKLCH**: `oklch(0.5 0.11 160)`
- **Rank**: 3-4

### Low Tiers (HT5, LT5)
- **Color**: Yellow/Orange
- **OKLCH**: `oklch(0.6 0.11 100)`
- **Rank**: 1-2

## Region Badge Colors

### North America (NA)
- **Color**: Red
- **Hex**: `#dc2626`

### Europe (EU)
- **Color**: Green
- **Hex**: `#16a34a`

### Oceania (OCE)
- **Color**: Blue
- **Hex**: `#2563eb`

## Rank Background Colors

The top 3 positions have special gradient backgrounds:

### 1st Place
- **Gradient**: Gold
- **Classes**: `bg-gradient-to-r from-yellow-500 to-yellow-600`

### 2nd Place
- **Gradient**: Silver
- **Classes**: `bg-gradient-to-r from-gray-400 to-gray-500`

### 3rd Place
- **Gradient**: Bronze
- **Classes**: `bg-gradient-to-r from-orange-600 to-orange-700`

## Customizing Colors

To customize colors, edit `app/globals.css`:

```css
:root {
  /* Change the hue (305) to shift the color scheme */
  --bg-dark: oklch(0.1 0.055 305);  /* 305 = purple, try 200 for cyan */
  
  /* Adjust lightness (first number) for brightness */
  --text: oklch(0.96 0.1 305);  /* 0.96 = very bright */
  
  /* Modify chroma (second number) for saturation */
  --primary: oklch(0.76 0.11 305);  /* 0.11 = moderately saturated */
}
```

### Hue Reference
- **0-30**: Red/Orange
- **60-120**: Yellow/Green
- **120-180**: Green/Cyan
- **180-240**: Cyan/Blue
- **240-300**: Blue/Purple
- **300-360**: Purple/Pink

## Using Colors in Components

### With Tailwind Classes
```tsx
<div className="bg-bg text-text border-border">
  Content
</div>
```

### With Inline Styles
```tsx
<div style={{ backgroundColor: 'var(--bg)' }}>
  Content
</div>
```

### Direct OKLCH
```tsx
<div className="bg-[oklch(0.5_0.11_305)]">
  Content
</div>
```

## Browser Support

OKLCH is supported in:
- Chrome 111+
- Edge 111+
- Safari 15.4+
- Firefox 113+

For older browsers, consider adding a fallback color system or using PostCSS to convert OKLCH to RGB.

---

This color system provides a cohesive, modern look with excellent accessibility and visual hierarchy!

