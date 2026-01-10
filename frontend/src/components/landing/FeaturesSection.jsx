import React from 'react';
import { MessageCircle, Layers, Users, Hash, TrendingUp, Bookmark } from 'lucide-react';

const features = [
    {
        icon: MessageCircle,
        title: 'Echos',
        description: 'Share your thoughts in concise, impactful posts. Each Echo resonates across the platform.',
    },
    {
        icon: Layers,
        title: 'Scrolls',
        description: 'Curate collections of Echos or create dynamic feeds based on tags and filters.',
    },
    {
        icon: Users,
        title: 'Community',
        description: 'Connect with like-minded individuals and build your following organically.',
    },
    {
        icon: Hash,
        title: 'Tags',
        description: 'Organize and discover content with a powerful tagging system.',
    },
    {
        icon: TrendingUp,
        title: 'Trending',
        description: 'Discover what\'s resonating with the community through trending Echos.',
    },
    {
        icon: Bookmark,
        title: 'Curations',
        description: 'Save and organize your favorite Echos into personal collections.',
    },
];

const FeaturesSection = () => {
    return (
        <section
            id="features"
            className="py-20 lg:py-32 px-4 bg-base-100"
        >
            <div className="container mx-auto max-w-6xl">
                {/* Heading */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 bg-base-200 rounded-full text-sm font-medium mb-4">
                        Features
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral mb-4">
                        Everything you need to express yourself
                    </h2>
                    <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                        Echo provides powerful tools for sharing, curating, and discovering content.
                    </p>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="group p-6 lg:p-8 bg-base-200/50 rounded-2xl border border-base-300 hover:border-neutral/20 hover:bg-base-200 transition-all duration-300">
        <div className="w-12 h-12 flex items-center justify-center bg-neutral text-neutral-content rounded-xl mb-4 group-hover:scale-110 transition-transform">
            <Icon size={24} />
        </div>
        <h3 className="text-xl font-semibold text-neutral mb-2">{title}</h3>
        <p className="text-base-content/70 leading-relaxed">{description}</p>
    </div>
);

export default FeaturesSection;
