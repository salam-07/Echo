/**
 * The welcome sheet's first leaf: the one idea, stated once.
 *
 * A new reader's Home is empty by design — Echo decides nothing for them, so until
 * they write a rule there is nothing to show. That is easy to misread as a dead
 * end. This leaf names the mechanism before they meet the emptiness: the page is
 * blank because the page obeys a rule, and the rule is theirs to write. It teaches
 * exactly that and then hands straight to writing one. No tour, no checklist —
 * front matter, and then the corpus begins.
 */

const MODELS = [
    {
        term: 'A Feed',
        detail: 'A standing rule. It gathers every Echo that matches its terms, and keeps gathering as new ones are written. You will build one in a moment.',
    },
    {
        term: 'A Curation',
        detail: 'A list you keep by hand, in an order you choose. For later — a Feed is the faster way to fill a blank page.',
    },
];

const FrontMatter = ({ handle, onBegin }) => (
    <div className="animate-set-in">
        <p className="t-label t-label--ink">First run</p>

        <h1 className="t-display mt-6 max-w-[14ch]">Your page is blank on purpose.</h1>

        <p className="t-body mt-6 max-w-[54ch] text-ink-soft">
            Welcome{handle ? <>, <span className="text-ink">@{handle}</span></> : ''}. There is no algorithm
            here deciding what you read. A <span className="text-ink">Scroll</span> does — a rule you write.
            Name a few tags, choose an order, and the page fills with every Echo that matches, then keeps
            filling on its own. Let&rsquo;s write your first one. It takes about a minute, and you can change
            every word of it later.
        </p>

        <dl className="mt-12 border-t border-rule">
            {MODELS.map(({ term, detail }) => (
                <div
                    key={term}
                    className="flex flex-col gap-1 border-b border-rule py-5 sm:flex-row sm:gap-10"
                >
                    <dt className="t-label t-label--ink sm:w-36 sm:shrink-0">{term}</dt>
                    <dd className="t-body max-w-[46ch] text-ink-soft">{detail}</dd>
                </div>
            ))}
        </dl>

        <div className="mt-10">
            <button type="button" onClick={onBegin} className="act h-12 px-8">
                Build my first Feed
            </button>
        </div>
    </div>
);

export default FrontMatter;
