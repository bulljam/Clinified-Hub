import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconProps {
    iconNode?: LucideIcon | null;
    className?: string;
    onClick?: () => void;
}

export function Icon({ iconNode: IconComponent, className, onClick }: IconProps) {
    if (!IconComponent) {
        return null;
    }

    return (
        <IconComponent
            className={cn(
                onClick && "cursor-pointer hover:opacity-75 transition-opacity",
                className
            )}
            onClick={onClick}
        />
    );
}
