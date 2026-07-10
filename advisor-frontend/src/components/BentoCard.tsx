import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ReactNode, useEffect, useRef } from 'react';

interface BentoCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  accent: 'blue' | 'green' | 'amber' | 'emerald';
  className?: string;
}

export default function BentoCard({ title, description, icon, className = '' }: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const rotateX = useTransform(y, [-50, 50], [4, -4]);
  const rotateY = useTransform(x, [-50, 50], [-4, 4]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set((e.clientX - centerX) / 20);
      mouseY.set((e.clientY - centerY) / 20);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={cardRef}
      className={'relative p-6 rounded-xl ' + className}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        backgroundColor: 'var(--theme-surface)',
        borderColor: 'var(--theme-border)',
        border: '1px solid var(--theme-border)',
        boxShadow: '2px 2px 0px 0px var(--theme-ink)',
      }}
      whileHover={{
        y: -1,
        x: -1,
        boxShadow: '3px 3px 0px 0px var(--theme-ink)',
      }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      <div style={{ color: 'var(--theme-brand)' }} className="mb-4">
        {icon}
      </div>
      <h3 style={{ color: 'var(--theme-text)' }} className="font-sans text-[15px] font-bold mb-2 tracking-tight">
        {title}
      </h3>
      <p style={{ color: 'var(--theme-text-muted)' }} className="text-xs sm:text-[13px] leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
