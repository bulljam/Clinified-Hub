import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import ECG from '@/components/ECG';
import { 
    Calendar, 
    Stethoscope, 
    Shield, 
    Clock, 
    Users, 
    Heart, 
    CheckCircle, 
    Star,
    ArrowRight,
    Activity,
    UserCheck,
    CalendarCheck,
    Phone,
    Menu,
    X,
    Brain,
    Eye,
    Baby,
    Bone,
    Pill,
    Zap,
    ChevronUp
} from 'lucide-react';
import { Login, PersonAdd } from '@mui/icons-material';
import { useState, useEffect, useRef } from 'react';


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
            { threshold: 0.1 }
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
            {count}{suffix}
        </div>
    );
};

const AnimatedHeartRate = ({ bpm }: { bpm: number }) => {
    return (
        <div className="text-lg font-semibold text-primary transition-all duration-500">
            {bpm} BPM
        </div>
    );
};

const FloatingCard = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
    return (
        <div 
            className="transform transition-all duration-1000 hover:scale-105"
            style={{
                animation: `float 6s ease-in-out infinite ${delay}s, fadeIn 1s ease-out ${delay}s both`
            }}
        >
            {children}
        </div>
    );
};

export default function Welcome() {
    const [isVisible, setIsVisible] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [bpm, setBpm] = useState(72);
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Back to top functionality
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
            behavior: 'smooth'
        });
    };

    // Scroll animations
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
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
            setBpm(prev => {
                const variation = Math.floor(Math.random() * 6) - 3;
                const newBpm = prev + variation;
                return Math.max(68, Math.min(78, newBpm));
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted/20">
            {/* Top Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md pt-3">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-3">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                <Stethoscope className="size-5 text-white" />
                            </div>
                            <div>
                                <span className="text-lg font-bold text-foreground">Clinified Hub</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Link href="/login">
                                <Button variant="ghost" className="text-foreground hover:text-primary">
                                    <Login className="h-4 w-4 mr-2" />
                                    Login
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button className="bg-primary hover:bg-primary/90">
                                    <PersonAdd className="h-4 w-4 mr-2" />
                                    Join as a Doctor
                                </Button>
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {mobileMenuOpen && (
                        <div className="md:hidden bg-background">
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                <Link href="/login" className="block">
                                    <Button variant="ghost" className="w-full justify-start">
                                        <Login className="h-4 w-4 mr-2" />
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/register" className="block">
                                    <Button className="w-full bg-primary hover:bg-primary/90">
                                        <PersonAdd className="h-4 w-4 mr-2" />
                                        Join as a Doctor
                                    </Button>
                                </Link>
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
                    0%, 100% { box-shadow: 0 0 20px rgba(20, 184, 166, 0.3); }
                    50% { box-shadow: 0 0 40px rgba(20, 184, 166, 0.6); }
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

            {/* Hero Section */}
<section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden pt-24">
                {/* Animated Background Shapes */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Large turquoise floating circles with blur */}
                    <div 
                        className="absolute top-48 left-16 w-32 h-32 bg-teal-400/4 rounded-full"
                        style={{
                            filter: 'blur(15px)',
                            animation: 'float-circle-1 12s ease-in-out infinite'
                        }}
                    />
                    <div 
                        className="absolute top-72 right-20 w-28 h-28 bg-cyan-300/5 rounded-full"
                        style={{
                            filter: 'blur(12px)',
                            animation: 'float-circle-2 15s ease-in-out infinite'
                        }}
                    />
                    <div 
                        className="absolute bottom-32 left-32 w-40 h-40 bg-cyan-400/3 rounded-full"
                        style={{
                            filter: 'blur(20px)',
                            animation: 'float-circle-3 18s ease-in-out infinite'
                        }}
                    />
                    <div 
                        className="absolute top-1/2 right-12 w-24 h-24 bg-teal-300/6 rounded-full"
                        style={{
                            filter: 'blur(10px)',
                            animation: 'float-circle-4 10s ease-in-out infinite'
                        }}
                    />
                    <div 
                        className="absolute bottom-20 right-40 w-36 h-36 bg-cyan-400/4 rounded-full"
                        style={{
                            filter: 'blur(18px)',
                            animation: 'float-circle-5 20s ease-in-out infinite'
                        }}
                    />
                    <div 
                        className="absolute top-3/4 left-1/2 w-30 h-30 bg-teal-200/5 rounded-full"
                        style={{
                            filter: 'blur(14px)',
                            animation: 'float-circle-6 14s ease-in-out infinite'
                        }}
                    />
                    <div 
                        className="absolute bottom-1/4 left-20 w-20 h-20 bg-cyan-200/7 rounded-full"
                        style={{
                            filter: 'blur(8px)',
                            animation: 'float-circle-7 16s ease-in-out infinite'
                        }}
                    />
                    <div 
                        className="absolute top-2/3 right-1/3 w-44 h-44 bg-teal-100/3 rounded-full"
                        style={{
                            filter: 'blur(25px)',
                            animation: 'float-circle-8 22s ease-in-out infinite'
                        }}
                    />
                </div>

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-20 left-20 w-32 h-32 border border-primary/20 rounded-full"></div>
                    <div className="absolute top-40 right-20 w-24 h-24 border border-primary/20 rounded-full"></div>
                    <div className="absolute bottom-40 left-40 w-20 h-20 border border-primary/20 rounded-full"></div>
                    <div className="absolute bottom-20 right-40 w-28 h-28 border border-primary/20 rounded-full"></div>
                </div>

                {/* Fog/Cloud Overlay */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {/* Large floating clouds */}
                    <div 
                        className="absolute -top-32 -left-32 w-96 h-96 opacity-5"
                        style={{
                            background: `radial-gradient(ellipse 400px 200px at center, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 30%, transparent 70%)`,
                            filter: 'blur(2px)',
                            animation: 'float-cloud-1 20s ease-in-out infinite'
                        }}
                    />
                    <div 
                        className="absolute top-20 -right-40 w-80 h-64 opacity-4"
                        style={{
                            background: `radial-gradient(ellipse 350px 180px at center, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 80%)`,
                            filter: 'blur(3px)',
                            animation: 'float-cloud-2 25s ease-in-out infinite'
                        }}
                    />
                    <div 
                        className="absolute bottom-10 left-20 w-72 h-48 opacity-6"
                        style={{
                            background: `radial-gradient(ellipse 300px 150px at center, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.08) 50%, transparent 90%)`,
                            filter: 'blur(4px)',
                            animation: 'float-cloud-3 30s ease-in-out infinite'
                        }}
                    />
                    <div 
                        className="absolute top-1/3 left-1/2 w-64 h-40 opacity-3"
                        style={{
                            background: `radial-gradient(ellipse 280px 120px at center, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 60%, transparent 90%)`,
                            filter: 'blur(5px)',
                            animation: 'float-cloud-4 18s ease-in-out infinite'
                        }}
                    />
                    
                    {/* Subtle fog base layer */}
                    <div 
                        className="absolute inset-0 opacity-3"
                        style={{
                            background: `
                                linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.02) 40%, rgba(255, 255, 255, 0.04) 60%, transparent 100%),
                                radial-gradient(ellipse 80% 60% at 50% 80%, rgba(255, 255, 255, 0.02) 0%, transparent 70%)
                            `,
                            filter: 'blur(1px)'
                        }}
                    />
                </div>

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className={`space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}>

                        <div className="space-y-4">
                            <h2 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                                Healthcare 
                                <span className="bg-gradient-to-r from-primary to-teal-600 bg-clip-text text-transparent"> Simplified</span>
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                                Streamline your medical practice with our comprehensive appointment scheduling system. Connect patients with healthcare providers seamlessly.
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <Link href="/register">
                                <Button 
                                    size="lg" 
                                    className="group relative overflow-hidden bg-gradient-to-r from-primary via-teal-600 to-cyan-600 hover:from-primary/90 hover:via-teal-600/90 hover:to-cyan-600/90 text-white font-bold px-12 py-6 text-xl rounded-full shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 transform hover:scale-105 border-0"
                                >
                                    <span className="relative z-10 flex items-center">
                                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-4">
                                            <Stethoscope className="h-4 w-4 text-white" />
                                        </div>
                                        Get Started Today
                                        <ArrowRight className="ml-4 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                </Button>
                            </Link>
                        </div>

                        {/* App Benefits */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-8">
                            <div className="flex items-center space-x-3 bg-card/50 rounded-lg p-4 backdrop-blur-sm border border-primary/10">
                                <div className="flex items-center justify-center w-10 h-10 bg-teal-500/10 rounded-lg">
                                    <Calendar className="h-5 w-5 text-teal-500" />
                                </div>
                                <div>
                                    <div className="font-semibold text-sm">Smart Scheduling</div>
                                    <div className="text-xs text-muted-foreground">AI-powered</div>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3 bg-card/50 rounded-lg p-4 backdrop-blur-sm border border-primary/10">
                                <div className="flex items-center justify-center w-10 h-10 bg-green-500/10 rounded-lg">
                                    <Shield className="h-5 w-5 text-green-500" />
                                </div>
                                <div>
                                    <div className="font-semibold text-sm">Secure & Compliant</div>
                                    <div className="text-xs text-muted-foreground">HIPAA-compliant</div>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3 bg-card/50 rounded-lg p-4 backdrop-blur-sm border border-primary/10">
                                <div className="flex items-center justify-center w-10 h-10 bg-purple-500/10 rounded-lg">
                                    <Clock className="h-5 w-5 text-purple-500" />
                                </div>
                                <div>
                                    <div className="font-semibold text-sm">Real-time Updates</div>
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

                    {/* Right Content - ECG Animation */}
                    <div className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}>
                        <div className="relative bg-card rounded-2xl border p-8 shadow-2xl">
                            <div className="absolute top-4 left-4 flex space-x-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
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
                        
                        {/* Floating elements */}
                        <FloatingCard delay={0.2}>
                            <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground p-3 rounded-full shadow-lg">
                                <Heart className="h-6 w-6" />
                            </div>
                        </FloatingCard>
                        
                        <FloatingCard delay={0.5}>
                            <div className="absolute -bottom-4 -left-4 bg-green-500 text-white p-3 rounded-full shadow-lg">
                                <CheckCircle className="h-6 w-6" />
                            </div>
                        </FloatingCard>
                    </div>
                </div>
            </section>

            {/* Medical Specialties Section */}
            <section className="py-20 px-4 bg-white dark:bg-gray-950">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 animate-on-scroll">
                        <h3 className="text-4xl font-bold mb-4">Medical Specialties</h3>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Connect with healthcare professionals across all major medical specialties through our comprehensive platform.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FloatingCard delay={0.1}>
                            <Card className="h-full hover:shadow-xl hover-lift transition-all duration-500 border-0 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50 group cursor-pointer animate-on-scroll">
                                <CardHeader className="text-center">
                                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                                        <Heart className="h-8 w-8 text-white group-hover:animate-pulse" />
                                    </div>
                                    <CardTitle className="text-xl group-hover:text-red-600 transition-colors duration-300">Cardiology</CardTitle>
                                    <CardDescription>
                                        Heart and cardiovascular system specialists for comprehensive cardiac care.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </FloatingCard>

                        <FloatingCard delay={0.2}>
                            <Card className="h-full hover:shadow-xl hover-lift transition-all duration-500 border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 group cursor-pointer animate-on-scroll">
                                <CardHeader className="text-center">
                                    <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500">
                                        <Brain className="h-8 w-8 text-white group-hover:animate-bounce" />
                                    </div>
                                    <CardTitle className="text-xl group-hover:text-purple-600 transition-colors duration-300">Neurology</CardTitle>
                                    <CardDescription>
                                        Brain and nervous system experts for neurological conditions and disorders.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </FloatingCard>

                        <FloatingCard delay={0.3}>
                            <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950/50 dark:to-cyan-900/50 group cursor-pointer">
                                <CardHeader className="text-center">
                                    <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                                        <Eye className="h-8 w-8 text-white" />
                                    </div>
                                    <CardTitle className="text-xl">Ophthalmology</CardTitle>
                                    <CardDescription>
                                        Eye care specialists for vision problems and eye-related conditions.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </FloatingCard>

                        <FloatingCard delay={0.4}>
                            <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/50 dark:to-pink-900/50 group cursor-pointer">
                                <CardHeader className="text-center">
                                    <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                                        <Baby className="h-8 w-8 text-white" />
                                    </div>
                                    <CardTitle className="text-xl">Pediatrics</CardTitle>
                                    <CardDescription>
                                        Specialized healthcare for infants, children, and adolescents.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </FloatingCard>

                        <FloatingCard delay={0.5}>
                            <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 group cursor-pointer">
                                <CardHeader className="text-center">
                                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                                        <Bone className="h-8 w-8 text-white" />
                                    </div>
                                    <CardTitle className="text-xl">Orthopedics</CardTitle>
                                    <CardDescription>
                                        Musculoskeletal system specialists for bone, joint, and muscle care.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </FloatingCard>

                        <FloatingCard delay={0.6}>
                            <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 group cursor-pointer">
                                <CardHeader className="text-center">
                                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                                        <Stethoscope className="h-8 w-8 text-white" />
                                    </div>
                                    <CardTitle className="text-xl">General Medicine</CardTitle>
                                    <CardDescription>
                                        Primary care physicians for general health and preventive medicine.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </FloatingCard>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 px-4 bg-muted/30">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16 animate-on-scroll">
                        <h3 className="text-4xl font-bold mb-4">What Our Users Say</h3>
                        <p className="text-xl text-muted-foreground">
                            Trusted by healthcare professionals and patients worldwide
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FloatingCard delay={0.1}>
                            <Card className="h-full hover-lift animate-on-scroll group">
                                <CardContent className="pt-6">
                                    <div className="flex items-center mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400 group-hover:animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                                        ))}
                                    </div>
                                    <p className="text-muted-foreground mb-6 italic">
                                        "Clinified Hub has revolutionized our practice. The scheduling system is intuitive and my patients love the convenience."
                                    </p>
                                    <div className="flex items-center">
                                        <img 
                                            src="/images/Doctor.jpg" 
                                            alt="Dr. Michael Rodriguez"
                                            className="w-12 h-12 rounded-full object-cover border-2 border-teal-200"
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
                                    <div className="flex items-center mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-muted-foreground mb-6 italic">
                                        "As a patient, I love being able to book appointments online and receive timely reminders. It's so convenient!"
                                    </p>
                                    <div className="flex items-center">
                                        <img 
                                            src="/images/Patient.jpg" 
                                            alt="James Thompson"
                                            className="w-12 h-12 rounded-full object-cover border-2 border-green-200"
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
                                    <div className="flex items-center mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-muted-foreground mb-6 italic">
                                        "The admin dashboard gives us complete visibility into our operations. It's made managing our clinic so much easier."
                                    </p>
                                    <div className="flex items-center">
                                        <img 
                                            src="/images/Manager.jpg" 
                                            alt="Sarah Wilson"
                                            className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
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

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gradient-to-br from-teal-500 via-cyan-500 to-turquoise-500">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12 text-white shadow-2xl animate-on-scroll">
                        <h3 className="text-4xl font-bold mb-4">Ready to Transform Your Healthcare Practice?</h3>
                        <p className="text-xl opacity-90 mb-8">
                            Join thousands of healthcare providers who trust Clinified Hub for their appointment management needs.
                        </p>
                        <div className="flex justify-center">
                            <Link href="/register">
                                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold px-8 py-4 text-lg group shadow-xl hover:shadow-2xl transition-all duration-300">
                                    Discover Now
                                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t py-12 px-4 bg-muted/10">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-2">
                            <div className="flex items-center space-x-2 mb-4">
                                <Stethoscope className="h-8 w-8 text-primary" />
                                <span className="text-xl font-bold">Clinified Hub</span>
                            </div>
                            <p className="text-muted-foreground text-sm mb-6">
                                Modern healthcare management for the digital age.
                            </p>
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
                            <h4 className="font-semibold mb-4">Contact Info</h4>
                            <div className="space-y-3 text-sm text-muted-foreground">
                                <div>
                                    <span className="block">Email:</span>
                                    <span>contact@clinifiedhub.com</span>
                                </div>
                                <div>
                                    <span className="block">Address:</span>
                                    <span>123 Healthcare St,<br />Medical District,<br />NY 10001</span>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold mb-4">Working Hours</h4>
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
                                <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                                    <span className="text-primary font-medium text-xs">24/7 Emergency Support Available</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
                        <p>&copy; 2025 Clinified Hub. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* Back to Top Button */}
            {showBackToTop && (
                <button
                    onClick={scrollToTop}
                    className={`fixed bottom-8 right-8 z-50 bg-gradient-to-r from-primary to-teal-600 text-white p-4 rounded-full shadow-2xl hover:shadow-teal-500/25 transition-all duration-300 hover:scale-110 back-to-top-btn group`}
                    aria-label="Back to top"
                >
                    <ChevronUp className="h-6 w-6 group-hover:-translate-y-1 transition-transform duration-300" />
                </button>
            )}
        </div>
    );
}