
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      
      containerRef.current.style.setProperty('--mouse-x', x.toString());
      containerRef.current.style.setProperty('--mouse-y', y.toString());
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative overflow-hidden bg-gradient-to-b from-background to-background/80 py-20 sm:py-32"
      style={{ 
        '--mouse-x': '0.5', 
        '--mouse-y': '0.5',
      } as React.CSSProperties}
    >
      {/* Glass sphere effect that follows cursor */}
      <div 
        className="pointer-events-none absolute -inset-px opacity-50 mix-blend-overlay transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle at calc(var(--mouse-x) * 100%) calc(var(--mouse-y) * 100%), rgba(var(--primary-rgb), 0.15), transparent 50%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block">Code Smarter,</span>
              <span className="block text-primary mt-2">Build Faster</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-6 max-w-2xl mx-auto text-xl text-muted-foreground"
          >
            Analyze complexity, generate optimized code, and master algorithms with our intelligent code companion.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-10 flex justify-center gap-4"
          >
            <Button asChild size="lg" className="rounded-full">
              <Link to="/complexity-analysis">
                Analyze Code <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link to="/code-generation">
                Generate Code
              </Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 glass-card rounded-2xl p-6 sm:p-10 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              title="Code Analysis"
              description="Get time & space complexity insights"
              delay={0.2}
              href="/complexity-analysis"
            />
            <FeatureCard
              title="AI Generation"
              description="Create code in any language"
              delay={0.4}
              href="/code-generation"
            />
            <FeatureCard
              title="Problem Solving"
              description="Get multiple solution approaches"
              delay={0.6}
              href="/problem-solving"
            />
            <FeatureCard
              title="Practice"
              description="Solve and submit problems"
              delay={0.8}
              href="/practice"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  delay: number;
  href: string;
}

const FeatureCard = ({ title, description, delay, href }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="relative group"
  >
    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-primary rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
    <Link to={href}>
      <div className="relative bg-card hover:bg-card/80 rounded-lg p-4 flex flex-col items-center text-center transition duration-300 h-full">
        <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  </motion.div>
);

export default Hero;
