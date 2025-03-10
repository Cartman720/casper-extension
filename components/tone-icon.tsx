import { Smile, Zap, Heart, TrendingUp, Frown, Laugh } from "lucide-react";

// Map icon string names to their Lucide components
const iconMap: Record<string, React.ElementType> = {
  smile: Smile,
  zap: Zap,
  heart: Heart,
  "trending-up": TrendingUp,
  frown: Frown,
  laugh: Laugh,
};

interface ToneIconProps {
  icon: string;
  size?: number;
  className?: string;
}

export function ToneIcon({ icon, className, size = 24 }: ToneIconProps) {
  // Get the corresponding Lucide Icon component from the map
  const IconComponent = iconMap[icon];

  // If the icon doesn't exist in the map, return null or a fallback
  if (!IconComponent) {
    return <span>Icon not found</span>; // Fallback for invalid icon names
  }

  // Render the icon with the provided color and size
  return <IconComponent className={className} size={size} />;
}
