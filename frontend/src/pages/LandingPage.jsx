import React, { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import CTASection from '../components/landing/CTASection';
import LandingFooter from '../components/landing/LandingFooter';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
    useLayoutEffect(() => {
        // Ensure document body can scroll properly
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';

        // Refresh ScrollTrigger after a short delay to ensure layout is complete
        const timeoutId = setTimeout(() => {
            ScrollTrigger.refresh(true);
        }, 100);

        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <main className="bg-base-100 min-h-screen overflow-x-hidden">
            <LandingNavbar />
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <TestimonialsSection />
            <CTASection />
            <LandingFooter />
        </main>
    );
};

export default LandingPage;
