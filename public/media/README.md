# public/media

Approved, public-safe project media lives here under per-project folders:

```
media/<project-id>/<file>.webp|.mp4|.webm|...
```

Rules:

- Only append media captured from the real running program (or owner-supplied
  captures that were explicitly approved). No fabricated product screenshots.
- Every file must be registered in `src/project-media.ts` with bilingual
  alt/caption/provenance, evidence kind, capture date and source version.
- Files here ship in the static (`preview/`) and network (`dist/`) editions.
  They are never inlined into the standalone single-file HTML; that edition
  keeps text plus labelled illustrations only.
- Keep secrets, local paths, personal data and model weights out of this tree.
- Prefer WebP for screenshots and MP4 (H.264) + WebM for recordings.
