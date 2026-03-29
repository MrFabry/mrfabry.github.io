# Security Policy

## Scope

This repository contains the source code for a **static personal portfolio website** hosted on GitHub Pages ([mrfabry.github.io](https://mrfabry.github.io)). There is no backend, no database, no user authentication, and no stored user data beyond anonymised Google Analytics events.

The following are **in scope** for security reports:

- Malicious or injected content in the deployed site
- Exposed personal data or credentials accidentally committed to the repository
- Compromised third-party scripts or CDN resources referenced by the site
- Vulnerabilities in the GitHub Pages deployment configuration

The following are **out of scope**:

- Issues with GitHub Pages infrastructure itself (report these to GitHub)
- Issues with Google Analytics (report these to Google)
- Theoretical vulnerabilities with no practical impact on a static site

---

## Reporting a Vulnerability

If you discover a security issue, please **do not open a public GitHub issue**.

Contact me directly:

- **Email:** [pasini.fa@gmail.com](mailto:pasini.fa@gmail.com)
- **Subject line:** `[SECURITY] mrfabry.github.io — brief description`

Please include:

1. A clear description of the issue
2. Steps to reproduce or proof of concept
3. The potential impact you see

I will acknowledge your report within **48 hours** and aim to resolve confirmed issues within **7 days**. I will credit you in the commit message if you wish.

---

## No Versioning

This is a continuously deployed static site with no versioned releases. The `main` branch reflects what is live at all times. There are no legacy versions requiring separate security maintenance.
