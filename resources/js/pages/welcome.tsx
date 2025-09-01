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
    X
} from 'lucide-react';
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

const AnimatedHeartRate = () => {
    const [bpm, setBpm] = useState(72);

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

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted/20">
            {/* Top Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-3">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                <Stethoscope className="size-5 text-white" />
                            </div>
                            <div>
                                <span className="text-lg font-bold text-foreground">Clinify</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Link href="/login">
                                <Button variant="ghost" className="text-foreground hover:text-primary">
                                    Login
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button className="bg-primary hover:bg-primary/90">
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
                        <div className="md:hidden border-t bg-background">
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                <Link href="/login" className="block">
                                    <Button variant="ghost" className="w-full justify-start">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/register" className="block">
                                    <Button className="w-full bg-primary hover:bg-primary/90">
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
                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
                    50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
                }
                .pulse-glow {
                    animation: pulse-glow 2s ease-in-out infinite;
                }
            `}</style>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden pt-16">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-20 left-20 w-32 h-32 border border-primary/20 rounded-full"></div>
                    <div className="absolute top-40 right-20 w-24 h-24 border border-primary/20 rounded-full"></div>
                    <div className="absolute bottom-40 left-40 w-20 h-20 border border-primary/20 rounded-full"></div>
                    <div className="absolute bottom-20 right-40 w-28 h-28 border border-primary/20 rounded-full"></div>
                </div>

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className={`space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}>

                        <div className="space-y-4">
                            <h2 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                                Healthcare 
                                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"> Simplified</span>
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                                Streamline your medical practice with our comprehensive appointment scheduling system. Connect patients with healthcare providers seamlessly.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/register">
                                <Button size="lg" className="group relative overflow-hidden">
                                    <span className="relative z-10 flex items-center">
                                        Get Started
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button variant="outline" size="lg" className="group">
                                    Sign In
                                    <UserCheck className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>

                        <div className="flex items-center space-x-8 pt-4">
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
                                
                                <ECG height={120} speed={1.2} className="rounded-md" />
                                
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Heart Rate</span>
                                        <AnimatedHeartRate />
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

            {/* Features Section */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl font-bold mb-4">Why Choose Clinify?</h3>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Experience the future of healthcare management with our comprehensive platform designed for modern medical practices.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FloatingCard delay={0.1}>
                            <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                                        <Calendar className="h-6 w-6 text-white" />
                                    </div>
                                    <CardTitle>Smart Scheduling</CardTitle>
                                    <CardDescription>
                                        AI-powered appointment scheduling that reduces conflicts and maximizes efficiency.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </FloatingCard>

                        <FloatingCard delay={0.2}>
                            <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                                        <Shield className="h-6 w-6 text-white" />
                                    </div>
                                    <CardTitle>Secure & Compliant</CardTitle>
                                    <CardDescription>
                                        HIPAA-compliant platform ensuring your patients' data remains private and secure.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </FloatingCard>

                        <FloatingCard delay={0.3}>
                            <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                                        <Clock className="h-6 w-6 text-white" />
                                    </div>
                                    <CardTitle>Real-time Updates</CardTitle>
                                    <CardDescription>
                                        Instant notifications and updates keep everyone informed about appointment changes.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </FloatingCard>

                        <FloatingCard delay={0.4}>
                            <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                                        <Users className="h-6 w-6 text-white" />
                                    </div>
                                    <CardTitle>Multi-User Support</CardTitle>
                                    <CardDescription>
                                        Designed for patients, healthcare providers, and administrative staff.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </FloatingCard>

                        <FloatingCard delay={0.5}>
                            <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950/50 dark:to-teal-900/50">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mb-4">
                                        <CalendarCheck className="h-6 w-6 text-white" />
                                    </div>
                                    <CardTitle>Easy Integration</CardTitle>
                                    <CardDescription>
                                        Seamlessly integrates with existing healthcare systems and workflows.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </FloatingCard>

                        <FloatingCard delay={0.6}>
                            <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/50 dark:to-pink-900/50">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mb-4">
                                        <Phone className="h-6 w-6 text-white" />
                                    </div>
                                    <CardTitle>24/7 Support</CardTitle>
                                    <CardDescription>
                                        Round-the-clock customer support to ensure your practice runs smoothly.
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
                    <div className="text-center mb-16">
                        <h3 className="text-4xl font-bold mb-4">What Our Users Say</h3>
                        <p className="text-xl text-muted-foreground">
                            Trusted by healthcare professionals and patients worldwide
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FloatingCard delay={0.1}>
                            <Card className="h-full">
                                <CardContent className="pt-6">
                                    <div className="flex items-center mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-muted-foreground mb-6 italic">
                                        "Clinify has revolutionized our practice. The scheduling system is intuitive and our patients love the convenience."
                                    </p>
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                            DS
                                        </div>
                                        <div className="ml-3">
                                            <div className="font-semibold">Dr. Sarah Mitchell</div>
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
                                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                                            MJ
                                        </div>
                                        <div className="ml-3">
                                            <div className="font-semibold">Maria Johnson</div>
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
                                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                            RT
                                        </div>
                                        <div className="ml-3">
                                            <div className="font-semibold">Robert Chen</div>
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
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-gradient-to-r from-primary to-blue-600 rounded-3xl p-12 text-white">
                        <h3 className="text-4xl font-bold mb-4">Ready to Transform Your Healthcare Practice?</h3>
                        <p className="text-xl opacity-90 mb-8">
                            Join thousands of healthcare providers who trust Clinify for their appointment management needs.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register">
                                <Button size="lg" variant="secondary" className="text-primary font-semibold group">
                                    Start Free Trial
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                        <p className="text-sm opacity-75 mt-4">No credit card required " Free 30-day trial</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <Stethoscope className="h-8 w-8 text-primary" />
                                <span className="text-xl font-bold">Clinify</span>
                            </div>
                            <p className="text-muted-foreground text-sm">
                                Modern healthcare management for the digital age.
                            </p>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>Features</li>
                                <li>Pricing</li>
                                <li>Security</li>
                                <li>Updates</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>Documentation</li>
                                <li>Help Center</li>
                                <li>Contact Us</li>
                                <li>Status</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>About</li>
                                <li>Privacy</li>
                                <li>Terms</li>
                                <li>Blog</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
                        <p>&copy; 2024 Clinify. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}