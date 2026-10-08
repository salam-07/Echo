import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Layout from '../layouts/Layout';
import { Measure, SheetHead, Notice, Placeholder } from '../components/editorial/Apparatus';
import ReplyList from '../components/features/echo/ReplyList';
import ReplyInput from '../components/features/echo/ReplyInput';
import EchoHeader from '../components/features/echo/EchoHeader';
import { useEchoStore } from '../store/useEchoStore';

const ROW = 't-label flex h-11 items-center gap-2 transition duration-200';

/**
 * One echo, given the whole measure. The feed sets an entry at reading size; here it
 * is set a step larger, because this page has one thing on it and the thing is the
 * text. Replies are always open — you arrived here to read them.
 */
const EchoView = () => {
    const { id } = useParams();
    const { getEcho, echo, isLoadingEcho, toggleLike, addReply, deleteReply } = useEchoStore();
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);

    useEffect(() => {
        if (id) getEcho(id);
    }, [id, getEcho]);

    const handleAddReply = async (comment) => {
        setIsSubmittingReply(true);
        try {
            await addReply(id, comment);
        } finally {
            setIsSubmittingReply(false);
        }
    };

    const handleDeleteReply = async (replyId) => {
        if (window.confirm('Delete this reply? This cannot be undone.')) {
            await deleteReply(id, replyId);
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({ title: `Echo by @${echo.author?.userName}`, text: echo.content, url });
                return;
            } catch (error) {
                // The reader dismissed the share sheet — not a failure, nothing to say.
                if (error?.name === 'AbortError') return;
                // Anything else (no permission, unsupported target): fall through to copy.
            }
        }
        try {
            await navigator.clipboard.writeText(url);
            toast.success('Link copied');
        } catch {
            toast.error('Couldn’t copy the link');
        }
    };

    if (isLoadingEcho) {
        return (
            <Layout>
                <Measure className="pt-6">
                    <h1 className="sr-only">Loading Echo</h1>
                    <Placeholder rows={1} />
                </Measure>
            </Layout>
        );
    }

    if (!echo || echo._id !== id) {
        return (
            <Layout>
                <Measure>
                    <SheetHead subject="Echo unavailable" />
                    <Notice
                        statement="Couldn’t load this Echo."
                        note="Try again, or return to your Feed. The Echo may have been deleted."
                        actions={
                            <><button type="button" onClick={() => getEcho(id)} className="act h-11 px-6">Try again</button>
                            <Link to="/" className="act act-quiet h-11 px-6">Back to Feed</Link></>
                        }
                    />
                </Measure>
            </Layout>
        );
    }

    const replyCount = echo.replies?.length || 0;
    const isLiked = echo.isLiked;

    return (
        <Layout>
            <Measure>
                <header className="flex justify-end py-4">
                    <h1 className="sr-only">Echo by @{echo.author?.userName || 'anonymous'}</h1>
                    <Link to="/" className="act act-quiet h-11 px-3">Back to Feed</Link>
                </header>

                <article>
                    <EchoHeader echo={echo} />

                    <p className="mt-5 whitespace-pre-wrap break-words text-pretty text-[1.125rem] leading-[1.65] text-ink sm:text-[1.25rem]">
                        {echo.content}
                    </p>

                    {echo.tags?.length > 0 && (
                        <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1">
                            {echo.tags.map((tag) => (
                                <Link
                                    key={tag._id}
                                    to={`/tag/${encodeURIComponent(tag.name)}`}
                                    className="t-readout break-all text-ink-quiet transition-colors hover:text-ink"
                                >
                                    #{tag.name}
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="mt-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-6">
                            <button
                                type="button"
                                onClick={() => toggleLike(echo._id)}
                                aria-pressed={isLiked}
                                className={`${ROW} active:scale-95 ${
                                    isLiked ? 't-label--ink underline decoration-1 underline-offset-4' : 'hover:text-ink'
                                }`}
                            >
                                <span>{isLiked ? 'Liked' : 'Like'}</span>
                                <span className="t-readout">{echo.likes || 0}</span>
                            </button>
                        </div>

                        <button type="button" onClick={handleShare} className={`${ROW} hover:text-ink`}>
                            Share
                        </button>
                    </div>
                </article>

                <section aria-labelledby="replies-heading" className="mt-10 pb-16">
                    <h2 id="replies-heading" className="t-label t-label--ink flex items-baseline gap-3">
                        Replies <span className="t-readout text-ink-quiet">{replyCount}</span>
                    </h2>
                    <div className="pt-5 pb-6">
                        <ReplyInput key={id} onSubmit={handleAddReply} isSubmitting={isSubmittingReply} />
                    </div>

                    <ReplyList replies={echo.replies || []} onDeleteReply={handleDeleteReply} />
                </section>
            </Measure>
        </Layout>
    );
};

export default EchoView;
