import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { CurationForm, FeedForm } from '../components/forms';
import { Measure, SheetHead } from '../components/editorial/Apparatus';

/**
 * Choosing what kind of Scroll to make, then making it.
 *
 * The choice is a two-stop rail, the same control the rule itself is built from, so
 * the form's first decision looks like all the ones that follow. The sentence under
 * the rail says what the held stop means — a card grid with an icon in each tile
 * looked like a purchase, and it never said which one filled itself.
 */
const KINDS = [
    { value: 'feed', label: 'Feed', note: 'A rule. You set the terms once and it gathers whatever satisfies them.' },
    { value: 'curation', label: 'Curation', note: 'A shelf. Nothing appears in it that you have not filed yourself.' },
];

const NewScrollPage = () => {
    const [params] = useSearchParams();
    const [kind, setKind] = useState(params.get('type') === 'curation' ? 'curation' : 'feed');
    const held = KINDS.find((option) => option.value === kind);

    return (
        <Layout>
            <Measure>
                <SheetHead label="New scroll" subject="What should decide what you read?" />

                <fieldset>
                    <legend className="sr-only">Kind of scroll</legend>
                    <div className="flex border border-rule">
                        {KINDS.map((option, index) => (
                            <label
                                key={option.value}
                                data-held={kind === option.value || undefined}
                                className={`stop t-label h-12 flex-1 ${index > 0 ? 'border-l border-rule' : ''}`}
                            >
                                <input
                                    type="radio"
                                    name="scrollKind"
                                    className="sr-only"
                                    checked={kind === option.value}
                                    onChange={() => setKind(option.value)}
                                />
                                {option.label}
                            </label>
                        ))}
                    </div>
                    <p className="mt-3 text-[0.8125rem] leading-[1.5] text-ink-quiet">{held.note}</p>
                </fieldset>

                {/* The rule sheet opens each clause with its own rule and margin; the
                    curation sheet starts straight into a field and needs the gap. */}
                <div className={kind === 'feed' ? 'pb-16' : 'mt-10 pb-16'}>
                    {kind === 'feed' ? <FeedForm /> : <CurationForm />}
                </div>
            </Measure>
        </Layout>
    );
};

export default NewScrollPage;
