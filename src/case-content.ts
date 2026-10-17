import {shixuCases} from './shixu-content.js';
import {aiCases} from './case-ai-content.js';
import {archiveCases} from './case-archive-content.js';
import {mojoCases} from './mojo-content.js';
import type {CaseStudy} from './case-types.js';
import type {Locale} from './state.js';
export type {CaseTile,CaseStudy} from './case-types.js';
// Explanatory examples remain distinct from runtime verification and source claims.
export const caseStudies: Record<string, Record<Locale, CaseStudy>> = {...aiCases,...archiveCases,...shixuCases,...mojoCases};
