import React from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
    {
        quote: "Echo has completely changed how I share my ideas. The Scrolls feature is a game-changer for organizing content.",
        author: "Alex Chen",
        role: "Content Creator",
        avatar: "A",
        gradient: 'from-violet-500 to-purple-600',
    },
    {
        quote: "The simplicity of Echo is what drew me in. No noise, just meaningful conversations and great content.",
        author: "Sarah Mitchell",
        role: "Writer",
        avatar: "S",
        gradient: 'from-rose-500 to-pink-500',
    },
    {
        quote: "I love how easy it is to discover new voices through tags. The community here is incredibly supportive.",
        author: "Marcus Johnson",
        role: "Developer",
        avatar: "M",
        gradient: 'from-emerald-500 to-teal-500',
    },
];

const TestimonialsSection = () => {
    return (
        <section
            id="testimonials"
            className="relative py-20 lg:py-32 px-4 bg-base-100 overflow-hidden"
        >
            {/* Subtle background glows */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 right-0 w-72 h-72 bg-rose-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative container mx-auto max-w-6xl">
                {/* Heading */}
                <div className="text-center mb-16">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-base-200 to-base-200/50 border border-base-300/50 rounded-full text-sm font-medium mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        Community
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral mb-4">
                        Loved by{' '}
                        <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 bg-clip-text text-transparent">
                            creators everywhere
                        </span>
                    </h2>
                    <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                        See what our community members have to say about Echo.
                    </p>
                </div>

                {/* Testimonial Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard key={index} {...testimonial} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const TestimonialCard = ({ quote, author, role, avatar, gradient }) => (
    <div className="relative p-6 lg:p-8 bg-base-100 rounded-2xl border border-base-200 hover:border-base-300 hover:shadow-lg transition-all duration-300">
        {/* Quote icon */}
        <Quote size={32} className={`mb-4 bg-gradient-to-br ${gradient} bg-clip-text text-transparent opacity-60`} style={{ color: 'transparent', WebkitBackgroundClip: 'text' }} />

        {/* Quote text */}
        <p className="text-base-content/80 text-lg leading-relaxed mb-6">
            "{quote}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${gradient} text-white rounded-full flex items-center justify-center text-lg font-semibold`}>
                {avatar}
            </div>
            <div>
                <div className="font-semibold text-neutral">{author}</div>
                <div className="text-sm text-base-content/60">{role}</div>
            </div>
        </div>
    </div>
);

export default TestimonialsSection;
