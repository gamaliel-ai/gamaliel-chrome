import { pickDefaultSlug } from './catalog.ts';
import { DEFAULT_QUESTION, resolveQuestion } from './prompt.ts';

export const PREFERENCES_STORAGE_KEY = 'gamaliel.preferences';

export type Preferences = {
  theologySlug: string;
  profileSlug: string;
  question: string;
};

export const FALLBACK_PREFERENCES: Preferences = {
  theologySlug: 'default',
  profileSlug: 'universal_explorer',
  question: DEFAULT_QUESTION,
};

export function parsePreferences(value: unknown): Preferences {
  if (value === null || typeof value !== 'object') {
    return { ...FALLBACK_PREFERENCES };
  }
  const row = value as Record<string, unknown>;
  return {
    theologySlug:
      typeof row.theologySlug === 'string' && row.theologySlug
        ? row.theologySlug
        : FALLBACK_PREFERENCES.theologySlug,
    profileSlug:
      typeof row.profileSlug === 'string' && row.profileSlug
        ? row.profileSlug
        : FALLBACK_PREFERENCES.profileSlug,
    question:
      typeof row.question === 'string'
        ? resolveQuestion(row.question)
        : FALLBACK_PREFERENCES.question,
  };
}

export function resolvePreferences(
  stored: Preferences,
  catalogs: {
    theologies: { slug: string; is_default: boolean }[];
    profiles: { slug: string; is_default: boolean }[];
  },
): Preferences {
  const theologySlug = catalogs.theologies.some((row) => row.slug === stored.theologySlug)
    ? stored.theologySlug
    : pickDefaultSlug(catalogs.theologies, FALLBACK_PREFERENCES.theologySlug);
  const profileSlug = catalogs.profiles.some((row) => row.slug === stored.profileSlug)
    ? stored.profileSlug
    : pickDefaultSlug(catalogs.profiles, FALLBACK_PREFERENCES.profileSlug);
  return { theologySlug, profileSlug, question: stored.question };
}

export async function loadPreferences(): Promise<Preferences> {
  const data = await browser.storage.local.get(PREFERENCES_STORAGE_KEY);
  return parsePreferences(data[PREFERENCES_STORAGE_KEY]);
}

export async function savePreferences(prefs: Preferences): Promise<void> {
  await browser.storage.local.set({ [PREFERENCES_STORAGE_KEY]: prefs });
}
