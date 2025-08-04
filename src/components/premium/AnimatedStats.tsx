import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedStatsProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function AnimatedStats({ 
  value, 
  duration = 2000, 
  suffix = '', 
  prefix = '',
  className = ''
}: AnimatedStatsProps) {
  const [displayValue, setDisplayValue] = useState(0);
  
  const spring = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  const rounded = useTransform(spring, (latest) => Math.round(latest));
  
  useEffect(() => {
    spring.set(value);
    
    const unsubscribe = rounded.onChange((latest) => {
      setDisplayValue(latest);
    });
    
    return unsubscribe;
  }, [value, spring, rounded]);
  
  return (
    <motion.span 
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {prefix}{displayValue.toLocaleString()}{suffix}
    </motion.span>
  );
}

interface AnimatedProgressProps {
  value: number;
  max: number;
  className?: string;
  barClassName?: string;
  showValue?: boolean;
}

export function AnimatedProgress({ 
  value, 
  max, 
  className = '',
  barClassName = '',
  showValue = true 
}: AnimatedProgressProps) {
  const percentage = (value / max) * 100;
  
  return (
    <div className={cn("space-y-2", className)}>
      {showValue && (
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Progress</span>
          <span className="font-medium">
            <AnimatedStats value={value} /> / {max}
          </span>
        </div>
      )}
      
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full", barClassName)}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}