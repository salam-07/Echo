import React, { useState } from 'react';
import Layout from '../layouts/Layout';
import { CurationForm, FeedForm } from '../components/forms';
import { Layers, Filter, BookMarked, Sparkles } from 'lucide-react';

const NewScrollPage = () => {
    const [scrollType, setScrollType] = useState('feed');

    return (
        <Layout>
            <div className="max-w-xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-base-200/50 mb-3">
                        <Layers className="w-5 h-5 text-base-content/70" />
                    </div>
                    <h1 className="text-xl font-light text-base-content tracking-tight mb-1">
                        Create a Scroll
                    </h1>
                    <p className="text-xs text-base-content/40">
                        Organize your echos, your way
                    </p>
                </div>

                {/* Type Selector */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <button
                        type="button"
                        onClick={() => setScrollType('feed')}
                        className={`group relative p-4 rounded-xl border transition-all duration-200 text-left ${scrollType === 'feed'
                            ? 'border-base-content/20 bg-base-200/30'
                            : 'border-base-content/5 hover:border-base-content/10'
                            }`}
                    >
                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg mb-2 transition-colors ${scrollType === 'feed'
                            ? 'bg-base-content/10'
                            : 'bg-base-200/50'
                            }`}>
                            <Filter className={`w-4 h-4 ${scrollType === 'feed'
                                ? 'text-base-content'
                                : 'text-base-content/40'
                                }`} />
                        </div>
                        <h3 className={`text-sm font-medium mb-0.5 transition-colors ${scrollType === 'feed'
                            ? 'text-base-content'
                            : 'text-base-content/60'
                            }`}>
                            Feed
                        </h3>
                        <p className="text-xs text-base-content/40 leading-relaxed">
                            Auto-updates with filters
                        </p>
                        {scrollType === 'feed' && (
                            <div className="absolute top-2 right-2">
                                <Sparkles className="w-3 h-3 text-base-content/30" />
                            </div>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => setScrollType('curation')}
                        className={`group relative p-4 rounded-xl border transition-all duration-200 text-left ${scrollType === 'curation'
                            ? 'border-base-content/20 bg-base-200/30'
                            : 'border-base-content/5 hover:border-base-content/10'
                            }`}
                    >
                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg mb-2 transition-colors ${scrollType === 'curation'
                            ? 'bg-base-content/10'
                            : 'bg-base-200/50'
                            }`}>
                            <BookMarked className={`w-4 h-4 ${scrollType === 'curation'
                                ? 'text-base-content'
                                : 'text-base-content/40'
                                }`} />
                        </div>
                        <h3 className={`text-sm font-medium mb-0.5 transition-colors ${scrollType === 'curation'
                            ? 'text-base-content'
                            : 'text-base-content/60'
                            }`}>
                            Curation
                        </h3>
                        <p className="text-xs text-base-content/40 leading-relaxed">
                            Hand-pick your favorites
                        </p>
                        {scrollType === 'curation' && (
                            <div className="absolute top-2 right-2">
                                <Sparkles className="w-3 h-3 text-base-content/30" />
                            </div>
                        )}
                    </button>
                </div>

                {/* Form */}
                <div className="pb-8">
                    {scrollType === 'feed' ? <FeedForm /> : <CurationForm />}
                </div>
            </div>
        </Layout>
    );
};

export default NewScrollPage;
