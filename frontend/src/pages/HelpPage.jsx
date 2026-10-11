import { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Layout from '../layouts/Layout';
import useAuthStore from '../store/useAuthStore';
import { resetTour } from '../lib/interfaceTour';
import { Measure, Section } from '../components/editorial/Apparatus';
import { Rule, useEditorialGround } from '../components/editorial/Frame';

/**
 * The Help leaf.
 *
 * The one page in the document that is written *to* the reader rather than *by*
 * them, so it is set as front matter: a statement, the terms it uses, and then
 * the questions, folded. Everything here is a fact about the product as it is
 * built, checked against the code, because a help page that describes a feature
 * the product does not have is worse than no help page at all.
 *
 * It is reachable signed in and signed out. Signed in, it sits in the app's own
 * frame with the index beside it. Signed out, it keeps the landing sheet's
 * running head and nothing else, so a visitor who came from the footer is not
 * dropped into chrome they cannot use.
 */

const Mail = () => (
    <a href="mailto:info@echosocial.site" className="link-rule font-medium text-ink">
        info@echosocial.site
    </a>
);

/* Answers are strings unless a link or a live control belongs inside them. */
const TOPICS = [
    {
        name: 'The interface',
        questions: [
            {
                q: 'What is an Echo?',
                a: 'An Echo is a post. It is text, up to 1000 characters, and you can add tags to it so people can find it.',
            },
            {
                q: 'What is a Scroll?',
                a: 'A Scroll is how you keep Echos together. A Curation is a list you fill by hand. A Feed follows rules you set and keeps bringing in new Echos that match them.',
            },
            {
                q: 'How do I write an Echo?',
                a: 'Choose Post an Echo. Write your text, add a tag or two if you like, then publish. There is no editing yet, so read it once more first. You can delete it and post again if you need to.',
            },
            {
                q: 'How do I find writing from other people?',
                a: 'Open Community. It gathers public Feeds and Curations you can follow, and tags you can explore. To find a person, use Search.',
            },
            {
                q: 'What is the tour?',
                a: 'The tour is the short walkthrough you see the first time you sign in. It runs once.',
                tour: true,
            },
        ],
    },
    {
        name: 'Privacy and your data',
        questions: [
            {
                q: 'What do you keep about me?',
                a: 'Your username, your password, and your bio if you write one. That is the whole account. There is no email address on it, and we do not ask for your name, your age, or your phone number.',
            },
            {
                q: 'How is my password stored?',
                a: 'It is hashed before it is saved, so the real password cannot be read back, not even by us. It is never shown on screen after you set it.',
            },
            {
                q: 'Who can see what I write?',
                a: 'Your Echos are public inside Echo. Any signed-in reader can find them through the feed, through tags, and through search, and they sit on your profile. Your Scrolls can be private, and a private Scroll is visible only to you.',
            },
            {
                q: 'Can I keep a Scroll private?',
                a: 'Yes. Set a Scroll to private when you make it and it stays in your library. Nobody else can open it.',
            },
            {
                q: 'Do you use cookies or tracking?',
                a: 'One cookie keeps you signed in between visits. There are no advertising cookies, no analytics, and nothing that follows you to other sites.',
            },
            {
                q: 'Can I delete something I wrote?',
                a: 'Yes. You can delete your own Echos, your replies, and your Scrolls. Deleting is final.',
            },
            {
                q: 'Can I delete my account?',
                a: (
                    <>
                        Not yet. Account deletion is not built. If you want your account and everything
                        in it removed, email <Mail /> and we will do it by hand.
                    </>
                ),
            },
        ],
    },
    {
        name: 'Features and control',
        questions: [
            {
                q: 'What is the difference between a Feed and a Curation?',
                a: 'A Feed follows a rule you write and keeps gathering new Echos that match it. A Curation is a fixed list you add to by hand, one Echo at a time.',
            },
            {
                q: 'How do I build a Feed?',
                a: 'Choose Create a Scroll, then pick Feed. Choose tags to include or leave out, pick whose Echos you want, set the order and the dates, then save. Nothing is hidden from you, and you can change any of it later.',
            },
            {
                q: 'How do I follow someone?',
                a: 'You do not follow people on Echo. You follow Scrolls. Open a Feed or a Curation you like and follow it to keep it in your library. To read a particular person, add them to a Feed of your own.',
            },
            {
                q: 'How do tags work?',
                a: 'A tag is shared by everyone. Tag an Echo #poetry and it lands in the same place as every other Echo tagged #poetry. Open a tag to read all of them, and use tags to tell a Feed what to gather.',
            },
            {
                q: 'What does saving a Scroll do?',
                a: 'Saving keeps a Scroll in your library so you can come back to it. The Scroll still belongs to whoever made it.',
            },
            {
                q: 'Can I search?',
                a: 'Yes. Choose Search to look across Echos, Scrolls, people, and tags. Search is newer than the rest of Echo, so it may miss things.',
            },
        ],
    },
    {
        name: 'Beta and feedback',
        questions: [
            {
                q: 'What does Beta mean here?',
                a: 'Echo is in its Beta phase. It works, and people are using it, but parts of it are unfinished and things can change without much warning.',
            },
            {
                q: 'Can I rely on Echo to keep what I write?',
                a: 'Keep anything important somewhere else as well. Echo is small and still being built, and it is not a good place to keep the only copy of something you care about.',
            },
            {
                q: 'Something is broken or confusing. What do I do?',
                a: (
                    <>
                        Tell us. Email <Mail /> with what you did, what you expected, and what happened
                        instead. A screenshot helps, but it is not required.
                    </>
                ),
            },
            {
                q: 'Can I suggest something new?',
                a: (
                    <>
                        Please do. Email <Mail />. Small suggestions count as much as big ones.
                    </>
                ),
            },
            {
                q: 'What happens to my feedback?',
                a: 'We read every message. A reply can take a while.',
            },
        ],
    },
];

/**
 * One question, folded.
 *
 * The question is set in the display face, because it is the page's content and
 * not its apparatus: a reader scanning this sheet is reading questions, not
 * labels. The mark that says the answer is folded away is drawn from the
 * document's own material rather than borrowed from an icon set: two hairlines
 * crossed, each one the same weight as every other rule on the page. Opening
 * retracts the vertical stroke, so the mark becomes the minus it always was.
 *
 * `details` does the work, so the state is announced, the keyboard works, and
 * find-in-page can open a closed answer on its own.
 *
 * Hover is answered in the same material rather than with a filled band: the
 * row's own hairline darkens to ink and the mark follows it. A grey block behind
 * the question would be the one surface on this page not made of paper and rule.
 */
const Query = ({ question, children }) => (
    <details className="group border-b border-rule transition-colors duration-200 hover:border-ink">
        <summary className="flex cursor-pointer list-none items-start gap-6 py-5 [&::-webkit-details-marker]:hidden">
            <span className="min-w-0 flex-1 font-display text-[1.125rem] leading-[1.4] tracking-[-0.005em] text-ink sm:text-[1.25rem]">
                {question}
            </span>

            {/* The mark's own box is the height of one line of the question, so the
                two hairlines land on that line's optical centre without a tuned
                margin, and the vertical stroke retracts around the same point. */}
            <span
                aria-hidden="true"
                className="relative h-[1.575rem] w-3.5 shrink-0 sm:h-[1.75rem]"
            >
                <span className="absolute left-1/2 top-1/2 h-px w-3.5 -translate-x-1/2 -translate-y-1/2 bg-ink-quiet transition-colors duration-200 ease-[var(--ease-press)] group-hover:bg-ink group-open:bg-ink" />
                {/* Tailwind emits `scale-y-0` as the `scale` property, not
                    `transform`, so the transition names `scale` — naming
                    `transform` here would leave the stroke snapping shut. */}
                <span className="absolute left-1/2 top-1/2 h-3.5 w-px -translate-x-1/2 -translate-y-1/2 bg-ink-quiet transition-[scale,background-color] duration-200 ease-[var(--ease-press)] group-hover:bg-ink group-open:scale-y-0" />
            </span>
        </summary>

        {/* The page's own arrival, reused: the answer settles onto its baseline
            rather than appearing between one frame and the next. Reduced motion
            flattens it to bare presence without knowing it is here. */}
        <div className="animate-set-in pb-7">
            <div className="text-ink-soft">{children}</div>
        </div>
    </details>
);

/** The sheet itself, identical in both frames. */
const HelpBody = ({ signedIn = false }) => {
    const navigate = useNavigate();
    const userId = useAuthStore((state) => state.authUser?._id);

    const replayTour = useCallback(() => {
        resetTour(userId);
        navigate('/');
    }, [navigate, userId]);

    return (
        <>
            <header className="pt-10 pb-4 sm:pt-12">
                <h1 className="t-display max-w-[13ch]">How can we help?</h1>

                <p className="t-body mt-6 max-w-[54ch] text-ink-soft">
                    Echo is still in Beta. It works, but parts of it are unfinished and things can
                    change. Feedback of every kind is welcome, good and bad. Email <Mail />.
                </p>
            </header>

            {TOPICS.map((topic) => (
                <Section
                    key={topic.name}
                    label={topic.name}
                    readout={`${topic.questions.length} ${
                        topic.questions.length === 1 ? 'question' : 'questions'
                    }`}
                >
                    {topic.questions.map((entry) => (
                        <Query key={entry.q} question={entry.q}>
                            <p className="t-body">{entry.a}</p>
                            {entry.tour && signedIn ? (
                                <button
                                    type="button"
                                    onClick={replayTour}
                                    className="act act-outline mt-5 h-10 px-5"
                                >
                                    Take the tour again
                                </button>
                            ) : null}
                        </Query>
                    ))}
                </Section>
            ))}
        </>
    );
};

/** Signed out: the landing sheet's running head, and the same sheet beneath it. */
const PublicHelp = () => {
    useEditorialGround();

    return (
        <div className="editorial min-h-screen">
            <header className="sticky top-0 z-50 bg-paper">
                <Measure>
                    <div className="flex h-16 items-center justify-between gap-6 lg:h-[72px]">
                        <Link
                            to="/"
                            className="font-display text-[1.375rem] leading-none tracking-[-0.01em] text-ink"
                        >
                            Echo
                        </Link>

                        <div className="flex items-center gap-5 lg:gap-7">
                            <Link
                                to="/login"
                                className="t-label link-rule whitespace-nowrap transition-colors hover:text-ink"
                            >
                                Sign in
                            </Link>
                            <Link to="/signup" className="act act-outline h-9 px-4">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </Measure>
                <Rule />
            </header>

            <main>
                <Measure className="pb-20">
                    <HelpBody />
                </Measure>
            </main>

            <footer>
                <Rule />
                <Measure>
                    <div className="flex flex-col gap-3 py-6 md:flex-row md:items-baseline md:justify-between md:gap-8">
                        <Link to="/" className="t-label link-rule transition-colors hover:text-ink">
                            Back to Echo
                        </Link>
                        <p className="t-label">Echo · Beta</p>
                    </div>
                </Measure>
            </footer>
        </div>
    );
};

const HelpPage = () => {
    const authUser = useAuthStore((state) => state.authUser);

    if (!authUser) return <PublicHelp />;

    return (
        <Layout>
            <Measure className="pb-20">
                <HelpBody signedIn />
            </Measure>
        </Layout>
    );
};

export default HelpPage;
