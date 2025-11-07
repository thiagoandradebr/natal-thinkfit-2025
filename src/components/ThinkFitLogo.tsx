export default function ThinkFitLogo({ className = "h-8" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 500 500" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fork */}
      <path 
        d="M119 184C119 184 119 200 119 210C119 220 125 225 135 225L180 225L180 265L310 265L310 225L355 225C365 225 371 220 371 210C371 200 371 184 371 184" 
        stroke="#FFD700" 
        strokeWidth="12" 
        strokeLinecap="round"
      />
      <path 
        d="M119 184L119 200L135 200L135 184M155 184L155 200L171 200L171 184M191 184L191 200L207 200L207 184" 
        stroke="#FFD700" 
        strokeWidth="12" 
        strokeLinecap="round"
      />
      
      {/* Weights */}
      <rect x="310" y="143" width="30" height="122" rx="4" fill="url(#gradient1)" />
      <rect x="345" y="163" width="30" height="82" rx="4" fill="url(#gradient2)" />
      <rect x="360" y="183" width="20" height="42" rx="4" fill="url(#gradient3)" />
      
      {/* Gradients */}
      <defs>
        <linearGradient id="gradient1" x1="325" y1="143" x2="325" y2="265" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD700" />
          <stop offset="1" stopColor="#FFA500" />
        </linearGradient>
        <linearGradient id="gradient2" x1="360" y1="163" x2="360" y2="245" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD700" />
          <stop offset="1" stopColor="#FFA500" />
        </linearGradient>
        <linearGradient id="gradient3" x1="370" y1="183" x2="370" y2="225" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD700" />
          <stop offset="1" stopColor="#FFA500" />
        </linearGradient>
      </defs>
      
      {/* Text THINKFIT */}
      <text 
        x="250" 
        y="340" 
        fontFamily="Arial, sans-serif" 
        fontSize="60" 
        fontWeight="900" 
        fill="#3E2723" 
        textAnchor="middle"
        letterSpacing="2"
      >
        THINKFIT
      </text>
    </svg>
  )
}
