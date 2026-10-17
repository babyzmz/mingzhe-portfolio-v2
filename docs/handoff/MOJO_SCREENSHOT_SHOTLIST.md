# Mojo screenshot shot list

Runtime screenshots for the MojoClaw, Mojo Core and MojoAX pages (`public/mojo/`) and their case-reader entries.
The source of truth is `src/mojo-shots.ts`; this document mirrors it (updated 2026-10-18). The table below is
sorted by priority.

## Summary

- **Captured and live (11):** all from the owner's MojoClaw desktop dev build, captured 2026-10-18.
  - MojoClaw page: `runtime-preview-dashboard` (hero), `runtime-preview-3d-page`, `plugins-four-sections`,
    `chat-markdown-table`, `inline-timeline`, `settings-local-tasks`.
  - Mojo Core page ("state comes from Mojo Core"): `session-info-popover` (hero), `plugins-mcp-builtin-server`,
    `project-checkpoint-card`, `settings-user-activity`, `settings-privacy-memory`.
- **Withheld (1):** the Settings → Models capture is not published because it names specific hosted models,
  which are not public for now. It is not in the manifest.
- **Not captured (4):** `changes-panel`, `mcp-trust-card`, `settings-legacy-typography` (MojoClaw),
  `launcher-status` (Core). Capture is finished for now; labelled placeholders stay.
- **MojoAX (2):** placeholders only, to be captured once a runnable team build exists.

## Media conventions

- Directory: `public/media/<product>/<kebab-name>.jpg` (same convention as `public/media/webchange/`).
  Mojo Core has no UI of its own, so Core-related captures of the MojoClaw UI live in `public/media/claw/`
  and are registered under the `core` product in the manifest.
- Format: JPEG, quality ≈ 3 on the ffmpeg scale (`-q:v 3`), metadata stripped. Keep the native capture
  resolution (no upscaling).
- Always crop out the left navigation column (conversation titles, project names, account email) and any
  home-directory path. Mask identity blocks (avatar, initials, email) with a flat fill. Never repaint
  product content; note every crop or mask in `privacy`.
- Do not publish specific model names or internal tool lists; crop them out or withhold the capture.
- English UI is preferred; Chinese content inside the app is fine.

## How to add a capture

1. Place the reviewed JPG at the path in the table.
2. In `src/mojo-shots.ts` set `status: 'captured'`, `capturedAt`, `versionLabel`, and correct `width`/`height`.
3. Run `npm run build:mojo`, then `npm test` (fails if a captured file is missing, a page is stale or
   non-public wording appears).
4. The capture then appears on the product page, in the case-reader gallery and, if first in its product,
   as the project card cover.

## Shot table

| # | Priority | Product | File (under public/) | Size | Status | Screen | State to capture | Privacy |
|---|---|---|---|---|---|---|---|---|
| 1 | P0 | claw | `media/claw/runtime-preview-dashboard.jpg` | 1298×818 | Captured — live on site | Project chat with the runtime preview pane open on the right. | A generated "digital twin city dashboard" project running in the secure preview: 3D scene, live curve and metric tiles; checkpoint card visible in the chat. | Left navigation (conversation titles, account) cropped out. Dashboard data is labelled SAMPLE in the page itself. |
| 2 | P0 | claw | `media/claw/runtime-preview-3d-page.jpg` | 776×782 | Captured — live on site | Right-hand preview pane (Preview / Mojo Surface / Browser / Files tabs). | A single-file 3D web page generated from one prompt, running in the preview with its own controls. | Cropped to the preview pane only; the chat column (including an older validation notice) is excluded. |
| 3 | P0 | claw | `media/claw/plugins-four-sections.jpg` | 1236×818 | Captured — live on site | Plugins & Capabilities page, top of the page. | Section chips for Rule files, Skills, MCP servers, Prompts and resources, plus the single "New or import" entry; rule files and built-in skills listed. | Left navigation (recent conversations, account email) cropped out. |
| 4 | P0 | claw | `media/claw/settings-local-tasks.jpg` | 912×858 | Captured — live on site | Settings → Local tasks. | Bound folders with permission presets (Analysis only / Work inside the project / Strong isolation / Extend once) and the per-capability "Remote control of this computer" switches. | Cropped to the settings content panel; the settings navigation with the account email is excluded. |
| 5 | P0 | core | `media/claw/session-info-popover.jpg` | 1080×848 | Captured — live on site | Chat header → ⓘ Conversation info popover. | Environment (cloud device, project, remote control off), context usage 16% with its breakdown, connectors & plugins, and outputs. | Left navigation (project list, account) cropped out. |
| 6 | P0 | core | `media/claw/plugins-mcp-builtin-server.jpg` | 1236×400 | Captured — live on site | Plugins & Capabilities → MCP servers. | Cloud and this-device groups (both empty), and the header of the Core-provided built-in browser server card (cropped above its tool list). | Left navigation (recent conversations, account email) cropped out; cropped above the tool list. |
| 7 | P1 | claw | `media/claw/chat-markdown-table.jpg` | 1080×848 | Captured — live on site | Chat reply area. | A finished reply containing a Markdown table (a short-video shot script) and the follow-up action "Generate as document". | Left navigation (project and folder names, account) cropped out. |
| 8 | P1 | claw | `media/claw/inline-timeline.jpg` | 1192×840 | Captured — live on site | Chat reply with an intelligent-UI component. | A two-lane timeline component (product and marketing) rendered inside the reply for a fictional launch plan. | Left navigation (projects, recent conversations, account email) cropped out. Plan content is fictional. |
| 9 | P1 | claw | `media/claw/changes-panel.jpg` | 1600×1000 | Not captured — placeholder shown | Bound-folder project → Conversation info → Changes → "View changes". | After a run edited files in a bound folder: +added ~modified −deleted counts, a diff open, and the Undo action visible. | Use a throwaway folder; crop the left navigation and any home-directory path. |
| 10 | P1 | claw | `media/claw/mcp-trust-card.jpg` | 1600×1000 | Not captured — placeholder shown | Chat, first use of an MCP server inside a project. | The one-time trust card listing server identity, account, tool groups, data scope and allowed side effects. | Use a local test server; no tokens or account names on screen. |
| 11 | P1 | core | `media/claw/project-checkpoint-card.jpg` | 1080×848 | Captured — live on site | Project chat, finished run. | Reply that names the changed file, then the project card: v14 · Checkpoint #13 · Saved · Preview available · 11 files. | Left navigation (project and folder names, account) cropped out. |
| 12 | P1 | core | `media/claw/settings-user-activity.jpg` | 912×858 | Captured — live on site | Settings → User details. | Core-owned profile, the 365-day activity heatmap from Core history, longest chat and streak counters. | Cropped to the settings content panel; avatar, initials and email masked with a flat block. |
| 13 | P1 | core | `media/claw/settings-privacy-memory.jpg` | 912×858 | Captured — live on site | Settings → Privacy → Memory. | Use-memory and suggest-memory switches, semantic recall usage, and memory entries with their source run and "Source chat" link. | Cropped to the settings content panel; the settings navigation with the account email is excluded. |
| 14 | P2 | ax | `media/ax/surface-on-demand.jpg` | 1600×1000 | Planned — capture after a runnable build | MojoAX web workbench, a task with one summoned surface. | Only when AX work resumes and the workflow runs against Core end to end. | Demo tenant only; no customer or colleague data. |
| 15 | P2 | ax | `media/ax/governance.jpg` | 1600×1000 | Planned — capture after a runnable build | MojoAX tenant switcher and approval view. | Only when SSO and tenant flows are re-verified against Core. | Demo tenant only; no real identity provider data. |
| 16 | P2 | claw | `media/claw/settings-legacy-typography.jpg` | 1600×1000 | Not captured — placeholder shown | Settings → Preferences → "Legacy typography". | The switch shown off (unified type scale on), with a chat visible behind for comparison. | Crop to the settings content panel. |
| 17 | P2 | core | `media/core/launcher-status.jpg` | 1600×1000 | Not captured — placeholder shown | Terminal: the local launcher status command. | Gateway, workers, preview and Claw services healthy, pinned versions and migration level listed. | Redact ports, home paths, hostnames and any environment values; keep only service names and states. |
