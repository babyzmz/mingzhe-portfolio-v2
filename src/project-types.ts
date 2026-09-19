/**
 * Public project media and link model (T3).
 *
 * These types are shared by project-media.ts and project-links.ts so the two
 * registries never maintain divergent copies of ProjectId / Localized.
 * Everything in src/ is public-safe by design: full local paths, private
 * remotes and unsanitised captures live only in .handoff-private/.
 */
export type ProjectId =
 | 'fairy' | 'core' | 'claw' | 'ax' | 'dreambound'
 | 'webchange' | 'goodnight' | 'tarot' | 'converter';

export const PROJECT_IDS: ProjectId[] = [
 'fairy', 'core', 'claw', 'ax', 'dreambound',
 'webchange', 'goodnight', 'tarot', 'converter'
];

export type Localized = { en: string; zh: string };

/** How a piece of evidence was actually obtained. */
export type EvidenceKind =
 | 'source-reviewed'   // reviewed source code / documentation
 | 'runtime-recorded'  // screenshot/recording of the program actually running
 | 'owner-supplied'    // provided by the project owner
 | 'illustrative';     // presentation illustration, no runtime claim

export type MediaType = 'screenshot' | 'video' | 'diagram' | 'illustration';

/**
 * Public manifest entry for one media item.
 * src is a public site-relative path under an allowed route (e.g. ./media/fairy/x.webp)
 * or an approved https URL. Withheld items never render in the public site.
 */
export type ProjectMedia = {
 id: string;
 projectId: ProjectId;
 type: MediaType;
 src: string;
 poster?: string;
 width: number;
 height: number;
 alt: Localized;
 caption: Localized;
 evidenceKind: EvidenceKind;
 /** Free-text provenance note shown under the media, e.g. "native window capture". */
 provenance: Localized;
 capturedAt: string | null;   // ISO date, or null when not captured from a run
 versionLabel: string | null; // source version/commit the media was captured from
 claimIds: string[];         // project claims this media supports
 publication: 'approved' | 'withheld';
};

export type LinkKind = 'source' | 'demo' | 'download' | 'record';
export type LinkAccess = 'public' | 'restricted';
export type LinkVerification = 'verified' | 'unverified';
export type LinkPublication = 'approved' | 'withheld';

/**
 * One external/project entry point. The four kinds are rendered differently:
 * source code, real online demo, installer download, original project record.
 * Uploading to GitHub is never treated as "running online".
 */
export type ProjectLink = {
 kind: LinkKind;
 url: string;
 label: Localized;
 /** Short note when access is restricted (login, permission, appointment). */
 accessNote?: Localized;
 verifiedAt: string | null;  // ISO date of the last real fetch/verification
 access: LinkAccess;
 verification: LinkVerification;
 publication: LinkPublication;
};
