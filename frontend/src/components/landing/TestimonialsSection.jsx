import React from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
    {
        quote: "Echo has completely changed how I share my ideas. The Scrolls feature is a game-changer for organizing content.",
        author: "Alex Chen",
        role: "Content Creator",
        avatar: "A",
    },
    {
        quote: "The simplicity of Echo is what drew me in. No noise, just meaningful conversations and great content.",
        author: "Sarah Mitchell",
        role: "Writer",
        avatar: "S",
    },
    {
        quote: "I love how easy it is to discover new voices through tags. The community here is incredibly supportive.",
        author: "Marcus Johnson",
        role: "Developer",
        avatar: "M",
    },
];

const TestimonialsSection = () => {
    return (
        <section
            id="testimonials"
            className="py-20 lg:py-32 px-4 bg-base-100"
        >
            <div className="container mx-auto max-w-6xl">
                {/* Heading */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 bg-base-200 rounded-full text-sm font-medium mb-4">
                        Community
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral mb-4">
                        Loved by creators everywhere
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

const TestimonialCard = ({ quote, author, role, avatar }) => (
    <div className="relative p-6 lg:p-8 bg-base-200/50 rounded-2xl border border-base-300">
        {/* Quote icon */}
        <Quote size={32} className="text-base-300 mb-4" />

        {/* Quote text */}
        <p className="text-base-content/80 text-lg leading-relaxed mb-6">
            "{quote}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-neutral text-neutral-content rounded-full flex items-center justify-center text-lg font-semibold">
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
