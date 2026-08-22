import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { Measure, SheetHead, Notice, Placeholder } from '../components/editorial/Apparatus';
import ReplyList from '../components/features/echo/ReplyList';
import ReplyInput from '../components/features/echo/ReplyInput';
import { Timestamp } from '../components/ui';
import { useEchoStore } from '../store/useEchoStore';

const ROW = 't-label flex h-11 items-center gap-2 transition-colors duration-200';

/**
 * One echo, given the whole measure. The feed sets an entry at reading size; here it
 * is set a step larger, because this page has one thing on it and the thing is the
 * text. Replies are always open — you arrived here to read them.
 */
const EchoView = () => {
    const navigate = useNavigate();
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

    const handleShare = () => {
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({ title: `Echo by @${echo.author?.userName}`, text: echo.content, url });
        } else {
            navigator.clipboard.writeText(url);
        }
    };

    if (isLoadingEcho) {
        return (
            <Layout>
                <Measure>
                    <SheetHead label="Echo" />
                    <Placeholder rows={1} />
                </Measure>
            </Layout>
        );
    }

    if (!echo) {
        return (
            <Layout>
                <Measure>
                    <SheetHead label="Echo" subject="Not found." />
                    <Notice
                        statement="This echo is no longer here."
                        note="It may have been deleted, or the address may be wrong."
                        actions={
                            <button type="button" onClick={() => navigate(-1)} className="act act-outline h-11 px-6">
                                Go back
                            </button>
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
                <SheetHead label="Echo" readout={<Timestamp date={echo.createdAt} className="t-readout" />} />

                <article>
                    <p className="t-label">
                        <Link to={`/user/${echo.author?._id}`} className="link-rule text-ink">
                            @{echo.author?.userName || 'anonymous'}
                        </Link>
                    </p>

                    <p className="mt-5 whitespace-pre-wrap break-words text-[1.125rem] leading-[1.65] text-ink sm:text-[1.25rem]">
                        {echo.content}
                    </p>

                    {echo.tags?.length > 0 && (
                        <p className="t-readout mt-6 flex flex-wrap gap-x-3 gap-y-1 text-rule-strong">
                            {echo.tags.map((tag) => (
                                <Link key={tag._id} to={`/tag/${tag.name}`} className="link-rule">
                                    #{tag.name}
                                </Link>
                            ))}
                        </p>
                    )}

                    <div className="mt-6 flex items-center justify-between gap-4 border-t border-rule pt-1">
                        <div className="flex items-center gap-6">
                            <button
                                type="button"
                                onClick={() => toggleLike(echo._id)}
                                aria-pressed={isLiked}
                                className={`${ROW} ${
                                    isLiked ? 't-label--ink underline decoration-1 underline-offset-4' : 'hover:text-ink'
                                }`}
                            >
                                <span>{isLiked ? 'Liked' : 'Like'}</span>
                                <span className="t-readout">{echo.likes || 0}</span>
                            </button>
                            <p className={ROW}>
                                <span>Replies</span>
                                <span className="t-readout">{replyCount}</span>
                            </p>
                        </div>

                        <button type="button" onClick={handleShare} className={`${ROW} hover:text-ink`}>
                            Copy link
                        </button>
                    </div>
                </article>

                <section className="mt-12 pb-16">
                    <h2 className="t-label t-label--ink border-b border-ink pb-3">
                        Replies <span className="t-readout ml-2 font-normal text-ink-quiet">{replyCount}</span>
                    </h2>

                    <div className="border-b border-rule py-6">
                        <ReplyInput onSubmit={handleAddReply} isSubmitting={isSubmittingReply} />
                    </div>

                    <ReplyList replies={echo.replies || []} onDeleteReply={handleDeleteReply} />
                </section>
            </Measure>
        </Layout>
    );
};

export default EchoView;
