import React, { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { CurationForm, FeedForm } from '../components/forms';
import { Stops } from '../components/forms/Sheet';
import { Measure, SheetHead } from '../components/editorial/Apparatus';

const KINDS = [
    {
        value: 'feed',
        label: 'Feed',
        note: 'Matching Echos gather here automatically. You choose the filters.',
    },
    {
        value: 'curation',
        label: 'Curation',
        note: 'A collection of Echos you pick by hand. Add them after creating it.',
    },
];

const NewScrollPage = () => {
    const [params] = useSearchParams();
    const [kind, setKind] = useState(params.get('type') === 'curation' ? 'curation' : 'feed');
    const held = KINDS.find((option) => option.value === kind);

    const chosen = useRef(false);
    const choose = (value) => {
        chosen.current = true;
        setKind(value);
    };

    return (
        <Layout>
            <Measure>
                <SheetHead subject="Create a Scroll">
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

                <div className="pb-16">
                    <div hidden={kind !== 'feed'}>
                        <FeedForm autoFocus={kind === 'feed' && !chosen.current} />
                    </div>
                    <div hidden={kind !== 'curation'}>
                        <CurationForm autoFocus={kind === 'curation' && !chosen.current} />
                    </div>
                </div>
            </Measure>
        </Layout>
    );
};

export default NewScrollPage;
