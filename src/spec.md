# Specification

## Summary
**Goal:** Verify the site in Google Search Console by adding the provided verification meta tag.

**Planned changes:**
- Add the provided `<meta name="google-site-verification" ...>` tag inside the `<head>` of `frontend/index.html`.
- Ensure the meta tag appears exactly once in the rendered document `<head>` when the site is loaded.

**User-visible outcome:** Google Search Console can detect the verification tag on the site for ownership verification.
