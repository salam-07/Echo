import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const ScrollsAnimation = () => {
    const containerRef = useRef(null);

    useGSAP(() => {
        // Animate the lines drawing in
        gsap.fromTo(
            '.anim-line',
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 1.2, stagger: 0.1, ease: 'power3.out' }
        );

        // Fade in circles
        gsap.fromTo(
            '.anim-circle',
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.7)', delay: 0.3 }
        );

        // Continuous subtle rotation for the outer ring
        gsap.to('.rotate-slow', {
            rotation: 360,
            duration: 60,
            ease: 'none',
            repeat: -1,
        });

        // Pulse animation for center
        gsap.to('.pulse-ring', {
            scale: 1.15,
            opacity: 0,
            duration: 2,
            ease: 'power1.out',
            repeat: -1,
        });

        // Float the accent elements
        gsap.to('.float-1', {
            y: -12,
            duration: 3,
            ease: 'power1.inOut',
            yoyo: true,
            repeat: -1,
        });

        gsap.to('.float-2', {
            y: 10,
            duration: 3.5,
            ease: 'power1.inOut',
            yoyo: true,
            repeat: -1,
        });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="relative w-full h-full flex items-center justify-center min-h-[320px] sm:min-h-[380px]">
            
            {/* Outer rotating ring with dashes */}
            <div className="rotate-slow absolute w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                    <circle
                        cx="100"
                        cy="100"
                        r="95"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        strokeDasharray="4 8"
                        className="text-base-content/10"
                    />
                </svg>
            </div>

            {/* Static inner circle */}
            <div className="absolute w-48 h-48 sm:w-60 sm:h-60 lg:w-72 lg:h-72 rounded-full border border-base-content/5" />

            {/* Animated lines radiating from center */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {[0, 45, 90, 135].map((angle) => (
                    <div
                        key={angle}
                        className="anim-line absolute h-px bg-gradient-to-r from-transparent via-base-content/20 to-transparent"
                        style={{
                            width: '80%',
                            transform: `rotate(${angle}deg)`,
                            transformOrigin: 'center',
                        }}
                    />
                ))}
            </div>

            {/* Center composition */}
            <div className="relative">
                {/* Pulse ring */}
                <div className="pulse-ring absolute inset-0 rounded-full border-2 border-base-content/20" />
                
                {/* Main center circle */}
                <div className="anim-circle relative w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 rounded-full bg-gradient-to-br from-base-content/5 to-base-content/10 backdrop-blur-sm border border-base-content/10 flex items-center justify-center">
                    {/* Inner accent */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-base-content/5 border border-base-content/10 flex items-center justify-center">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-base-content/40" />
                    </div>
                </div>
            </div>

            {/* Floating accent circles */}
            <div className="anim-circle float-1 absolute top-8 sm:top-12 right-12 sm:right-20 lg:right-24">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-base-content/20 bg-base-content/5" />
            </div>

            <div className="anim-circle float-2 absolute bottom-12 sm:bottom-16 left-8 sm:left-16 lg:left-20">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-base-content/15 bg-base-content/5" />
            </div>

            <div className="anim-circle absolute top-1/4 left-12 sm:left-20">
                <div className="w-2 h-2 rounded-full bg-base-content/20" />
            </div>

            <div className="anim-circle absolute bottom-1/3 right-16 sm:right-24">
                <div className="w-1.5 h-1.5 rounded-full bg-base-content/30" />
            </div>

            {/* Subtle corner lines */}
            <div className="anim-line absolute top-12 right-8 w-12 sm:w-16 h-px bg-gradient-to-r from-base-content/20 to-transparent" />
            <div className="anim-line absolute bottom-16 left-12 w-10 sm:w-14 h-px bg-gradient-to-l from-base-content/15 to-transparent" />
            
            {/* Vertical accent lines */}
            <div className="anim-line absolute top-8 left-1/3 w-px h-8 sm:h-12 bg-gradient-to-b from-base-content/10 to-transparent origin-top" style={{ transform: 'scaleY(1)' }} />
            <div className="anim-line absolute bottom-12 right-1/3 w-px h-6 sm:h-10 bg-gradient-to-t from-base-content/15 to-transparent origin-bottom" style={{ transform: 'scaleY(1)' }} />
        </div>
    );
};

export default ScrollsAnimation;
