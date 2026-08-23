const DEFAULT_BASE_URL = 'https://api.gamaliel.ai/v1';

export type TheologyOption = {
  slug: string;
  name: string;
  description: string;
  is_default: boolean;
};

export type ProfileOption = {
  slug: string;
  name: string;
  description: string;
  is_default: boolean;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : null;
}

function asOption(value: unknown): { slug: string; name: string; description: string; is_default: boolean } | null {
  const row = asRecord(value);
  if (!row || typeof row.slug !== 'string' || !row.slug) return null;
  return {
    slug: row.slug,
    name: typeof row.name === 'string' && row.name ? row.name : row.slug,
    description: typeof row.description === 'string' ? row.description : '',
    is_default: row.is_default === true,
  };
}

export function parseTheologies(data: unknown): TheologyOption[] {
  const list = asRecord(data)?.theologies;
  if (!Array.isArray(list)) return [];
  return list.map(asOption).filter((row): row is TheologyOption => row !== null);
}

export function parseProfiles(data: unknown): ProfileOption[] {
  const list = asRecord(data)?.profiles;
  if (!Array.isArray(list)) return [];
  return list.map(asOption).filter((row): row is ProfileOption => row !== null);
}

export function pickDefaultSlug(
  options: { slug: string; is_default: boolean }[],
  fallback: string,
): string {
  return options.find((row) => row.is_default)?.slug ?? options[0]?.slug ?? fallback;
}

export async function fetchTheologies(
  baseURL = DEFAULT_BASE_URL,
): Promise<TheologyOption[]> {
  const response = await fetch(`${baseURL}/theologies`);
  if (!response.ok) {
    throw new Error('Could not load theologies.');
  }
  return parseTheologies(await response.json());
}

export async function fetchProfiles(
  baseURL = DEFAULT_BASE_URL,
): Promise<ProfileOption[]> {
  const response = await fetch(`${baseURL}/profiles`);
  if (!response.ok) {
    throw new Error('Could not load profiles.');
  }
  return parseProfiles(await response.json());
}
