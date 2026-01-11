import React from 'react';
import { MessageCircle, Layers, Users, Hash, TrendingUp, Bookmark } from 'lucide-react';

const features = [
    {
        icon: MessageCircle,
        title: 'Echos',
        description: 'Share your thoughts in concise, impactful posts. Each Echo resonates across the platform.',
        gradient: 'from-violet-500 to-purple-600',
    },
    {
        icon: Layers,
        title: 'Scrolls',
        description: 'Curate collections of Echos or create dynamic feeds based on tags and filters.',
        gradient: 'from-rose-500 to-pink-500',
    },
    {
        icon: Users,
        title: 'Community',
        description: 'Connect with like-minded individuals and build your following organically.',
        gradient: 'from-emerald-500 to-teal-500',
    },
    {
        icon: Hash,
        title: 'Tags',
        description: 'Organize and discover content with a powerful tagging system.',
        gradient: 'from-amber-500 to-orange-500',
    },
    {
        icon: TrendingUp,
        title: 'Trending',
        description: 'Discover what\'s resonating with the community through trending Echos.',
        gradient: 'from-violet-500 to-rose-500',
    },
    {
        icon: Bookmark,
        title: 'Curations',
        description: 'Save and organize your favorite Echos into personal collections.',
        gradient: 'from-purple-500 to-pink-500',
    },
];

const FeaturesSection = () => {
    return (
        <section
            id="features"
            className="relative py-20 lg:py-32 px-4 bg-base-100 overflow-hidden"
        >
            {/* Subtle background glows */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-rose-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative container mx-auto max-w-6xl">
                {/* Heading */}
                <div className="text-center mb-16">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-base-200 to-base-200/50 border border-base-300/50 rounded-full text-sm font-medium mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                        Features
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral mb-4">
                        Everything you need to{' '}
                        <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-rose-500 bg-clip-text text-transparent">
                            express yourself
                        </span>
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

const FeatureCard = ({ icon: Icon, title, description, gradient }) => (
    <div className="group p-6 lg:p-8 bg-base-100 rounded-2xl border border-base-200 hover:border-base-300 hover:shadow-lg transition-all duration-300">
        <div className={`w-12 h-12 flex items-center justify-center bg-gradient-to-br ${gradient} text-white rounded-xl mb-4`}>
            <Icon size={24} />
        </div>
        <h3 className="text-xl font-semibold text-neutral mb-2">{title}</h3>
        <p className="text-base-content/70 leading-relaxed">{description}</p>
    </div>
);

export default FeaturesSection;
