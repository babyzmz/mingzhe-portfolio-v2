export type CaseTile = { title: string; body: string };
export type CaseStudy = {
 tagline: string; purpose: string; audience: string; scenario: string; workflowNote: string;
 workflow: CaseTile[]; capabilities: CaseTile[]; development: string; decisions: CaseTile[];
 relationship: string; terms: CaseTile[];
};
