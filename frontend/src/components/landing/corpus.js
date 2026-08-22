/**
 * The corpus printed in §03.
 *
 * SYNTHETIC. These fourteen Echos were authored for this page so that a visitor
 * can operate a real rule against a real body of text before signing up. They
 * are not live platform content, and the sheet says so in two places (the §03
 * readout and the colophon). Dates are fixed to SHEET_DATE rather than to the
 * clock, so the printed sheet reads the same every time it is opened.
 */

export const SHEET_DATE = '2026-08-22';

export const SHEET_NO = '01';

/** The eight tags this sheet's corpus is filed under. */
export const TAGS = [
    'typography',
    'brutalism',
    'negative-space',
    'grid',
    'letterpress',
    'urbanism',
    'print',
    'hot-takes',
];

export const ECHOS = [
    {
        id: 'E-01',
        author: 'mira.k',
        at: '2026-08-22',
        likes: 47,
        likedByYou: false,
        tags: ['typography', 'print'],
        body: 'Set the same paragraph in eight faces this morning. Only one of them let me finish reading it. The others kept introducing themselves.',
    },
    {
        id: 'E-02',
        author: 'tsuchiya',
        at: '2026-08-22',
        likes: 12,
        likedByYou: false,
        tags: ['negative-space'],
        body: 'The best room in the building is the one they could not find a use for.',
    },
    {
        id: 'E-03',
        author: 'j.oyelaran',
        at: '2026-08-18',
        likes: 863,
        likedByYou: true,
        tags: ['brutalism', 'urbanism'],
        body: 'Concrete was never brutal. It was cheap, fast, and honest about being both. We only started calling it brutal once we could no longer afford it.',
    },
    {
        id: 'E-04',
        author: 'dinah.w',
        at: '2026-08-14',
        likes: 204,
        likedByYou: false,
        tags: ['grid', 'typography'],
        body: 'A grid is not a constraint. It is a promise: I will not move this without telling you.',
    },
    {
        id: 'E-05',
        author: 'r.abadi',
        at: '2026-08-09',
        likes: 1204,
        likedByYou: false,
        tags: ['hot-takes'],
        body: 'Unpopular opinion: serifs are a personality substitute and I will not be taking questions at this time.',
    },
    {
        id: 'E-06',
        author: 'noor.s',
        at: '2026-08-05',
        likes: 96,
        likedByYou: false,
        tags: ['letterpress', 'print'],
        body: 'Ran the plate a shade too deep and the counters filled in. Kept the sheet anyway. The mistake is the only proof a person was standing there.',
    },
    {
        id: 'E-07',
        author: 'mira.k',
        at: '2026-07-30',
        likes: 331,
        likedByYou: true,
        tags: ['negative-space', 'grid'],
        body: 'Margins are not empty. They are the part of the page that agrees to stay quiet so the rest can be heard.',
    },
    {
        id: 'E-08',
        author: 'tsuchiya',
        at: '2026-07-11',
        likes: 58,
        likedByYou: false,
        tags: ['urbanism'],
        body: 'Walked the same block at six in the morning and six in the evening. Two different cities, one set of drawings.',
    },
    {
        id: 'E-09',
        author: 'r.abadi',
        at: '2026-06-22',
        likes: 742,
        likedByYou: false,
        tags: ['hot-takes', 'typography'],
        body: 'Hot take: nobody has ever read a kerning complaint and changed their life. Ship the thing.',
    },
    {
        id: 'E-10',
        author: 'dinah.w',
        at: '2026-05-14',
        likes: 178,
        likedByYou: false,
        tags: ['print', 'typography'],
        body: 'Printed the spec at full size and taped it to the wall. Found four errors in a document I had read on screen nine times.',
    },
    {
        id: 'E-11',
        author: 'j.oyelaran',
        at: '2026-04-02',
        likes: 421,
        likedByYou: true,
        tags: ['brutalism', 'print'],
        body: 'The Barbican in the rain is the argument. The Barbican in a brochure is the excuse.',
    },
    {
        id: 'E-12',
        author: 'noor.s',
        at: '2026-02-19',
        likes: 89,
        likedByYou: false,
        tags: ['letterpress', 'grid'],
        body: 'Locked up a forme with no measure written down, then spent two hours learning exactly why the measure is written down.',
    },
    {
        id: 'E-13',
        author: 'mira.k',
        at: '2025-11-08',
        likes: 615,
        likedByYou: false,
        tags: ['typography', 'negative-space'],
        body: 'Leading is the sound of the room the words get read in. Set it too tight and everybody whispers.',
    },
    {
        id: 'E-14',
        author: 'tsuchiya',
        at: '2025-06-27',
        likes: 27,
        likedByYou: false,
        tags: ['urbanism', 'brutalism'],
        body: 'They took it down on a Tuesday. The bus stop still has the shape of it in the shade at four o’clock.',
    },
];

/**
 * The eight declarative parameters a Feed Scroll is defined by, printed in full
 * in §01 so the engine is visible before anything is claimed about it.
 * `operable` marks the six a visitor can move on this sheet; the other two are
 * printed for completeness and set in the app.
 */
export const PARAMETERS = [
    { name: 'tagMatchType', values: 'all · any · none', operable: true },
    { name: 'includedTags', values: 'any tag', operable: true },
    { name: 'excludedTags', values: 'any tag', operable: true },
    { name: 'sortBy', values: 'most liked · newest · oldest', operable: true },
    { name: 'likedWindow', values: '1 day · 1 month · 1 year · all time', operable: true },
    { name: 'excludeLiked', values: 'true · false', operable: true },
    { name: 'authors', values: 'any user', operable: false },
    { name: 'dateRange', values: 'from · to', operable: false },
];

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/** `2026-07-30` → `30 JUL 26`. Print convention, not a timestamp. */
export const formatFiled = (iso) => {
    const [y, m, d] = iso.split('-');
    return `${d} ${MONTHS[Number(m) - 1]} ${y.slice(2)}`;
};
