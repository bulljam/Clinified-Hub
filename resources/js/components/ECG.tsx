import React from 'react';
import { motion } from 'framer-motion';

interface ECGProps {
  width?: string | number;
  height?: string | number;
  speed?: number;
  color?: string;
  className?: string;
}

const ECG: React.FC<ECGProps> = ({ 
  width = '100%', 
  height = 200, 
  speed = 1, 
  color = '#00FF00',
  className = ''
}) => {
  // Generate realistic PQRST waveform pattern
  const generateECGPath = (): string => {
    const segments: string[] = [];
    const baselineY = 100; // Center baseline at half height
    let currentX = 0;
    
    // Generate multiple heartbeat cycles across the width
    const cycleWidth = 200; // Width of one complete heartbeat cycle
    const totalCycles = Math.ceil(800 / cycleWidth) + 2; // Extra cycles for seamless loop
    
    for (let cycle = 0; cycle < totalCycles; cycle++) {
      const cycleStartX = cycle * cycleWidth;
      
      // Add some randomness for realism (±2px amplitude variation)
      const randomAmplitude = () => (Math.random() - 0.5) * 4;
      
      // P-wave (atrial depolarization) - small upward curve
      const pWavePoints = [
        [cycleStartX + 20, baselineY + randomAmplitude()],
        [cycleStartX + 30, baselineY - 8 + randomAmplitude()],
        [cycleStartX + 40, baselineY + randomAmplitude()]
      ];
      
      // PR segment - flat
      const prSegmentPoints = [
        [cycleStartX + 50, baselineY + randomAmplitude()]
      ];
      
      // QRS complex (ventricular depolarization) - sharp spike
      const qrsPoints = [
        [cycleStartX + 60, baselineY + 5 + randomAmplitude()], // Q wave - small negative
        [cycleStartX + 65, baselineY - 45 + randomAmplitude()], // R wave - large positive spike
        [cycleStartX + 70, baselineY + 10 + randomAmplitude()], // S wave - small negative
        [cycleStartX + 75, baselineY + randomAmplitude()]
      ];
      // ST segment - slightly elevated flat line
      const stSegmentPoints = [
        [cycleStartX + 85, baselineY - 2 + randomAmplitude()]
      ];
      
      // T-wave (ventricular repolarization) - broader upward wave
      const tWavePoints = [
        [cycleStartX + 95, baselineY + randomAmplitude()],
        [cycleStartX + 110, baselineY - 15 + randomAmplitude()],
        [cycleStartX + 125, baselineY + randomAmplitude()]
      ];
      
      // Flat baseline until next cycle
      const baselinePoints = [
        [cycleStartX + 140, baselineY + randomAmplitude()],
        [cycleStartX + 180, baselineY + randomAmplitude()],
        [cycleStartX + 200, baselineY + randomAmplitude()]
      ];
      
      // Combine all points for this cycle
      const allPoints = [
        ...pWavePoints,
        ...prSegmentPoints,
        ...qrsPoints,
        ...stSegmentPoints,
        ...tWavePoints,
        ...baselinePoints
      ];
      
      // Convert points to SVG path commands
      if (cycle === 0) {
        segments.push(`M ${allPoints[0][0]} ${allPoints[0][1]}`);
      }
      
      allPoints.forEach(([x, y], index) => {
        if (cycle === 0 && index === 0) return; // Skip first point as it's already moved to
        
        // Use smooth curves for more realistic waveform
        if (index === 0 && cycle > 0) {
          segments.push(`L ${x} ${y}`);
        } else {
          const prevPoint = index > 0 ? allPoints[index - 1] : allPoints[allPoints.length - 1];
          const controlX = (prevPoint[0] + x) / 2;
          segments.push(`Q ${controlX} ${prevPoint[1]} ${x} ${y}`);
        }
      });
    }
    
    return segments.join(' ');
  };
  
  // Generate the ECG path
  const ecgPath = generateECGPath();
  
  // Calculate path length for animation
  const pathLength = 800 * Math.ceil(800 / 200) + 400;
  
  return (
    <div 
      className={`relative bg-black border border-gray-800 rounded-lg overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* ECG Grid Background */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Major grid (5mm squares) */}
          <pattern 
            id="majorGrid" 
            width="25" 
            height="25" 
            patternUnits="userSpaceOnUse"
          >
            <path 
              d="M 25 0 L 0 0 0 25" 
              fill="none" 
              stroke={color} 
              strokeWidth="0.8"
              opacity="0.4"
            />
          </pattern>
          
          {/* Minor grid (1mm squares) */}
          <pattern 
            id="minorGrid" 
            width="5" 
            height="5" 
            patternUnits="userSpaceOnUse"
          >
            <path 
              d="M 5 0 L 0 0 0 5" 
              fill="none" 
              stroke={color} 
              strokeWidth="0.3"
              opacity="0.2"
            />
          </pattern>
        </defs>
        
        {/* Render grid patterns */}
        <rect width="100%" height="100%" fill="url(#minorGrid)" />
        <rect width="100%" height="100%" fill="url(#majorGrid)" />
      </svg>
      
      {/* ECG Waveform */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 800 200"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Glow filter for neon effect */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Animated ECG Line */}
        <motion.path
          d={ecgPath}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
          initial={{ pathLength: 0, pathOffset: 0 }}
          animate={{ 
            pathOffset: [0, -400] // Move the pattern to create continuous scrolling
          }}
          transition={{
            pathOffset: {
              duration: 60 / speed, // 60 BPM base speed, adjustable
              ease: "linear",
              repeat: Infinity,
            }
          }}
          style={{
            strokeDasharray: pathLength,
            strokeDashoffset: 0
          }}
        />
        
        {/* Scanning line (optional - simulates real-time monitoring) */}
        <motion.line
          x1="400"
          y1="0"
          x2="400"
          y2="200"
          stroke={color}
          strokeWidth="1"
          opacity="0.6"
          initial={{ x1: 0, x2: 0 }}
          animate={{ x1: [0, 800], x2: [0, 800] }}
          transition={{
            duration: 8 / speed,
            ease: "linear",
            repeat: Infinity,
          }}
        />
      </svg>
      
      {/* Monitor-style overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top bezel */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-gray-700 to-transparent opacity-50"></div>
        
        {/* Bottom bezel */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-t from-gray-700 to-transparent opacity-50"></div>
        
        {/* Side bezels */}
        <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-r from-gray-700 to-transparent opacity-50"></div>
        <div className="absolute top-0 bottom-0 right-0 w-1 bg-gradient-to-l from-gray-700 to-transparent opacity-50"></div>
        
        {/* Subtle screen curvature effect */}
        <div 
          className="absolute inset-0 rounded-lg"
          style={{
            background: `radial-gradient(ellipse at center, transparent 0%, transparent 90%, rgba(0,0,0,0.3) 100%)`,
          }}
        ></div>
      </div>
      
      {/* Optional: Heart rate indicator */}
      <div className="absolute top-2 right-2 text-xs font-mono text-green-400 opacity-75">
        {Math.round(60 * speed)} BPM
      </div>
      
      {/* Optional: Lead indicator */}
      <div className="absolute top-2 left-2 text-xs font-mono text-green-400 opacity-75">
        LEAD II
      </div>
    </div>
  );
};

export default ECG;