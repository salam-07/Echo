import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isScrollFollowed, updateScrollFollowers } from '../src/lib/scrollFollowers.js';

const me = { _id: 'reader', userName: 'reader' };
const other = { _id: 'other', userName: 'other' };

test('recognizes follows in library responses with populated users', () => {
    assert.equal(isScrollFollowed([other, me], 'reader'), true);
    assert.equal(isScrollFollowed([other], 'reader'), false);
});

test('recognizes ID-only and mixed responses after refresh', () => {
    assert.equal(isScrollFollowed(['reader'], 'reader'), true);
    assert.equal(isScrollFollowed([other, 'reader'], 'reader'), true);
    assert.equal(isScrollFollowed(undefined, 'reader'), false);
    assert.equal(isScrollFollowed([me], undefined), false);
});

test('follow is idempotent and preserves populated follower metadata', () => {
    const followers = [other, me];
    assert.deepEqual(updateScrollFollowers(followers, 'reader', true), followers);
    assert.deepEqual(updateScrollFollowers([other], 'reader', true), [other, 'reader']);
    assert.deepEqual(followers, [other, me]);
});

test('unfollow removes populated and duplicate ID entries without losing others', () => {
    const followers = [other, me, 'reader'];
    assert.deepEqual(updateScrollFollowers(followers, 'reader', false), [other]);
    assert.deepEqual(followers, [other, me, 'reader']);
});

test('failed optimistic changes restore follow membership without duplicates', () => {
    const removed = updateScrollFollowers([other, me], 'reader', false);
    const restored = updateScrollFollowers(removed, 'reader', true);
    assert.equal(isScrollFollowed(restored, 'reader'), true);
    assert.equal(restored.length, 2);
    const added = updateScrollFollowers([other], 'reader', true);
    assert.deepEqual(updateScrollFollowers(added, 'reader', false), [other]);
});
