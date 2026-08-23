import { describe, expect, it } from 'vitest';
import {
  FALLBACK_PREFERENCES,
  parsePreferences,
  resolvePreferences,
} from './preferences.ts';

describe('parsePreferences', () => {
  it('returns fallbacks when storage is empty or malformed', () => {
    expect(parsePreferences(undefined)).toEqual(FALLBACK_PREFERENCES);
    expect(parsePreferences({ theologySlug: 1 })).toEqual(FALLBACK_PREFERENCES);
  });

  it('keeps stored slugs', () => {
    expect(
      parsePreferences({ theologySlug: 'catholic', profileSlug: 'mature_believer' }),
    ).toEqual({
      theologySlug: 'catholic',
      profileSlug: 'mature_believer',
      question: FALLBACK_PREFERENCES.question,
    });
  });

  it('keeps a custom question', () => {
    expect(
      parsePreferences({
        theologySlug: 'catholic',
        profileSlug: 'mature_believer',
        question: 'What should I pray?',
      }),
    ).toEqual({
      theologySlug: 'catholic',
      profileSlug: 'mature_believer',
      question: 'What should I pray?',
    });
  });
});

describe('resolvePreferences', () => {
  const catalogs = {
    theologies: [
      { slug: 'default', is_default: true },
      { slug: 'catholic', is_default: false },
    ],
    profiles: [
      { slug: 'universal_explorer', is_default: true },
      { slug: 'mature_believer', is_default: false },
    ],
  };

  it('keeps slugs that still exist', () => {
    expect(
      resolvePreferences(
        {
          theologySlug: 'catholic',
          profileSlug: 'mature_believer',
          question: FALLBACK_PREFERENCES.question,
        },
        catalogs,
      ),
    ).toEqual({
      theologySlug: 'catholic',
      profileSlug: 'mature_believer',
      question: FALLBACK_PREFERENCES.question,
    });
  });

  it('falls back when a stored slug disappeared', () => {
    expect(
      resolvePreferences(
        {
          theologySlug: 'gone',
          profileSlug: 'gone',
          question: FALLBACK_PREFERENCES.question,
        },
        catalogs,
      ),
    ).toEqual({
      theologySlug: 'default',
      profileSlug: 'universal_explorer',
      question: FALLBACK_PREFERENCES.question,
    });
  });
});
