import React from 'react';

/**
 * Authentic Scholastic & Laboratory Vector Icon Suite
 * Handcrafted for EduBandhan Institutional Operating System
 * Features rich gradients, authentic academic tooling, and precision details.
 */

// 1. Authentic Geometry Compass (Mathematical Pair of Compasses with Arc)
export function GeometryCompassIcon({ size = 24, className = '', color = '#0284c7' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Geometry Compass"
    >
      <defs>
        <linearGradient id="compassGold" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f59e0b" />
          <stop offset="1" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="compassSilver" x1="12" y1="8" x2="36" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e2e8f0" />
          <stop offset="0.5" stopColor="#94a3b8" />
          <stop offset="1" stopColor="#64748b" />
        </linearGradient>
      </defs>
      {/* Top Pivot Knurled Hinge Knob */}
      <circle cx="24" cy="7" r="4.5" fill="url(#compassGold)" stroke="#b45309" strokeWidth="1.2" />
      <circle cx="24" cy="7" r="2" fill="#ffffff" />
      <rect x="22.5" y="11" width="3" height="4" rx="1" fill="url(#compassGold)" />
      
      {/* Left Needle Leg */}
      <path 
        d="M23 14 L11 40 L10 43.5 L12.5 41 L21 15 Z" 
        fill="url(#compassSilver)" 
        stroke="#475569" 
        strokeWidth="0.8" 
      />
      {/* Sharp Needle Tip */}
      <polygon points="10,43.5 10.8,40 9.8,40" fill="#0f172a" />

      {/* Right Pencil Leg */}
      <path 
        d="M25 14 L37 40 L38 43.5 L35.5 41 L27 15 Z" 
        fill="url(#compassSilver)" 
        stroke="#475569" 
        strokeWidth="0.8" 
      />
      {/* Pencil Clamp & Lead Tip */}
      <rect x="34" y="32" width="5.5" height="4" rx="1" transform="rotate(30 34 32)" fill="url(#compassGold)" stroke="#b45309" strokeWidth="0.8" />
      <polygon points="38,43.5 39,40 37.2,40" fill="#0284c7" />

      {/* Center Adjusting Threaded Bar & Knurled Nut */}
      <path d="M16 26 L32 26" stroke="#b45309" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="24" cy="26" r="3" fill="url(#compassGold)" stroke="#78350f" strokeWidth="1" />
      <line x1="24" y1="24" x2="24" y2="28" stroke="#ffffff" strokeWidth="1" />

      {/* Dotted Pencil Arc */}
      <path 
        d="M8 43 Q24 48 40 43" 
        stroke="#0284c7" 
        strokeWidth="1.8" 
        strokeDasharray="2 3" 
        strokeLinecap="round" 
        opacity="0.8" 
      />
    </svg>
  );
}

// 2. Authentic Optical Laboratory Microscope (High Resolution & Heavy Cast Base)
export function LabMicroscopeIcon({ size = 24, className = '', color = '#059669' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Laboratory Microscope"
    >
      <defs>
        <linearGradient id="microBrass" x1="10" y1="4" x2="38" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fef08a" />
          <stop offset="0.4" stopColor="#eab308" />
          <stop offset="1" stopColor="#a16207" />
        </linearGradient>
        <linearGradient id="microEnamel" x1="12" y1="12" x2="36" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#334155" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="glassSlide" x1="12" y1="28" x2="34" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" stopOpacity="0.8" />
          <stop offset="1" stopColor="#059669" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Eyepiece / Ocular Lens Tube */}
      <rect x="25" y="4" width="7" height="6" rx="1.5" transform="rotate(30 25 4)" fill="url(#microBrass)" stroke="#78350f" strokeWidth="0.8" />
      <rect x="20" y="8" width="6.5" height="15" rx="1.5" transform="rotate(30 20 8)" fill="url(#microEnamel)" stroke="#0f172a" strokeWidth="1" />

      {/* Revolving Objective Nosepiece & 3 Objective Lenses */}
      <circle cx="16" cy="24" r="4.5" fill="url(#microBrass)" stroke="#78350f" strokeWidth="0.8" />
      {/* Active Objective Lens pointing to stage */}
      <rect x="14" y="24" width="3.5" height="5.5" rx="1" fill="url(#microBrass)" stroke="#78350f" strokeWidth="0.8" />
      {/* Inactive Objective Lens pointing sideways */}
      <rect x="19" y="23" width="3" height="4.5" rx="0.8" transform="rotate(50 19 23)" fill="#cbd5e1" />

      {/* Mechanical Specimen Stage */}
      <rect x="7" y="29.5" width="22" height="3" rx="1" fill="#1e293b" stroke="#475569" strokeWidth="0.8" />
      {/* Glass Slide with Specimen Spec */}
      <rect x="11" y="28.5" width="14" height="1.5" rx="0.5" fill="url(#glassSlide)" />
      <circle cx="15.5" cy="29.2" r="0.9" fill="#10b981" />

      {/* Substage Mirror / LED Illuminator */}
      <ellipse cx="15" cy="35" rx="4" ry="2" fill="url(#microBrass)" stroke="#78350f" strokeWidth="0.8" />
      <path d="M15 37 L15 40" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />

      {/* Curved Heavy Cast Arm */}
      <path 
        d="M26 18 Q35 22 34 34 Q33 39 25 40" 
        stroke="url(#microEnamel)" 
        strokeWidth="4.5" 
        strokeLinecap="round" 
        fill="none" 
      />

      {/* Focus Adjustment Knobs (Coarse & Fine) */}
      <circle cx="31" cy="28" r="4" fill="url(#microBrass)" stroke="#78350f" strokeWidth="0.8" />
      <circle cx="31" cy="28" r="2" fill="#78350f" />

      {/* Heavy Weighted Horseshoe Stand Base */}
      <path 
        d="M10 44 C10 40.5 15 40 24 40 C33 40 38 40.5 38 44 C38 45.5 33 46 24 46 C15 46 10 45.5 10 44 Z" 
        fill="url(#microEnamel)" 
        stroke="#0f172a" 
        strokeWidth="1.2" 
      />
      <ellipse cx="24" cy="43.5" rx="11" ry="1.8" fill="url(#microBrass)" opacity="0.6" />
    </svg>
  );
}

// 3. Authentic Desktop Rotating World Globe (with Brass Meridian & Wooden Base)
export function DesktopGlobeIcon({ size = 24, className = '', color = '#d97706' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Desktop World Globe"
    >
      <defs>
        <radialGradient id="oceanGrad" cx="30%" cy="30%" r="70%">
          <stop stopColor="#38bdf8" />
          <stop offset="0.6" stopColor="#0284c7" />
          <stop offset="1" stopColor="#075985" />
        </radialGradient>
        <linearGradient id="brassMeridian" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fef08a" />
          <stop offset="0.5" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id="woodStand" x1="16" y1="36" x2="32" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a16207" />
          <stop offset="0.5" stopColor="#78350f" />
          <stop offset="1" stopColor="#451a03" />
        </linearGradient>
      </defs>

      {/* Semi-Meridian Brass Arc Ring */}
      <path 
        d="M24 7 A16 16 0 0 1 24 39" 
        stroke="url(#brassMeridian)" 
        strokeWidth="3.2" 
        strokeLinecap="round" 
        fill="none" 
      />
      <circle cx="24" cy="7" r="2" fill="#fef08a" stroke="#78350f" strokeWidth="0.8" />
      <circle cx="24" cy="39" r="2" fill="#fef08a" stroke="#78350f" strokeWidth="0.8" />

      {/* Spherical Earth Globe Body */}
      <g transform="rotate(-15 24 23)">
        <circle cx="24" cy="23" r="13" fill="url(#oceanGrad)" stroke="#0c4a6e" strokeWidth="1" />
        {/* Latitude & Longitude Curvature Lines */}
        <ellipse cx="24" cy="23" rx="13" ry="5.5" stroke="#ffffff" strokeWidth="0.7" opacity="0.35" fill="none" />
        <ellipse cx="24" cy="23" rx="5.5" ry="13" stroke="#ffffff" strokeWidth="0.7" opacity="0.35" fill="none" />
        <line x1="11" y1="23" x2="37" y2="23" stroke="#ffffff" strokeWidth="0.9" opacity="0.45" />

        {/* Continents / Landmass Shapes (India, Eurasia, Americas, Africa) */}
        {/* Eurasia & Indian Subcontinent */}
        <path 
          d="M23 15 Q26 14 29 16 Q31 18 29 20 Q26 21 24 24 Q23 26 22 23 Q21 20 20 18 Q21 16 23 15 Z" 
          fill="#10b981" 
          opacity="0.95" 
        />
        {/* Africa */}
        <path 
          d="M17 19 Q20 20 20 24 Q18 28 16 29 Q14 26 15 22 Z" 
          fill="#34d399" 
          opacity="0.9" 
        />
        {/* Americas silhouette */}
        <path 
          d="M13 14 Q15 16 14 20 Q12 22 13 25 Q11 26 11 20 Z" 
          fill="#10b981" 
          opacity="0.85" 
        />
      </g>

      {/* Axis Rod Passing through Center */}
      <line x1="24" y1="5" x2="24" y2="41" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" />

      {/* Brass Spindle Stem & Turned Wooden Base */}
      <path d="M24 39 L24 43" stroke="url(#brassMeridian)" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="24" cy="43.5" rx="5" ry="1.5" fill="#f59e0b" />
      <path 
        d="M16 44 C16 43 19 42 24 42 C29 42 32 43 32 44 L33 46 C33 47 29 47.5 24 47.5 C19 47.5 15 47 15 46 Z" 
        fill="url(#woodStand)" 
        stroke="#451a03" 
        strokeWidth="1" 
      />
    </svg>
  );
}

// 4. Authentic Glass Chemical Test Tubes & Bubbling Reactive Flask
export function ChemicalLabIcon({ size = 24, className = '', color = '#8b5cf6' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Chemical Test Tubes & Lab Reaction"
    >
      <defs>
        <linearGradient id="liquidCyan" x1="0" y1="20" x2="0" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="liquidEmerald" x1="0" y1="20" x2="0" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34d399" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="liquidPurple" x1="0" y1="20" x2="0" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c084fc" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>

      {/* Test Tube 1 (Tilted Left, Cyan Fluid) */}
      <g transform="rotate(-18 16 26)">
        {/* Glass Rim */}
        <rect x="13" y="10" width="8" height="2" rx="1" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
        {/* Glass Body */}
        <path d="M14 12 L14 36 A3 3 0 0 0 20 36 L20 12" fill="rgba(255,255,255,0.2)" stroke="#94a3b8" strokeWidth="1.2" />
        {/* Fluid Column */}
        <path d="M14.5 24 L14.5 36 A2.5 2.5 0 0 0 19.5 36 L19.5 24 Z" fill="url(#liquidCyan)" />
        {/* Liquid Surface Meniscus */}
        <ellipse cx="17" cy="24" rx="2.5" ry="1" fill="#7dd3fc" />
        {/* Measurement Graduations */}
        <line x1="18" y1="28" x2="19.5" y2="28" stroke="#ffffff" strokeWidth="0.8" />
        <line x1="17.5" y1="31" x2="19.5" y2="31" stroke="#ffffff" strokeWidth="0.8" />
        <line x1="18" y1="34" x2="19.5" y2="34" stroke="#ffffff" strokeWidth="0.8" />
      </g>

      {/* Test Tube 2 (Upright Center, Emerald Fluid) */}
      <rect x="21" y="9" width="8" height="2.2" rx="1" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
      <path d="M22 11 L22 37 A3 3 0 0 0 28 37 L28 11" fill="rgba(255,255,255,0.25)" stroke="#94a3b8" strokeWidth="1.2" />
      <path d="M22.5 21 L22.5 37 A2.5 2.5 0 0 0 27.5 37 L27.5 21 Z" fill="url(#liquidEmerald)" />
      <ellipse cx="25" cy="21" rx="2.5" ry="1" fill="#a7f3d0" />
      {/* Reaction Bubbles Rising */}
      <circle cx="24" cy="25" r="1.2" fill="#ffffff" opacity="0.85" />
      <circle cx="26" cy="29" r="0.9" fill="#ffffff" opacity="0.85" />
      <circle cx="24.5" cy="33" r="1.5" fill="#ffffff" opacity="0.85" />

      {/* Test Tube 3 (Tilted Right, Purple Fluid) */}
      <g transform="rotate(18 34 26)">
        <rect x="29" y="10" width="8" height="2" rx="1" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
        <path d="M30 12 L30 36 A3 3 0 0 0 36 36 L36 12" fill="rgba(255,255,255,0.2)" stroke="#94a3b8" strokeWidth="1.2" />
        <path d="M30.5 26 L30.5 36 A2.5 2.5 0 0 0 35.5 36 L35.5 26 Z" fill="url(#liquidPurple)" />
        <ellipse cx="33" cy="26" rx="2.5" ry="1" fill="#e9d5ff" />
      </g>

      {/* Wooden Test Tube Rack Stand */}
      <path d="M6 39 L42 39" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
      <rect x="8" y="41" width="32" height="4" rx="1" fill="#92400e" stroke="#451a03" strokeWidth="1" />
      <circle cx="10" cy="43" r="1" fill="#fbbf24" />
      <circle cx="38" cy="43" r="1" fill="#fbbf24" />

      {/* Chemical Sparkles / Vapor Emitted */}
      <path d="M25 4 L26 6 L28 7 L26 8 L25 10 L24 8 L22 7 L24 6 Z" fill="#f59e0b" />
      <circle cx="29" cy="4" r="1" fill="#38bdf8" />
    </svg>
  );
}

// 5. Authentic Traditional Soroban Wooden Abacus (Mathematical Computing Instrument)
export function WoodenAbacusIcon({ size = 24, className = '', color = '#b45309' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Wooden Abacus"
    >
      <defs>
        <linearGradient id="abacusFrame" x1="4" y1="8" x2="44" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a16207" />
          <stop offset="0.5" stopColor="#78350f" />
          <stop offset="1" stopColor="#451a03" />
        </linearGradient>
        <linearGradient id="beadAmber" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fbbf24" />
          <stop offset="1" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="beadRuby" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#f87171" />
          <stop offset="1" stopColor="#dc2626" />
        </linearGradient>
      </defs>

      {/* Heavy Wooden Outer Beveled Frame */}
      <rect x="5" y="9" width="38" height="30" rx="3" fill="url(#abacusFrame)" stroke="#451a03" strokeWidth="1.5" />
      {/* Inner Cutout Area */}
      <rect x="9" y="13" width="30" height="22" rx="1.5" fill="#fef3c7" stroke="#92400e" strokeWidth="1" />

      {/* 5 Brass Vertical Rods */}
      {[13, 18.5, 24, 29.5, 35].map((xPos, idx) => (
        <line key={idx} x1={xPos} y1="13" x2={xPos} y2="35" stroke="#78350f" strokeWidth="1.2" />
      ))}

      {/* Horizontal Divider Beam (Separating Upper Deck from Lower Deck) */}
      <rect x="8.5" y="19" width="31" height="3" rx="0.8" fill="url(#abacusFrame)" stroke="#451a03" strokeWidth="0.8" />
      {/* Unit Alignment Reckoning Dots on Divider Beam */}
      <circle cx="18.5" cy="20.5" r="0.8" fill="#ffffff" />
      <circle cx="29.5" cy="20.5" r="0.8" fill="#ffffff" />

      {/* Upper Deck (Heaven) Bi-Conical Beads (Value = 5 each) */}
      {/* Rod 1 (Up), Rod 2 (Down on beam), Rod 3 (Up), Rod 4 (Down on beam), Rod 5 (Up) */}
      <ellipse cx="13" cy="15.5" rx="2.5" ry="1.6" fill="url(#beadAmber)" stroke="#92400e" strokeWidth="0.6" />
      <ellipse cx="18.5" cy="18" rx="2.5" ry="1.6" fill="url(#beadRuby)" stroke="#991b1b" strokeWidth="0.6" />
      <ellipse cx="24" cy="15.5" rx="2.5" ry="1.6" fill="url(#beadAmber)" stroke="#92400e" strokeWidth="0.6" />
      <ellipse cx="29.5" cy="18" rx="2.5" ry="1.6" fill="url(#beadRuby)" stroke="#991b1b" strokeWidth="0.6" />
      <ellipse cx="35" cy="15.5" rx="2.5" ry="1.6" fill="url(#beadAmber)" stroke="#92400e" strokeWidth="0.6" />

      {/* Lower Deck (Earth) Beads (Value = 1 each) */}
      {/* Rod 1 */}
      <ellipse cx="13" cy="23.5" rx="2.5" ry="1.6" fill="url(#beadAmber)" stroke="#92400e" strokeWidth="0.6" />
      <ellipse cx="13" cy="29" rx="2.5" ry="1.6" fill="url(#beadAmber)" stroke="#92400e" strokeWidth="0.6" />
      <ellipse cx="13" cy="32" rx="2.5" ry="1.6" fill="url(#beadAmber)" stroke="#92400e" strokeWidth="0.6" />

      {/* Rod 2 */}
      <ellipse cx="18.5" cy="23.5" rx="2.5" ry="1.6" fill="url(#beadAmber)" stroke="#92400e" strokeWidth="0.6" />
      <ellipse cx="18.5" cy="26" rx="2.5" ry="1.6" fill="url(#beadAmber)" stroke="#92400e" strokeWidth="0.6" />
      <ellipse cx="18.5" cy="32.5" rx="2.5" ry="1.6" fill="url(#beadAmber)" stroke="#92400e" strokeWidth="0.6" />

      {/* Rod 3 */}
      <ellipse cx="24" cy="23.5" rx="2.5" ry="1.6" fill="url(#beadAmber)" stroke="#92400e" strokeWidth="0.6" />
      <ellipse cx="24" cy="26" rx="2.5" ry="1.6" fill="url(#beadAmber)" stroke="#92400e" strokeWidth="0.6" />
      <ellipse cx="24" cy="28.5" rx="2.5" ry="1.6" fill="url(#beadAmber)" stroke="#92400e" strokeWidth="0.6" />

      {/* Rod 4 */}
      <ellipse cx="29.5" cy="23.5" rx="2.5" ry="1.6" fill="url(#beadAmber)" stroke="#92400e" strokeWidth="0.6" />
      <ellipse cx="29.5" cy="30" rx="2.5" ry="1.6" fill="url(#beadAmber)" stroke="#92400e" strokeWidth="0.6" />
      <ellipse cx="29.5" cy="32.5" rx="2.5" ry="1.6" fill="url(#beadAmber)" stroke="#92400e" strokeWidth="0.6" />

      {/* Rod 5 */}
      <ellipse cx="35" cy="23.5" rx="2.5" ry="1.6" fill="url(#beadAmber)" stroke="#92400e" strokeWidth="0.6" />
      <ellipse cx="35" cy="26" rx="2.5" ry="1.6" fill="url(#beadAmber)" stroke="#92400e" strokeWidth="0.6" />
      <ellipse cx="35" cy="28.5" rx="2.5" ry="1.6" fill="url(#beadAmber)" stroke="#92400e" strokeWidth="0.6" />

      {/* Corner Brass Reinforcement Brackets */}
      <polygon points="5,9 10,9 5,14" fill="#fbbf24" stroke="#78350f" strokeWidth="0.5" />
      <polygon points="43,9 38,9 43,14" fill="#fbbf24" stroke="#78350f" strokeWidth="0.5" />
      <polygon points="5,39 10,39 5,34" fill="#fbbf24" stroke="#78350f" strokeWidth="0.5" />
      <polygon points="43,39 38,39 43,34" fill="#fbbf24" stroke="#78350f" strokeWidth="0.5" />
    </svg>
  );
}

// 6. Institutional Gold Seal & Oxford Laurel Wreath Crest
export function InstitutionalSealIcon({ size = 28, className = '' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Institutional Seal & Crest"
    >
      <defs>
        <linearGradient id="sealGold" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fef08a" />
          <stop offset="0.3" stopColor="#f59e0b" />
          <stop offset="0.7" stopColor="#d97706" />
          <stop offset="1" stopColor="#78350f" />
        </linearGradient>
      </defs>
      {/* Outer 12-point Medallion Star */}
      <circle cx="24" cy="24" r="21" fill="url(#sealGold)" stroke="#78350f" strokeWidth="1.2" />
      <circle cx="24" cy="24" r="18" fill="#ffffff" stroke="#b45309" strokeWidth="1" />
      <circle cx="24" cy="24" r="15" fill="#fef3c7" stroke="#b45309" strokeWidth="0.8" />

      {/* Classical Open Textbook */}
      <path 
        d="M17 25 Q24 23 24 27 Q24 23 31 25 L31 33 Q24 31 24 35 Q24 31 17 33 Z" 
        fill="#0284c7" 
        stroke="#0c4a6e" 
        strokeWidth="1" 
      />
      <line x1="24" y1="27" x2="24" y2="35" stroke="#ffffff" strokeWidth="1" />

      {/* Flame of Wisdom / Diya Lamp */}
      <path 
        d="M24 13 C26 16 27 18 25.5 20 C24.5 21 23.5 21 22.5 20 C21 18 22 16 24 13 Z" 
        fill="#ea580c" 
      />
      <circle cx="24" cy="18" r="1.5" fill="#fef08a" />

      {/* Laurel Leaves Arch */}
      <path 
        d="M13 22 Q11 28 15 35 M35 22 Q37 28 33 35" 
        stroke="#059669" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        fill="none" 
      />
    </svg>
  );
}
