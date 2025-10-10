import React, { useState } from 'react';
import Layout from '../layouts/Layout';
import CurationForm from '../components/CurationForm';
import FeedForm from '../components/FeedForm';

const NewScrollPage = () => {
    const [scrollType, setScrollType] = useState('feed');

    return (
        <Layout>
            <div className="max-w-2xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-base-content mb-2">
                        Create New Scroll
                    </h1>
                    <p className="text-sm text-base-content/60">
                        Choose between a curated collection or a personalized feed
                    </p>
                </div>

                {/* Type Toggle */}
                <div className="mb-8">
                    <div className="flex gap-3 p-1 bg-base-200/50 rounded-lg">
                        <button
                            type="button"
                            onClick={() => setScrollType('feed')}
                            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${scrollType === 'feed'
                                    ? 'bg-primary text-primary-content shadow-sm'
                                    : 'text-base-content/70 hover:text-base-content'
                                }`}
                        >
                            <div className="text-center">
                                <div className="text-sm font-semibold">Feed</div>
                                <div className="text-xs opacity-80 mt-0.5">Personalized & Dynamic</div>
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setScrollType('curation')}
                            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${scrollType === 'curation'
                                    ? 'bg-primary text-primary-content shadow-sm'
                                    : 'text-base-content/70 hover:text-base-content'
                                }`}
                        >
                            <div className="text-center">
                                <div className="text-sm font-semibold">Curation</div>
                                <div className="text-xs opacity-80 mt-0.5">Manual Collection</div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Form Container */}
                <div className="bg-base-100 border border-base-300 rounded-lg p-6">
                    {scrollType === 'feed' ? <FeedForm /> : <CurationForm />}
                </div>

                {/* Info Section */}
                <div className="mt-6 p-4 bg-base-200/30 rounded-lg">
                    {scrollType === 'feed' ? (
                        <div className="text-sm text-base-content/70 space-y-2">
                            <p className="font-medium text-base-content">About Feeds:</p>
                            <ul className="space-y-1 ml-4 list-disc">
                                <li>Automatically shows echos based on your filters</li>
                                <li>Updates dynamically as new echos are posted</li>
                                <li>Perfect for following topics, tags, or trends</li>
                            </ul>
                        </div>
                    ) : (
                        <div className="text-sm text-base-content/70 space-y-2">
                            <p className="font-medium text-base-content">About Curations:</p>
                            <ul className="space-y-1 ml-4 list-disc">
                                <li>Manually select which echos to include</li>
                                <li>Create themed collections or favorites</li>
                                <li>Add echos from any echo's menu option</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default NewScrollPage;
