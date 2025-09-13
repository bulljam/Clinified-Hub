import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ECGProps {
  width?: string | number;
  height?: string | number;
  speed?: number;
  color?: string;
  className?: string;
  bpm?: number;
}

const ECG: React.FC<ECGProps> = ({ 
  width = '100%', 
  height = 200, 
  speed = 1, 
  color = '#00FF00',
  className = '',
  bpm = 72
}) => {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const animationInterval = setInterval(() => {
      setCurrentTime(prev => prev + 16);
    }, 16);

    return () => clearInterval(animationInterval);
  }, []);

  const generateECGPath = (startX: number = 0): string => {
    const segments: string[] = [];
    const baselineY = 100;
    
    const cycleWidth = 200;
    const totalCycles = Math.ceil(1200 / cycleWidth);
    
    for (let cycle = 0; cycle < totalCycles; cycle++) {
      const cycleStartX = startX + (cycle * cycleWidth);
      
      const randomAmplitude = () => (Math.random() - 0.5) * 2;
      
      const pWavePoints = [
        [cycleStartX + 20, baselineY + randomAmplitude()],
        [cycleStartX + 30, baselineY - 8 + randomAmplitude()],
        [cycleStartX + 40, baselineY + randomAmplitude()]
      ];
      
      const prSegmentPoints = [
        [cycleStartX + 50, baselineY + randomAmplitude()]
      ];
      
      const qrsPoints = [
        [cycleStartX + 60, baselineY + 5 + randomAmplitude()],
        [cycleStartX + 65, baselineY - 45 + randomAmplitude()],
        [cycleStartX + 70, baselineY + 10 + randomAmplitude()],
        [cycleStartX + 75, baselineY + randomAmplitude()]
      ];
      const stSegmentPoints = [
        [cycleStartX + 85, baselineY - 2 + randomAmplitude()]
      ];
      
      const tWavePoints = [
        [cycleStartX + 95, baselineY + randomAmplitude()],
        [cycleStartX + 110, baselineY - 15 + randomAmplitude()],
        [cycleStartX + 125, baselineY + randomAmplitude()]
      ];
      
      const baselinePoints = [
        [cycleStartX + 140, baselineY + randomAmplitude()],
        [cycleStartX + 180, baselineY + randomAmplitude()],
        [cycleStartX + 200, baselineY + randomAmplitude()]
      ];
      
      const allPoints = [
        ...pWavePoints,
        ...prSegmentPoints,
        ...qrsPoints,
        ...stSegmentPoints,
        ...tWavePoints,
        ...baselinePoints
      ];
      
      if (cycle === 0) {
        segments.push(`M ${allPoints[0][0]} ${allPoints[0][1]}`);
      }
      
      allPoints.forEach(([x, y], index) => {
        if (cycle === 0 && index === 0) return;
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
  
  const scrollSpeed = speed * 100; 
  const scrollPosition = (currentTime * scrollSpeed / 1000) % 200;
  
  const ecgPath1 = generateECGPath(-scrollPosition);
  const ecgPath2 = generateECGPath(-scrollPosition + 200);
  const ecgPath3 = generateECGPath(-scrollPosition + 400);
  
  const sweepSpeed = speed * 150;
  const sweepPosition = (currentTime * sweepSpeed / 1000) % 800;
  
  return (
    <div 
      className={`relative bg-black border border-gray-800 rounded-lg overflow-hidden ${className}`}
      style={{ width, height }}
    >
      <svg 
        className="absolute inset-0 w-full h-full opacity-30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
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
        
        <rect width="100%" height="100%" fill="url(#minorGrid)" />
        <rect width="100%" height="100%" fill="url(#majorGrid)" />
      </svg>
      
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 800 200"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <linearGradient id="fadeOut" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="20%" stopColor="white" stopOpacity="0.3" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </linearGradient>
          
          <mask id="fadeMask">
            <rect width="800" height="200" fill="url(#fadeOut)" />
          </mask>
        </defs>
        
        <g mask="url(#fadeMask)">
          <path
            d={ecgPath1}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.3"
          />
          <path
            d={ecgPath2}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.3"
          />
          <path
            d={ecgPath3}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.3"
          />
        </g>
        
        <line
          x1={sweepPosition}
          y1="0"
          x2={sweepPosition}
          y2="200"
          stroke={color}
          strokeWidth="2"
          opacity="0.8"
          filter="url(#glow)"
        />
        
        <g>
          <defs>
            <clipPath id={`sweepClip`}>
              <rect 
                x={sweepPosition - 50} 
                y="0" 
                width="50" 
                height="200" 
              />
            </clipPath>
          </defs>
          
          <g clipPath={`url(#sweepClip)`}>
            <path
              d={ecgPath1}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
              opacity="1"
            />
            <path
              d={ecgPath2}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
              opacity="1"
            />
            <path
              d={ecgPath3}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
              opacity="1"
            />
          </g>
        </g>
      </svg>
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-gray-700 to-transparent opacity-50"></div>
        
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-t from-gray-700 to-transparent opacity-50"></div>
        
        <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-r from-gray-700 to-transparent opacity-50"></div>
        <div className="absolute top-0 bottom-0 right-0 w-1 bg-gradient-to-l from-gray-700 to-transparent opacity-50"></div>
        
        <div 
          className="absolute inset-0 rounded-lg"
          style={{
            background: `radial-gradient(ellipse at center, transparent 0%, transparent 90%, rgba(0,0,0,0.3) 100%)`,
          }}
        ></div>
      </div>
      
      <div className="absolute top-2 right-2 text-xs font-mono text-green-400 opacity-75 transition-all duration-500">
        {bpm} BPM
      </div>
      
      <div className="absolute top-2 left-2 text-xs font-mono text-green-400 opacity-75">
        LEAD II
      </div>
    </div>
  );
};

export default ECG;