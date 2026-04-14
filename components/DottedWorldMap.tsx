export function DottedWorldMap() {
  return (
    <svg
      viewBox="0 0 1000 500"
      preserveAspectRatio="xMidYMid slice"
      width="100%"
      height="100%"
      opacity={0.5}
      aria-hidden="true"
    >
      <defs>
        {/* Repeating dot tile — one circle per 10×10 cell */}
        <pattern
          id="world-dot-pattern"
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="5" cy="5" r="3" fill="#C8C4BE" />
        </pattern>

        <clipPath id="clip-north-america">
          <path d="M 80,80 L 180,60 L 220,80 L 240,120 L 220,180 L 180,220 L 140,240 L 100,220 L 60,180 L 50,140 Z" />
        </clipPath>
        <clipPath id="clip-south-america">
          <path d="M 160,260 L 200,250 L 220,280 L 210,340 L 190,400 L 160,420 L 140,400 L 130,350 L 140,290 Z" />
        </clipPath>
        <clipPath id="clip-europe">
          <path d="M 480,60 L 560,50 L 580,80 L 560,120 L 520,130 L 480,120 L 460,90 Z" />
        </clipPath>
        <clipPath id="clip-africa">
          <path d="M 480,140 L 560,130 L 590,180 L 580,280 L 550,340 L 510,360 L 470,330 L 450,260 L 460,180 Z" />
        </clipPath>
        <clipPath id="clip-asia">
          <path d="M 580,50 L 780,40 L 860,80 L 880,140 L 840,200 L 780,220 L 680,210 L 600,180 L 570,130 L 580,80 Z" />
        </clipPath>
        <clipPath id="clip-australia">
          <path d="M 780,300 L 860,290 L 900,320 L 890,370 L 840,390 L 780,370 L 760,340 Z" />
        </clipPath>
      </defs>

      {/* One rect per continent, filled with the dot pattern, clipped to its shape */}
      <rect width="1000" height="500" fill="url(#world-dot-pattern)" clipPath="url(#clip-north-america)" />
      <rect width="1000" height="500" fill="url(#world-dot-pattern)" clipPath="url(#clip-south-america)" />
      <rect width="1000" height="500" fill="url(#world-dot-pattern)" clipPath="url(#clip-europe)" />
      <rect width="1000" height="500" fill="url(#world-dot-pattern)" clipPath="url(#clip-africa)" />
      <rect width="1000" height="500" fill="url(#world-dot-pattern)" clipPath="url(#clip-asia)" />
      <rect width="1000" height="500" fill="url(#world-dot-pattern)" clipPath="url(#clip-australia)" />
    </svg>
  );
}
