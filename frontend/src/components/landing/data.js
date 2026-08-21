/**
 * SAMPLE CONTENT FOR THE DRAWING SET.
 *
 * Every Echo below was written for this page. None of it is live user content,
 * and the sheets that display it carry a SAMPLE CONTENT mark in the title
 * block. PRODUCT.md forbids presenting illustrative material as verified, so
 * nothing here is aggregated, totalled, or offered as evidence of scale.
 *
 * Ages are stored as offsets from load rather than fixed dates, so the
 * PERIOD OF RECORD and MOST-LIKED WINDOW controls always have live material to
 * act on — including something inside the last 24 hours.
 */

export const TAGS = ['silence', 'repair', 'reading', 'cities', 'craft', 'weather', 'memory', 'code'];

export const AUTHORS = [
    'nell.hartwig',
    'tsvi',
    'okonkwo',
    'mira.vance',
    'halden',
    'juno_p',
    'arbuthnot',
    'wren',
];

const DAY = 24 * 60 * 60 * 1000;

/** Ages in days, converted to real timestamps once at module load. */
const SOURCE = [
    {
        author: 'nell.hartwig',
        content:
            'Spent an hour in the reading room and realised nothing in it wanted my attention. No counter going up, nobody performing. Just paper, and other people being quiet near each other.',
        tags: ['silence', 'reading'],
        hoursAgo: 5,
        likes: 41,
        dislikes: 2,
        viewerLiked: true,
    },
    {
        author: 'tsvi',
        content: 'Deleted four hundred lines today and the thing got faster. Nobody will ever see the work. That is fine — I saw it.',
        tags: ['code', 'craft'],
        hoursAgo: 14,
        likes: 96,
        dislikes: 4,
    },
    {
        author: 'wren',
        content: 'Rain came in from the west at exactly the hour the forecast said. I do not know why that felt like being kept a promise.',
        tags: ['weather'],
        daysAgo: 1,
        likes: 12,
        dislikes: 0,
    },
    {
        author: 'okonkwo',
        content:
            'The man who fixed my father’s radio in 1994 fixed my speaker today. Same bench, same lamp, same refusal to throw anything away.',
        tags: ['repair', 'craft'],
        daysAgo: 3,
        likes: 134,
        dislikes: 3,
        viewerLiked: true,
    },
    {
        author: 'mira.vance',
        content:
            'Every city has one street louder than it needs to be and one quieter than it should be. Learning a place is learning which is which.',
        tags: ['cities'],
        daysAgo: 6,
        likes: 58,
        dislikes: 6,
    },
    {
        author: 'halden',
        content:
            'My grandmother wrote nothing down and remembered everything. I write everything down and remember almost none of it. I am not sure which of us was archiving.',
        tags: ['memory', 'silence'],
        daysAgo: 9,
        likes: 173,
        dislikes: 5,
        viewerLiked: true,
    },
    {
        author: 'juno_p',
        content:
            'Reread a book I loved at nineteen. It is a worse book than I remember and I am a better reader than I was. Both things can be true.',
        tags: ['reading'],
        daysAgo: 12,
        likes: 24,
        dislikes: 1,
    },
    {
        author: 'arbuthnot',
        content: 'Sharpened every chisel in the drawer instead of starting the cabinet. Not procrastination. The cabinet will be better.',
        tags: ['craft', 'repair'],
        daysAgo: 18,
        likes: 67,
        dislikes: 0,
    },
    {
        author: 'tsvi',
        content: 'A good name for a variable saves more time than a fast algorithm. Nobody believes this until year four.',
        tags: ['code'],
        daysAgo: 22,
        likes: 118,
        dislikes: 9,
    },
    {
        author: 'nell.hartwig',
        content:
            'Turned off the last thing that could interrupt me. It took nine days to stop reaching for the phone anyway. The hand learns faster than the mind unlearns.',
        tags: ['silence'],
        daysAgo: 27,
        likes: 82,
        dislikes: 3,
        viewerLiked: true,
    },
    {
        author: 'wren',
        content: 'Fog thick enough this morning that the bridge ended in nothing. Everyone crossing it anyway, on faith and timetable.',
        tags: ['weather', 'cities'],
        daysAgo: 40,
        likes: 31,
        dislikes: 1,
    },
    {
        author: 'mira.vance',
        content: 'They painted over the mural. I keep looking at the wall as if the wall owed me something.',
        tags: ['cities', 'memory'],
        daysAgo: 58,
        likes: 45,
        dislikes: 2,
    },
    {
        author: 'okonkwo',
        content: 'Three attempts at the same joint. The third one held. I am keeping the first two on the shelf where I can see them.',
        tags: ['repair'],
        daysAgo: 74,
        likes: 29,
        dislikes: 0,
    },
    {
        author: 'halden',
        content:
            'Found a train ticket in a book I had not opened since 2019. I do not remember the journey, but I clearly remember stopping on page 140.',
        tags: ['reading', 'memory'],
        daysAgo: 95,
        likes: 76,
        dislikes: 1,
        viewerLiked: true,
    },
    {
        author: 'juno_p',
        content:
            'Watched a stonemason work for twenty minutes. He removed almost nothing. Every strike was a decision made somewhere else, earlier.',
        tags: ['craft'],
        daysAgo: 130,
        likes: 103,
        dislikes: 2,
    },
    {
        author: 'arbuthnot',
        content: 'Snow does to a street what a good editor does to a paragraph.',
        tags: ['silence', 'weather'],
        daysAgo: 180,
        likes: 152,
        dislikes: 7,
    },
    {
        author: 'tsvi',
        content: 'Wrote the whole feature, then wrote the paragraph explaining why it exists. Deleted the feature.',
        tags: ['code', 'silence'],
        daysAgo: 240,
        likes: 88,
        dislikes: 11,
    },
    {
        author: 'nell.hartwig',
        content:
            'The library’s oldest rule is still the best interface design I have ever seen: be quiet, take what you need, bring it back.',
        tags: ['reading', 'silence'],
        daysAgo: 300,
        likes: 61,
        dislikes: 0,
        viewerLiked: true,
    },
    {
        author: 'wren',
        content: 'I can recall the smell of a house I lived in for eleven months and not the name of a man I worked beside for six years.',
        tags: ['memory'],
        daysAgo: 340,
        likes: 37,
        dislikes: 1,
    },
    {
        author: 'mira.vance',
        content:
            'The council resurfaced the road and left the old kerbstones. Whoever made that decision, I hope somebody told them it was right.',
        tags: ['cities', 'repair'],
        daysAgo: 400,
        likes: 19,
        dislikes: 3,
    },
    {
        author: 'okonkwo',
        content: 'My apprentice asked for the shortcut. I gave him the long way. He will find the shortcut himself and it will be his.',
        tags: ['craft', 'code'],
        daysAgo: 430,
        likes: 92,
        dislikes: 2,
    },
    {
        author: 'halden',
        content: 'Nine days of grey, then one afternoon so clear you could see the hills. Nobody in this city talks about anything else for a week.',
        tags: ['weather'],
        daysAgo: 480,
        likes: 0,
        dislikes: 0,
    },
    {
        author: 'juno_p',
        content: 'Kept a diary for a year and never reread it. Turns out I wanted a witness, not a record.',
        tags: ['memory', 'reading'],
        daysAgo: 520,
        likes: 54,
        dislikes: 1,
    },
    {
        author: 'arbuthnot',
        content: 'Glued the handle back on my mother’s jug. You can see the line. That is the point of it now.',
        tags: ['repair', 'memory'],
        daysAgo: 560,
        likes: 121,
        dislikes: 4,
    },
];

const LOADED_AT = Date.now();

export const ECHOS = SOURCE.map((echo, index) => {
    const ageMs = echo.hoursAgo != null ? echo.hoursAgo * 60 * 60 * 1000 : echo.daysAgo * DAY;
    const createdAt = new Date(LOADED_AT - ageMs);

    return {
        ...echo,
        id: `E${String(index + 1).padStart(3, '0')}`,
        createdAt,
        ageDays: ageMs / DAY,
        chars: echo.content.length,
        viewerLiked: Boolean(echo.viewerLiked),
    };
});

/** Every tag that actually appears in the sample set, in declaration order. */
export const TAGS_IN_USE = TAGS.filter((tag) => ECHOS.some((echo) => echo.tags.includes(tag)));
