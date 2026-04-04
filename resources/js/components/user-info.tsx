import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';

export function UserInfo({ user, showEmail = false }: { user: User; showEmail?: boolean }) {
    const getInitials = useInitials();

    const getPhotoUrl = (photo: string | undefined) => {
        if (!photo) return undefined;

        if (photo.startsWith('/')) {
            return photo;
        }

        return `/storage/${photo}`;
    };

    const getAvatarSrc = () => {
        if (user.photo) {
            return getPhotoUrl(user.photo);
        }
        return user.avatar;
    };

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={getAvatarSrc()} alt={user.name} className="object-cover object-top" />
                <AvatarFallback className="rounded-lg bg-slate-900 text-slate-100">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                {showEmail && <span className="truncate text-xs text-muted-foreground">{user.email}</span>}
            </div>
        </>
    );
}
