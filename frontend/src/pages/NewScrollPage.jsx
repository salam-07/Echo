import React, { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { CurationForm, FeedForm } from '../components/forms';
import { Stops } from '../components/forms/Sheet';
import { Measure, SheetHead } from '../components/editorial/Apparatus';

/**
 * Choosing what kind of Scroll to make, then making it.
 *
 * The choice is the same two-stop rail as every other either/or in this document,
 * so the sheet's first decision looks like all the ones that follow it.
 *
 * Holding a stop retitles the sheet. The question at the top of the page is the
 * question that stop answers, and the two Scrolls are not the same question: a
 * Curation is not a way of deciding what you read, it is a place to put what you
 * have already read. A page that asked "what should decide what you read?" over an
 * empty shelf was asking a Feed's question of a Curation, and the answer under it
 * had to explain that the page was wrong.
 *
 * The sentence under the rail says what the held stop means — a card grid with an
 * icon in each tile looked like a purchase, and it never said which one filled
 * itself.
 */
const KINDS = [
    {
        value: 'feed',
        label: 'Feed',
        subject: 'What should decide what you read?',
        note: 'A rule. Set the terms once and it gathers whatever satisfies them.',
    },
    {
        value: 'curation',
        label: 'Curation',
        subject: 'What are you collecting?',
        note: 'A shelf. Nothing appears in it that you have not saved yourself.',
    },
];

const NewScrollPage = () => {
    const [params] = useSearchParams();
    const [kind, setKind] = useState(params.get('type') === 'curation' ? 'curation' : 'feed');
    const held = KINDS.find((option) => option.value === kind);

    /* The name field takes focus on the sheet's first frame and only on its first
       frame. A reader arrowing along the rail must not have the focus pulled out
       from under them the moment a stop is held, so the form only asks for it
       until the reader has made that choice themselves. */
    const chosen = useRef(false);
    const choose = (value) => {
        chosen.current = true;
        setKind(value);
    };

    return (
        <Layout>
            <Measure>
                <SheetHead label="New scroll" subject={held.subject}>
                    <Stops
                        className="mt-6"
                        size="lg"
                        name="scrollKind"
                        srLegend="Kind of scroll"
                        value={kind}
                        onChange={choose}
                        options={KINDS.map((option) => ({
                            value: option.value,
                            label: option.label,
                        }))}
                    />
                    <p className="t-body mt-4 max-w-[52ch] text-ink-soft">{held.note}</p>
                </SheetHead>

                {/* Holding a stop re-sets the sheet: the document swaps under the
                    reader rather than a panel being unrolled beneath them. The key
                    replays the app's one authored moment, and nothing is carried
                    across — a half-written rule is a Feed's, and this is not one. */}
                <div key={kind} className="animate-set-in pb-16">
                    {kind === 'feed' ? (
                        <FeedForm autoFocus={!chosen.current} />
                    ) : (
                        <CurationForm autoFocus={!chosen.current} />
                    )}
                </div>
            </Measure>
        </Layout>
    );
};

export default NewScrollPage;
