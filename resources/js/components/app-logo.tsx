import { Calendar, Stethoscope } from 'lucide-react';

export default function AppLogo() {
    return (
        <div className="flex items-center w-full pb-1">
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <Stethoscope className="size-5 text-white" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold text-white">Clinify</span>
                <span className="text-xs text-white/80">Healthcare Management</span>
            </div>
        </div>
    );
}
