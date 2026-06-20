# Plan: Visual Redesign of Churroverse Homepage

## Context
The current Churroverse homepage has a solid cosmic theme with animated elements, but the visual impact could be significantly enhanced. The existing design includes 7 key sections with hover effects, mouse-entering glow animations, and space-themed aesthetics. The goal is to make the homepage more visually striking and memorable while maintaining the established space theme and user flow.

## Current State
The homepage (/src/app/page.tsx) has:
- 7 sections with framer-motion animations
- Hover effects, glow animations, and mouse interactions
- Space theme with oranges, purples, and blues
- Galactic design with planets, stars, and cosmic elements
- Performance considerations for animations

## Recommended Approach
Redesign the homepage to be more visually impactful by:

### 1. Enhanced Hero Section
- Add dynamic cosmic particle effects
- Implement magnetic hover on the main CTA button
- Create animated background gradient that slowly morphs
- Add floating cosmic particles throughout hero

### 2. Immersive Product Cards
- Implement 3D tilt effect on featured product cards
- Add particle effects on hover
- Create glow radius expansion on mouse enter
- Add micro-animations when cards appear

### 3. Interactive Planets Section
- Convert planets into clickable 3D elements
- Add planetary atmosphere effects on hover
- Implement orbit animation for planets
- Add Mini-spectacle when planets are clicked

### 4. Dynamic Best Sellers
- Add count-up animation for ratings/reviews
- Implement card sequencing with staggered reveals
- Create price shimmer effects when hovering
- Add "bestseller" badge animation

### 5. Interactive Timeline
- Add parallax scrolling effect on timeline
- Implement animated node connections
- Add timeline particle bursts on scroll
- Create interactive hover states for timeline events

### 6. Holographic Reviews
- Add hologram distortion effect on review hover
- Implement quote mark animation on load
- Create star field animation in review headers
- Add social proof counter animation

### 7. Animated Newsletter
- Add glitch effect on email hover
- Implement scanline overlay with animation
- Create magnetic field effect on submit button
- Add cosmic transmission animation

### 8. Enhanced Footer
- Add animated social links with glow
- Implement hover-based planetary connections
- Create gradient text with continuous animation
- Add newsletter signup progress bar

## Files to Modify
- `storefront/src/app/page.tsx` (main redesign)
- `storefront/src/globals.css` (add new animation keyframes)
- `storefront/src/components/ui/button.tsx` (enhance button animations)
- `storefront/src/components/layout/Header.tsx` (optional header enhancements)
- `storefront/src/components/3d/GlobalCanvas.tsx` (add cosmic particle effects)

## Technology Stack
- React with framer-motion v12
- Tailwind CSS v4 with custom animations
- Three.js (via R3F) for 3D effects
- GSAP for complex animations (if needed)

## Critical Paths
1. New animation keyframes and utilities in globals.css
2. Enhanced motion variants in page.tsx
3. Component refinements for interactive elements
4. Test across different screen sizes
5. Performance optimization for animations

## Verification
- Test animations on desktop, tablet, and mobile
- Verify performance is not negatively impacted
- Ensure animations are accessible (respect reduced motion)
- Test all hover states and micro-interactions
- Validate responsive behavior