export const TOUR_STEPS = [
    { group: 1, path: '/', title: 'This is your feed', body: 'Read posts here. On Echo, a post is called an Echo. You choose what shows up by making feeds called Scrolls.' },
    { group: 2, path: '/', title: 'Pick a feed to read', body: 'Use the bar at the top to choose which feed you read. Pick a feed to see its posts. Feeds you create or follow appear here.', mobileBody: 'Use the bar at the bottom to choose which feed you read. Pick a feed to see its posts. Feeds you create or follow appear here.' },
    { group: 3, path: '/new', title: 'Write an Echo', body: 'Write your post here. Add tags, like music or books, so people can find it. You don’t need to post anything to keep going.' },
    { group: 4, path: '/scroll/new', title: 'Choose what you see', body: 'A Scroll is your own feed. Choose tags and add usernames to pick whose posts appear. We don’t follow people here. We add them to our Scrolls.' },
    { group: 5, part: '1 of 3', path: '/scroll/new', destination: '/community', action: 'Open Community', title: 'Find feeds made by others', body: 'Open Community to find Scrolls other people have shared. Follow a Scroll to keep it in your library.', arrived: 'You’re in Community. Its tabs help you find different things to read.' },
    { group: 5, part: '2 of 3', path: '/community', destination: '/browse/scrolls', action: 'Open Feeds', title: 'Feeds find new posts for you', body: 'Open the Feeds tab. These Scrolls gather new posts using the topics and people their creators chose.', arrived: 'Follow a Feed you like to add it to your Scrolls. You can read it without building your own.' },
    { group: 5, part: '3 of 3', path: '/browse/scrolls', destination: '/browse/curation', action: 'Open Curations', title: 'Curations are hand-picked posts', body: 'Open the Curations tab. These are collections of posts that someone picked and saved.', arrived: 'Follow a Curation to come back to someone’s collection. A Feed finds posts; a Curation keeps chosen posts.' },
    { group: 6, path: '/browse/curation', destination: '/browse/tags', action: 'Open Tags', title: 'Explore a topic with Tags', body: 'Open the Tags tab to find topics people are posting about. Pick a tag to read its posts. No need to make a Scroll.', arrived: 'Pick any tag when you want to explore. You don’t have to add it to your feed.' },
    { group: 7, path: '/scroll/new?type=curation', title: 'Keep posts for later', body: 'Make a Curation to save posts together, like a folder of bookmarks. Then use Save below any Echo to add it.' },
    { group: 8, path: '/', title: 'Your feed. Your choice.', body: 'Like a post or reply to join in, just as you’re used to. The difference is your feed: you choose its topics and people, and you can change them anytime.' },
];

const key = (userId) => `echo:interface-tour:v1:${userId}`;
const seenThisSession = new Set();
export function hasSeenTour(userId) {
    if (seenThisSession.has(userId)) return true;
    try { return localStorage.getItem(key(userId)) === 'done'; } catch { return false; }
}
export function markTourSeen(userId) {
    seenThisSession.add(userId);
    try { localStorage.setItem(key(userId), 'done'); } catch { /* The tour still works without storage. */ }
}

