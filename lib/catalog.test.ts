import { describe, expect, it } from 'vitest';
import { parseProfiles, parseTheologies, pickDefaultSlug } from './catalog.ts';

describe('parseTheologies', () => {
  it('keeps valid rows and drops junk', () => {
    const rows = parseTheologies({
      theologies: [
        {
          slug: 'reformed',
          name: 'Reformed',
          description: 'Calvinist',
          is_default: false,
        },
        { slug: 'default', name: 'Default', is_default: true },
        { name: 'missing slug' },
      ],
    });
    expect(rows).toEqual([
      {
        slug: 'reformed',
        name: 'Reformed',
        description: 'Calvinist',
        is_default: false,
      },
      {
        slug: 'default',
        name: 'Default',
        description: '',
        is_default: true,
      },
    ]);
  });

  it('returns empty for a bad payload', () => {
    expect(parseTheologies(null)).toEqual([]);
    expect(parseTheologies({})).toEqual([]);
  });
});

describe('parseProfiles', () => {
  it('reads the public list shape', () => {
    expect(
      parseProfiles({
        profiles: [
          {
            slug: 'universal_explorer',
            name: 'Universal Explorer',
            description: 'Open to biblical wisdom',
            experience_level: 1,
            is_default: true,
          },
        ],
      }),
    ).toEqual([
      {
        slug: 'universal_explorer',
        name: 'Universal Explorer',
        description: 'Open to biblical wisdom',
        is_default: true,
      },
    ]);
  });
});

describe('pickDefaultSlug', () => {
  it('prefers the flagged default, then the first row', () => {
    expect(
      pickDefaultSlug(
        [
          { slug: 'reformed', is_default: false },
          { slug: 'default', is_default: true },
        ],
        'fallback',
      ),
    ).toBe('default');
    expect(pickDefaultSlug([{ slug: 'only', is_default: false }], 'fallback')).toBe(
      'only',
    );
    expect(pickDefaultSlug([], 'fallback')).toBe('fallback');
  });
});
