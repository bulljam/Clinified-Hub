import ECG from '@/components/ECG';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Login, PersonAdd } from '@mui/icons-material';
import {
    Activity,
    ArrowRight,
    Baby,
    Bone,
    Brain,
    Calendar,
    CheckCircle,
    ChevronUp,
    Clock,
    Eye,
    Heart,
    LogOut,
    Menu,
    Phone,
    Shield,
    Star,
    Stethoscope,
    UserCheck,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const CountUpAnimation = ({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) => {
    const [count, setCount] = useState(0);
    const countRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 },
        );

        if (countRef.current) {
            observer.observe(countRef.current);
        }

        return () => observer.disconnect();
    }, [isVisible]);

    useEffect(() => {
        if (!isVisible) return;

        let startTime: number;
        const animate = (currentTime: number) => {
            if (startTime === undefined) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = Math.floor(easeOutQuart * end);

            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [isVisible, end, duration]);

    return (
        <div ref={countRef} className="text-2xl font-bold text-primary">
            {count}
            {suffix}
        </div>
    );
};

const AnimatedHeartRate = ({ bpm }: { bpm: number }) => {
    return <div className="text-lg font-semibold text-primary transition-all duration-500">{bpm} BPM</div>;
};

const FloatingCard = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
    return (
        <div
            className="transform transition-all duration-1000 hover:scale-105"
            style={{
                animation: `float 6s ease-in-out infinite ${delay}s, fadeIn 1s ease-out ${delay}s both`,
            }}
        >
            {children}
        </div>
    );
};

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [isVisible, setIsVisible] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [bpm, setBpm] = useState(72);
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                }
            });
        }, observerOptions);

        const animateElements = document.querySelectorAll('.animate-on-scroll');
        animateElements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setBpm((prev) => {
                const variation = Math.floor(Math.random() * 6) - 3;
                const newBpm = prev + variation;
                return Math.max(68, Math.min(78, newBpm));
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted/20">
            <nav className="fixed top-0 right-0 left-0 z-50 bg-background/80 pt-3 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <Link href="/" className="flex items-center space-x-3">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                <Stethoscope className="size-5 text-white" />
                            </div>
                            <div>
                                <span className="text-lg font-bold text-foreground">Clinified Hub</span>
                            </div>
                        </Link>

                        <div className="hidden items-center space-x-4 md:flex">
                            {auth?.user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="flex items-center space-x-2 hover:bg-indigo-500/10 hover:text-indigo-600">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={auth.user.avatar || auth.user.photo} alt={auth.user.name} />
                                                <AvatarFallback className="!bg-slate-600 text-white">
                                                    {auth.user.name
                                                        .split(' ')
                                                        .map((n) => n[0])
                                                        .join('')
                                                        .substring(0, 2)
                                                        .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{auth.user.name}</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href="/dashboard"
                                                className="flex items-center hover:bg-indigo-500/10 hover:text-indigo-600 focus:bg-indigo-500/10 focus:text-indigo-600"
                                            >
                                                <Activity className="mr-2 h-4 w-4" />
                                                Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href="/logout"
                                                method="post"
                                                className="flex w-full items-center text-red-600 hover:bg-red-500/10 hover:text-red-700 focus:bg-red-500/10 focus:text-red-700"
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Log Out
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <Button variant="ghost" className="text-foreground hover:text-primary">
                                            <Login className="mr-2 h-4 w-4" />
                                            Login
                                        </Button>
                                    </Link>
                                    <Link href="/doctor-application">
                                        <Button className="bg-primary hover:bg-primary/90">
                                            <PersonAdd className="mr-2 h-4 w-4" />
                                            Join as a Doctor
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>

                        <div className="md:hidden">
                            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </Button>
                        </div>
                    </div>

                    {mobileMenuOpen && (
                        <div className="bg-background md:hidden">
                            <div className="space-y-1 px-2 pt-2 pb-3">
                                {auth?.user ? (
                                    <>
                                        <div className="mb-2 flex items-center space-x-3 rounded-lg bg-muted/50 p-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={auth.user.avatar || auth.user.photo} alt={auth.user.name} />
                                                <AvatarFallback className="!bg-slate-600 text-white">
                                                    {auth.user.name
                                                        .split(' ')
                                                        .map((n) => n[0])
                                                        .join('')
                                                        .substring(0, 2)
                                                        .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-semibold">{auth.user.name}</div>
                                                <div className="text-sm text-muted-foreground">{auth.user.email}</div>
                                            </div>
                                        </div>
                                        <Link href="/dashboard" className="block">
                                            <Button variant="ghost" className="w-full justify-start hover:bg-indigo-500/10 hover:text-indigo-600">
                                                <Activity className="mr-2 h-4 w-4" />
                                                Dashboard
                                            </Button>
                                        </Link>
                                        <Link href="/logout" method="post" className="block">
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start text-red-600 hover:bg-indigo-500/10 hover:text-red-700"
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Log Out
                                            </Button>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" className="block">
                                            <Button variant="ghost" className="w-full justify-start">
                                                <Login className="mr-2 h-4 w-4" />
                                                Login
                                            </Button>
                                        </Link>
                                        <Link href="/register" className="block">
                                            <Button className="w-full bg-primary hover:bg-primary/90">
                                                <PersonAdd className="mr-2 h-4 w-4" />
                                                Join as a Doctor
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes fadeIn {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInUp {
                    0% { opacity: 0; transform: translateY(30px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInLeft {
                    0% { opacity: 0; transform: translateX(-30px); }
                    100% { opacity: 1; transform: translateX(0); }
                }
                @keyframes fadeInRight {
                    0% { opacity: 0; transform: translateX(30px); }
                    100% { opacity: 1; transform: translateX(0); }
                }
                @keyframes scaleIn {
                    0% { opacity: 0; transform: scale(0.8); }
                    100% { opacity: 1; transform: scale(1); }
                }
                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 0 20px rgba(92, 107, 192, 0.3); }
                    50% { box-shadow: 0 0 40px rgba(92, 107, 192, 0.6); }
                }
                @keyframes bounce-gentle {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-5px); }
                }
                @keyframes back-to-top-bounce {
                    0%, 100% { transform: translateY(0px) scale(1); }
                    50% { transform: translateY(-3px) scale(1.05); }
                }
                @keyframes float-cloud-1 {
                    0%, 100% { transform: translateX(0px) translateY(0px) scale(1); }
                    25% { transform: translateX(10px) translateY(-5px) scale(1.05); }
                    50% { transform: translateX(-5px) translateY(-10px) scale(0.98); }
                    75% { transform: translateX(8px) translateY(-3px) scale(1.02); }
                }
                @keyframes float-cloud-2 {
                    0%, 100% { transform: translateX(0px) translateY(0px) scale(1); }
                    33% { transform: translateX(-8px) translateY(-8px) scale(1.03); }
                    66% { transform: translateX(12px) translateY(-4px) scale(0.97); }
                }
                @keyframes float-cloud-3 {
                    0%, 100% { transform: translateX(0px) translateY(0px) scale(1); }
                    20% { transform: translateX(6px) translateY(-6px) scale(1.04); }
                    40% { transform: translateX(-10px) translateY(-2px) scale(0.96); }
                    60% { transform: translateX(4px) translateY(-8px) scale(1.01); }
                    80% { transform: translateX(-3px) translateY(-4px) scale(0.99); }
                }
                @keyframes float-cloud-4 {
                    0%, 100% { transform: translateX(0px) translateY(0px) scale(1); }
                    50% { transform: translateX(-6px) translateY(-12px) scale(1.06); }
                }
                @keyframes float-circle-1 {
                    0%, 100% { transform: translateX(0px) translateY(0px) scale(1); }
                    25% { transform: translateX(15px) translateY(-20px) scale(1.1); }
                    50% { transform: translateX(-10px) translateY(-35px) scale(0.9); }
                    75% { transform: translateX(20px) translateY(-15px) scale(1.05); }
                }
                @keyframes float-circle-2 {
                    0%, 100% { transform: translateX(0px) translateY(0px) scale(1); }
                    33% { transform: translateX(-25px) translateY(15px) scale(1.2); }
                    66% { transform: translateX(10px) translateY(-25px) scale(0.8); }
                }
                @keyframes float-circle-3 {
                    0%, 100% { transform: translateX(0px) translateY(0px) scale(1); }
                    20% { transform: translateX(12px) translateY(8px) scale(1.15); }
                    40% { transform: translateX(-18px) translateY(-12px) scale(0.85); }
                    60% { transform: translateX(25px) translateY(5px) scale(1.08); }
                    80% { transform: translateX(-8px) translateY(-20px) scale(0.95); }
                }
                @keyframes float-circle-4 {
                    0%, 100% { transform: translateX(0px) translateY(0px) scale(1); }
                    50% { transform: translateX(-30px) translateY(-18px) scale(1.3); }
                }
                @keyframes float-circle-5 {
                    0%, 100% { transform: translateX(0px) translateY(0px) scale(1); }
                    25% { transform: translateX(-15px) translateY(-10px) scale(0.9); }
                    50% { transform: translateX(20px) translateY(25px) scale(1.1); }
                    75% { transform: translateX(5px) translateY(-30px) scale(1.05); }
                }
                @keyframes float-circle-6 {
                    0%, 100% { transform: translateX(0px) translateY(0px) scale(1); }
                    40% { transform: translateX(18px) translateY(-22px) scale(1.2); }
                    80% { transform: translateX(-12px) translateY(15px) scale(0.85); }
                }
                @keyframes float-circle-7 {
                    0%, 100% { transform: translateX(0px) translateY(0px) scale(1); }
                    30% { transform: translateX(-10px) translateY(-15px) scale(1.4); }
                    70% { transform: translateX(22px) translateY(8px) scale(0.7); }
                }
                @keyframes float-circle-8 {
                    0%, 100% { transform: translateX(0px) translateY(0px) scale(1); }
                    25% { transform: translateX(8px) translateY(-25px) scale(1.1); }
                    50% { transform: translateX(-20px) translateY(-10px) scale(0.9); }
                    75% { transform: translateX(15px) translateY(-35px) scale(1.15); }
                }
                .pulse-glow {
                    animation: pulse-glow 2s ease-in-out infinite;
                }
                .animate-on-scroll {
                    opacity: 0;
                    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                .animate-on-scroll.animate-fade-in-up {
                    animation: fadeInUp 0.8s ease-out forwards;
                }
                .animate-on-scroll.animate-fade-in-left {
                    animation: fadeInLeft 0.8s ease-out forwards;
                }
                .animate-on-scroll.animate-fade-in-right {
                    animation: fadeInRight 0.8s ease-out forwards;
                }
                .animate-on-scroll.animate-scale-in {
                    animation: scaleIn 0.8s ease-out forwards;
                }
                .hover-lift {
                    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                .hover-lift:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                }
                .back-to-top-btn {
                    animation: back-to-top-bounce 2s ease-in-out infinite;
                }
            `}</style>

            <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-24">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div
                        className="absolute top-20 left-10 animate-bounce text-indigo-200/20"
                        style={{ animationDelay: '0s', animationDuration: '4s' }}
                    >
                        <Stethoscope className="h-12 w-12" />
                    </div>
                    <div
                        className="absolute top-40 right-20 animate-bounce text-indigo-200/20"
                        style={{ animationDelay: '1s', animationDuration: '5s' }}
                    >
                        <Heart className="h-10 w-10" />
                    </div>
                    <div
                        className="absolute bottom-40 left-20 animate-bounce text-indigo-300/20"
                        style={{ animationDelay: '2s', animationDuration: '6s' }}
                    >
                        <Activity className="h-14 w-14" />
                    </div>
                    <div
                        className="absolute top-1/3 left-1/4 animate-bounce text-indigo-300/15"
                        style={{ animationDelay: '0.5s', animationDuration: '4.5s' }}
                    >
                        <Shield className="h-8 w-8" />
                    </div>
                    <div
                        className="absolute right-1/4 bottom-20 animate-bounce text-indigo-200/25"
                        style={{ animationDelay: '1.5s', animationDuration: '5.5s' }}
                    >
                        <Calendar className="h-11 w-11" />
                    </div>
                    <div
                        className="absolute top-1/2 right-10 animate-bounce text-indigo-200/20"
                        style={{ animationDelay: '3s', animationDuration: '4.2s' }}
                    >
                        <CheckCircle className="h-9 w-9" />
                    </div>

                    <div className="absolute top-32 right-1/3 h-16 w-16 opacity-5">
                        <div className="absolute top-1/2 left-0 h-2 w-full -translate-y-1/2 transform bg-indigo-400"></div>
                        <div className="absolute top-0 left-1/2 h-full w-2 -translate-x-1/2 transform bg-indigo-400"></div>
                    </div>
                    <div className="absolute bottom-1/3 left-1/3 h-12 w-12 opacity-5">
                        <div className="absolute top-1/2 left-0 h-1.5 w-full -translate-y-1/2 transform bg-indigo-400"></div>
                        <div className="absolute top-0 left-1/2 h-full w-1.5 -translate-x-1/2 transform bg-indigo-400"></div>
                    </div>

                    <div className="absolute top-16 left-1/2 h-40 w-1 opacity-10">
                        <div className="h-full w-full rotate-12 transform animate-pulse bg-gradient-to-b from-indigo-400 via-indigo-500 to-indigo-400"></div>
                        <div
                            className="absolute top-0 left-2 h-4 w-4 animate-pulse rounded-full bg-indigo-400"
                            style={{ animationDelay: '0s' }}
                        ></div>
                        <div
                            className="absolute top-8 -left-1 h-3 w-3 animate-pulse rounded-full bg-indigo-500"
                            style={{ animationDelay: '0.5s' }}
                        ></div>
                        <div
                            className="absolute top-16 left-2 h-4 w-4 animate-pulse rounded-full bg-indigo-400"
                            style={{ animationDelay: '1s' }}
                        ></div>
                        <div
                            className="absolute top-24 -left-1 h-3 w-3 animate-pulse rounded-full bg-indigo-500"
                            style={{ animationDelay: '1.5s' }}
                        ></div>
                        <div
                            className="absolute top-32 left-2 h-4 w-4 animate-pulse rounded-full bg-indigo-400"
                            style={{ animationDelay: '2s' }}
                        ></div>
                    </div>

                    <div className="absolute right-16 bottom-32 rotate-45 transform">
                        <div className="h-8 w-16 animate-pulse rounded-full bg-gradient-to-r from-indigo-300/20 to-indigo-400/20"></div>
                    </div>
                    <div className="absolute top-2/3 left-16 -rotate-12 transform">
                        <div
                            className="h-6 w-12 animate-pulse rounded-full bg-gradient-to-r from-indigo-300/15 to-indigo-400/15"
                            style={{ animationDelay: '1s' }}
                        ></div>
                    </div>
                    <div
                        className="absolute top-48 left-16 h-32 w-32 rounded-full bg-indigo-400/4"
                        style={{
                            filter: 'blur(15px)',
                            animation: 'float-circle-1 12s ease-in-out infinite',
                        }}
                    />
                    <div
                        className="absolute top-72 right-20 h-28 w-28 rounded-full bg-indigo-300/5"
                        style={{
                            filter: 'blur(12px)',
                            animation: 'float-circle-2 15s ease-in-out infinite',
                        }}
                    />
                    <div
                        className="absolute bottom-32 left-32 h-40 w-40 rounded-full bg-indigo-400/3"
                        style={{
                            filter: 'blur(20px)',
                            animation: 'float-circle-3 18s ease-in-out infinite',
                        }}
                    />
                    <div
                        className="absolute top-1/2 right-12 h-24 w-24 rounded-full bg-indigo-300/6"
                        style={{
                            filter: 'blur(10px)',
                            animation: 'float-circle-4 10s ease-in-out infinite',
                        }}
                    />
                    <div
                        className="absolute right-40 bottom-20 h-36 w-36 rounded-full bg-indigo-400/4"
                        style={{
                            filter: 'blur(18px)',
                            animation: 'float-circle-5 20s ease-in-out infinite',
                        }}
                    />
                    <div
                        className="absolute top-3/4 left-1/2 h-30 w-30 rounded-full bg-indigo-200/5"
                        style={{
                            filter: 'blur(14px)',
                            animation: 'float-circle-6 14s ease-in-out infinite',
                        }}
                    />
                    <div
                        className="absolute bottom-1/4 left-20 h-20 w-20 rounded-full bg-indigo-200/7"
                        style={{
                            filter: 'blur(8px)',
                            animation: 'float-circle-7 16s ease-in-out infinite',
                        }}
                    />
                    <div
                        className="absolute top-2/3 right-1/3 h-44 w-44 rounded-full bg-indigo-100/3"
                        style={{
                            filter: 'blur(25px)',
                            animation: 'float-circle-8 22s ease-in-out infinite',
                        }}
                    />
                </div>

                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-20 left-20 h-32 w-32 rounded-full border border-primary/20"></div>
                    <div className="absolute top-40 right-20 h-24 w-24 rounded-full border border-primary/20"></div>
                    <div className="absolute bottom-40 left-40 h-20 w-20 rounded-full border border-primary/20"></div>
                    <div className="absolute right-40 bottom-20 h-28 w-28 rounded-full border border-primary/20"></div>
                </div>

                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div
                        className="absolute -top-32 -left-32 h-96 w-96 opacity-5"
                        style={{
                            background: `radial-gradient(ellipse 400px 200px at center, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 30%, transparent 70%)`,
                            filter: 'blur(2px)',
                            animation: 'float-cloud-1 20s ease-in-out infinite',
                        }}
                    />
                    <div
                        className="absolute top-20 -right-40 h-64 w-80 opacity-4"
                        style={{
                            background: `radial-gradient(ellipse 350px 180px at center, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 80%)`,
                            filter: 'blur(3px)',
                            animation: 'float-cloud-2 25s ease-in-out infinite',
                        }}
                    />
                    <div
                        className="absolute bottom-10 left-20 h-48 w-72 opacity-6"
                        style={{
                            background: `radial-gradient(ellipse 300px 150px at center, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.08) 50%, transparent 90%)`,
                            filter: 'blur(4px)',
                            animation: 'float-cloud-3 30s ease-in-out infinite',
                        }}
                    />
                    <div
                        className="absolute top-1/3 left-1/2 h-40 w-64 opacity-3"
                        style={{
                            background: `radial-gradient(ellipse 280px 120px at center, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 60%, transparent 90%)`,
                            filter: 'blur(5px)',
                            animation: 'float-cloud-4 18s ease-in-out infinite',
                        }}
                    />

                    <div
                        className="absolute inset-0 opacity-3"
                        style={{
                            background: `
                                linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.02) 40%, rgba(255, 255, 255, 0.04) 60%, transparent 100%),
                                radial-gradient(ellipse 80% 60% at 50% 80%, rgba(255, 255, 255, 0.02) 0%, transparent 70%)
                            `,
                            filter: 'blur(1px)',
                        }}
                    />
                </div>

                <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
                    <div
                        className={`transform space-y-8 transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}
                    >
                        <div className="space-y-4">
                            <h2 className="text-5xl leading-tight font-bold text-foreground lg:text-6xl">
                                Healthcare
                                <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent"> Simplified</span>
                            </h2>
                            <p className="max-w-lg text-xl leading-relaxed text-muted-foreground">
                                Streamline your medical practice with our comprehensive appointment scheduling system. Connect patients with
                                healthcare providers seamlessly.
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <Link href="/register">
                                <Button
                                    size="lg"
                                    className="group relative transform overflow-hidden rounded-full border-0 bg-gradient-to-r from-primary via-indigo-600 to-indigo-700 px-12 py-6 text-xl font-bold text-white shadow-2xl transition-all duration-500 hover:scale-105 hover:from-primary/90 hover:via-indigo-600/90 hover:to-indigo-700/90 hover:shadow-indigo-500/25"
                                >
                                    <span className="relative z-10 flex items-center">
                                        <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                                            <Stethoscope className="h-4 w-4 text-white" />
                                        </div>
                                        Get Started Today
                                        <ArrowRight className="ml-4 h-6 w-6 transition-transform duration-300 group-hover:translate-x-2" />
                                    </span>
                                    <div className="absolute inset-0 -translate-x-full -skew-x-12 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transition-transform duration-1000 group-hover:translate-x-full"></div>
                                </Button>
                            </Link>
                        </div>

                        <div className="grid gap-4 pt-8 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="flex items-center space-x-3 rounded-lg border border-primary/10 bg-card/50 p-4 backdrop-blur-sm">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                                    <Calendar className="h-5 w-5 text-indigo-500" />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold">Smart Scheduling</div>
                                    <div className="text-xs text-muted-foreground">User-friendly</div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 rounded-lg border border-primary/10 bg-card/50 p-4 backdrop-blur-sm">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                                    <Shield className="h-5 w-5 text-green-500" />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold">Secure & Compliant</div>
                                    <div className="text-xs text-muted-foreground">HIPAA-compliant</div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 rounded-lg border border-primary/10 bg-card/50 p-4 backdrop-blur-sm">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                                    <Clock className="h-5 w-5 text-purple-500" />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold">Real-time Updates</div>
                                    <div className="text-xs text-muted-foreground">Instant alerts</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-8 pt-6">
                            <div className="text-center">
                                <CountUpAnimation end={30} suffix="+" />
                                <div className="text-sm text-muted-foreground">Healthcare Providers</div>
                            </div>
                            <div className="text-center">
                                <CountUpAnimation end={1000} suffix="+" duration={2500} />
                                <div className="text-sm text-muted-foreground">Appointments Scheduled</div>
                            </div>
                            <div className="text-center">
                                <CountUpAnimation end={99.9} suffix="%" duration={3000} />
                                <div className="text-sm text-muted-foreground">Uptime</div>
                            </div>
                        </div>
                    </div>

                    <div
                        className={`relative transform transition-all delay-300 duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}
                    >
                        <div className="relative rounded-2xl border bg-card p-8 shadow-2xl">
                            <div className="absolute top-4 left-4 flex space-x-2">
                                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                            </div>

                            <div className="mt-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">Patient Monitoring</h3>
                                    <Activity className="h-5 w-5 text-green-500" />
                                </div>

                                <ECG height={120} speed={1.2} bpm={bpm} className="rounded-md" />

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Heart Rate</span>
                                        <AnimatedHeartRate bpm={bpm} />
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Status</span>
                                        <div className="text-lg font-semibold text-green-600">Normal</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative overflow-hidden bg-white px-4 py-20">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-10 left-1/4 animate-spin text-indigo-100/30" style={{ animationDuration: '20s' }}>
                        <div className="relative h-20 w-20">
                            <div className="absolute top-1/2 left-0 h-1 w-full -translate-y-1/2 transform bg-current"></div>
                            <div className="absolute top-0 left-1/2 h-full w-1 -translate-x-1/2 transform bg-current"></div>
                            <div className="absolute top-1/2 left-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 transform rounded-full border-2 border-current"></div>
                        </div>
                    </div>

                    <div className="absolute top-1/3 right-10 h-2 w-40 opacity-10">
                        <svg className="h-full w-full" viewBox="0 0 160 8">
                            <path
                                d="M0,4 L20,4 L25,1 L30,7 L35,4 L55,4 L60,1 L65,7 L70,4 L90,4 L95,1 L100,7 L105,4 L125,4 L130,1 L135,7 L140,4 L160,4"
                                stroke="currentColor"
                                strokeWidth="1"
                                fill="none"
                                className="text-indigo-300/20"
                            />
                        </svg>
                    </div>

                    <div className="absolute bottom-20 left-10 opacity-10">
                        <div className="relative h-24 w-24">
                            <div className="absolute top-0 left-1/2 h-3 w-3 -translate-x-1/2 transform rounded-full bg-indigo-400"></div>
                            <div className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 transform rounded-full bg-indigo-400"></div>
                            <div className="absolute top-1/2 left-0 h-3 w-3 -translate-y-1/2 transform rounded-full bg-indigo-400"></div>
                            <div className="absolute top-1/2 right-0 h-3 w-3 -translate-y-1/2 transform rounded-full bg-indigo-400"></div>
                            <div className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-indigo-500"></div>
                            <div className="absolute top-1/4 left-1/4 h-6 w-0.5 rotate-45 transform bg-indigo-400"></div>
                            <div className="absolute top-1/4 right-1/4 h-6 w-0.5 -rotate-45 transform bg-indigo-400"></div>
                            <div className="absolute bottom-1/4 left-1/4 h-6 w-0.5 -rotate-45 transform bg-indigo-400"></div>
                            <div className="absolute right-1/4 bottom-1/4 h-6 w-0.5 rotate-45 transform bg-indigo-400"></div>
                        </div>
                    </div>

                    <div className="absolute top-1/2 right-1/4 rotate-12 transform animate-pulse">
                        <div className="h-16 w-8 rounded-full bg-gradient-to-b from-indigo-200/20 to-indigo-300/20"></div>
                    </div>
                    <div className="absolute right-1/3 bottom-1/3 -rotate-45 transform animate-pulse" style={{ animationDelay: '1s' }}>
                        <div className="h-12 w-6 rounded-full bg-gradient-to-b from-indigo-200/15 to-indigo-300/15"></div>
                    </div>
                </div>

                <div className="relative z-10 mx-auto max-w-7xl">
                    <div className="animate-on-scroll mb-16 text-center">
                        <h3 className="mb-4 text-4xl font-bold">Medical Specialties</h3>
                        <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
                            Connect with healthcare professionals across all major medical specialties through our comprehensive platform.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <FloatingCard delay={0.1}>
                            <Card className="hover-lift group animate-on-scroll h-full cursor-pointer border-0 bg-gradient-to-br from-red-50 to-red-100 transition-all duration-500 hover:shadow-xl">
                                <CardHeader className="text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12">
                                        <Heart className="h-8 w-8 text-white group-hover:animate-pulse" />
                                    </div>
                                    <CardTitle className="text-xl transition-colors duration-300 group-hover:text-red-600">Cardiology</CardTitle>
                                    <CardDescription>Heart and cardiovascular system specialists for comprehensive cardiac care.</CardDescription>
                                </CardHeader>
                            </Card>
                        </FloatingCard>

                        <FloatingCard delay={0.2}>
                            <Card className="hover-lift group animate-on-scroll h-full cursor-pointer border-0 bg-gradient-to-br from-purple-50 to-purple-100 transition-all duration-500 hover:shadow-xl">
                                <CardHeader className="text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-500 transition-all duration-500 group-hover:scale-125 group-hover:-rotate-12">
                                        <Brain className="h-8 w-8 text-white group-hover:animate-bounce" />
                                    </div>
                                    <CardTitle className="text-xl transition-colors duration-300 group-hover:text-purple-600">Neurology</CardTitle>
                                    <CardDescription>Brain and nervous system experts for neurological conditions and disorders.</CardDescription>
                                </CardHeader>
                            </Card>
                        </FloatingCard>

                        <FloatingCard delay={0.3}>
                            <Card className="group h-full cursor-pointer border-0 bg-gradient-to-br from-blue-50 to-blue-100 transition-all duration-300 hover:shadow-xl">
                                <CardHeader className="text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 transition-transform group-hover:scale-110">
                                        <Eye className="h-8 w-8 text-white" />
                                    </div>
                                    <CardTitle className="text-xl">Ophthalmology</CardTitle>
                                    <CardDescription>Eye care specialists for vision problems and eye-related conditions.</CardDescription>
                                </CardHeader>
                            </Card>
                        </FloatingCard>

                        <FloatingCard delay={0.4}>
                            <Card className="group h-full cursor-pointer border-0 bg-gradient-to-br from-pink-50 to-pink-100 transition-all duration-300 hover:shadow-xl">
                                <CardHeader className="text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-500 transition-transform group-hover:scale-110">
                                        <Baby className="h-8 w-8 text-white" />
                                    </div>
                                    <CardTitle className="text-xl">Pediatrics</CardTitle>
                                    <CardDescription>Specialized healthcare for infants, children, and adolescents.</CardDescription>
                                </CardHeader>
                            </Card>
                        </FloatingCard>

                        <FloatingCard delay={0.5}>
                            <Card className="group h-full cursor-pointer border-0 bg-gradient-to-br from-orange-50 to-orange-100 transition-all duration-300 hover:shadow-xl">
                                <CardHeader className="text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 transition-transform group-hover:scale-110">
                                        <Bone className="h-8 w-8 text-white" />
                                    </div>
                                    <CardTitle className="text-xl">Orthopedics</CardTitle>
                                    <CardDescription>Musculoskeletal system specialists for bone, joint, and muscle care.</CardDescription>
                                </CardHeader>
                            </Card>
                        </FloatingCard>

                        <FloatingCard delay={0.6}>
                            <Card className="group h-full cursor-pointer border-0 bg-gradient-to-br from-green-50 to-green-100 transition-all duration-300 hover:shadow-xl">
                                <CardHeader className="text-center">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 transition-transform group-hover:scale-110">
                                        <Stethoscope className="h-8 w-8 text-white" />
                                    </div>
                                    <CardTitle className="text-xl">General Medicine</CardTitle>
                                    <CardDescription>Primary care physicians for general health and preventive medicine.</CardDescription>
                                </CardHeader>
                            </Card>
                        </FloatingCard>
                    </div>
                </div>
            </section>

            <section className="bg-muted/30 px-4 py-20">
                <div className="mx-auto max-w-6xl">
                    <div className="animate-on-scroll mb-16 text-center">
                        <h3 className="mb-4 text-4xl font-bold">What Our Users Say</h3>
                        <p className="text-xl text-muted-foreground">Trusted by healthcare professionals and patients worldwide</p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        <FloatingCard delay={0.1}>
                            <Card className="hover-lift animate-on-scroll group h-full">
                                <CardContent className="pt-6">
                                    <div className="mb-4 flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="h-4 w-4 fill-yellow-400 text-yellow-400 group-hover:animate-pulse"
                                                style={{ animationDelay: `${i * 0.1}s` }}
                                            />
                                        ))}
                                    </div>
                                    <p className="mb-6 text-muted-foreground italic">
                                        "Clinified Hub has revolutionized our practice. The scheduling system is intuitive and my patients love the
                                        convenience."
                                    </p>
                                    <div className="flex items-center">
                                        <img
                                            src="/images/Doctor.jpg"
                                            alt="Dr. Michael Rodriguez"
                                            className="h-12 w-12 rounded-full border-2 border-indigo-200 object-cover"
                                        />
                                        <div className="ml-3">
                                            <div className="font-semibold">Dr. Michael Rodriguez</div>
                                            <div className="text-sm text-muted-foreground">Cardiologist</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </FloatingCard>

                        <FloatingCard delay={0.2}>
                            <Card className="h-full">
                                <CardContent className="pt-6">
                                    <div className="mb-4 flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="mb-6 text-muted-foreground italic">
                                        "As a patient, I love being able to book appointments online and receive timely reminders. It's so
                                        convenient!"
                                    </p>
                                    <div className="flex items-center">
                                        <img
                                            src="/images/Patient.jpg"
                                            alt="James Thompson"
                                            className="h-12 w-12 rounded-full border-2 border-green-200 object-cover"
                                        />
                                        <div className="ml-3">
                                            <div className="font-semibold">James Thompson</div>
                                            <div className="text-sm text-muted-foreground">Patient</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </FloatingCard>

                        <FloatingCard delay={0.3}>
                            <Card className="h-full">
                                <CardContent className="pt-6">
                                    <div className="mb-4 flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="mb-6 text-muted-foreground italic">
                                        "The admin dashboard gives us complete visibility into our operations. It's made managing our clinic so much
                                        easier."
                                    </p>
                                    <div className="flex items-center">
                                        <img
                                            src="/images/Manager.jpg"
                                            alt="Sarah Wilson"
                                            className="h-12 w-12 rounded-full border-2 border-purple-200 object-cover"
                                        />
                                        <div className="ml-3">
                                            <div className="font-semibold">Sarah Wilson</div>
                                            <div className="text-sm text-muted-foreground">Clinic Administrator</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </FloatingCard>
                    </div>
                </div>
            </section>

            <section className="relative overflow-hidden bg-gradient-to-br from-indigo-400 via-indigo-500 to-indigo-600 px-4 py-20">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-10 left-10 animate-bounce text-white/10" style={{ animationDelay: '0s', animationDuration: '3s' }}>
                        <Stethoscope className="h-16 w-16" />
                    </div>
                    <div
                        className="absolute right-10 bottom-10 animate-bounce text-white/10"
                        style={{ animationDelay: '1s', animationDuration: '4s' }}
                    >
                        <UserCheck className="h-14 w-14" />
                    </div>
                    <div className="absolute top-1/3 right-20 animate-bounce text-white/8" style={{ animationDelay: '2s', animationDuration: '5s' }}>
                        <Activity className="h-12 w-12" />
                    </div>
                    <div
                        className="absolute bottom-1/3 left-20 animate-bounce text-white/8"
                        style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}
                    >
                        <Shield className="h-10 w-10" />
                    </div>

                    <div className="absolute top-20 right-1/4 h-12 w-12 opacity-10">
                        <div className="absolute top-1/2 left-0 h-1.5 w-full -translate-y-1/2 transform bg-white"></div>
                        <div className="absolute top-0 left-1/2 h-full w-1.5 -translate-x-1/2 transform bg-white"></div>
                    </div>
                    <div className="absolute bottom-20 left-1/4 h-8 w-8 opacity-10">
                        <div className="absolute top-1/2 left-0 h-1 w-full -translate-y-1/2 transform bg-white"></div>
                        <div className="absolute top-0 left-1/2 h-full w-1 -translate-x-1/2 transform bg-white"></div>
                    </div>

                    <div className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 transform opacity-10">
                        <svg className="h-full w-full" viewBox="0 0 400 2">
                            <path
                                d="M0,1 L50,1 L60,0 L70,2 L80,1 L120,1 L130,0 L140,2 L150,1 L200,1 L210,0 L220,2 L230,1 L280,1 L290,0 L300,2 L310,1 L400,1"
                                stroke="white"
                                strokeWidth="0.5"
                                fill="none"
                                className="animate-pulse"
                            />
                        </svg>
                    </div>
                </div>

                <div className="relative z-10 mx-auto max-w-4xl text-center">
                    <div className="animate-on-scroll rounded-3xl border border-white/30 bg-white/95 p-12 text-gray-800 shadow-2xl backdrop-blur-md">
                        <h3 className="mb-4 text-4xl font-bold text-indigo-700">Ready to Transform Your Healthcare Practice?</h3>
                        <p className="mb-8 text-xl text-gray-600">
                            Join thousands of healthcare providers who trust Clinified Hub for their appointment management needs.
                        </p>
                        <div className="flex justify-center">
                            <Link href="/register">
                                <Button
                                    size="lg"
                                    className="group bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:bg-indigo-700 hover:shadow-2xl"
                                >
                                    Discover Now
                                    <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="border-t bg-muted/10 px-4 py-12">
                <div className="mx-auto max-w-6xl">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        <div className="lg:col-span-2">
                            <div className="mb-4 flex items-center space-x-2">
                                <Stethoscope className="h-8 w-8 text-primary" />
                                <span className="text-xl font-bold">Clinified Hub</span>
                            </div>
                            <p className="mb-6 text-sm text-muted-foreground">Modern healthcare management for the digital age.</p>
                            <div className="space-y-3 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4 text-primary" />
                                    <span>+1 (555) 123-4567</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="mb-4 font-semibold">Contact Info</h4>
                            <div className="space-y-3 text-sm text-muted-foreground">
                                <div>
                                    <span className="block">Email:</span>
                                    <span>contact@clinifiedhub.com</span>
                                </div>
                                <div>
                                    <span className="block">Address:</span>
                                    <span>
                                        123 Healthcare St,
                                        <br />
                                        Medical District,
                                        <br />
                                        NY 10001
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="mb-4 font-semibold">Working Hours</h4>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex justify-between">
                                    <span>Monday - Friday:</span>
                                    <span>9:00 AM - 6:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Saturday:</span>
                                    <span>10:00 AM - 4:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Sunday:</span>
                                    <span>Closed</span>
                                </div>
                                <div className="mt-4 rounded-lg bg-primary/10 p-3">
                                    <span className="text-xs font-medium text-primary">24/7 Emergency Support Available</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
                        <p>&copy; 2025 Clinified Hub. All rights reserved.</p>
                        <div className="relative mt-6">
                            <div className="flex items-center justify-center">
                                <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                                <div className="group relative mx-4 cursor-pointer">
                                    <div className="rounded-full border border-primary/20 bg-gradient-to-r from-primary/10 to-indigo-500/10 px-6 py-3 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:border-primary/40">
                                        <div className="flex items-center space-x-2">
                                            <div className="h-2 w-2 animate-pulse rounded-full bg-gradient-to-r from-primary to-indigo-500"></div>
                                            <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-xs font-medium text-transparent transition-all duration-300 group-hover:from-primary/80 group-hover:to-indigo-600/80">
                                                Made by Aymane Bouljam
                                            </span>
                                            <div
                                                className="h-2 w-2 animate-pulse rounded-full bg-gradient-to-r from-indigo-500 to-primary"
                                                style={{ animationDelay: '0.5s' }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/20 to-indigo-500/20 opacity-0 blur transition-opacity duration-500 group-hover:opacity-100"></div>
                                </div>
                                <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {showBackToTop && (
                <button
                    onClick={scrollToTop}
                    className={`back-to-top-btn group fixed right-8 bottom-8 z-50 rounded-full bg-gradient-to-r from-primary to-indigo-600 p-4 text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-indigo-500/25`}
                    aria-label="Back to top"
                >
                    <ChevronUp className="h-6 w-6 transition-transform duration-300 group-hover:-translate-y-1" />
                </button>
            )}
        </div>
    );
}
