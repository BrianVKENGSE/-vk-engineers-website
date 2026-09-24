# VK Engineers Website

This folder contains **two complete versions** of the VK Engineers website so the
team can compare them and pick one. Both are plain HTML/CSS files — no build
tools, no framework, no subscription, no special software. Open any `.html` file
in a text editor (Notepad, VS Code, etc.) to edit it, or double-click it to
preview it in a browser.

```
index.html      A comparison page linking to both versions (internal use only)
README.md        This guide
simple/          Version A — Simple  (plain HTML, no JavaScript)
advanced/        Version B — Advanced (illustrated, animated, shared menu/footer)
```

**To make the site live:** upload the *contents* of ONE folder (`simple/` or
`advanced/`) as the website root. Don't upload the comparison `index.html`.

**Before going live, remove the review bar** — the thin dark strip at the very
top of every page that says "Reviewing Version A/B" with links to switch
versions. It exists only for the comparison. In `simple/`, delete the block
marked `<!-- REVIEW BAR -->` at the top of each of the 5 pages. In
`advanced/`, delete the one block marked `<!-- REVIEW BAR -->` near the top
of `js/partials.js` (it's shared by all pages).

---

## Version A — `simple/`

**What it is:** clean, light, minimal. Five pages, one stylesheet, zero JavaScript.

```
simple/index.html      Home
simple/about.html      About — mission, map, Five Agreements, principals, team
simple/services.html   Services
simple/projects.html   Projects (grouped lists: Current / Restaurants / Past)
simple/contact.html    Contact info + inquiry form + consultation request
simple/css/styles.css  All colors and layout
```

**How to edit it**

- **Any text on a page:** open that page's `.html` file, find the text (Ctrl+F),
  change it, save. Every section starts with a comment like `<!-- HERO -->`
  or `<!-- FIVE AGREEMENTS -->` so you can find it fast.
- **The menu or footer:** they are written out in *each* of the 5 pages
  (that's the trade-off for having no JavaScript). Change it in one file, then
  copy the same change to the other four.
- **Add or remove a project:** open `simple/projects.html`, copy one line like
  `<li>Orange Cafe <span>Glendale, CA</span></li>`, paste it in the right
  group, change the name and city.
- **Colors:** open `simple/css/styles.css` — the `:root` block at the top
  lists every color used, with a comment saying what each one is for.
- **The year in the footer** (`© 2026`) is typed in each page — update it
  once a year, or leave it.
- **Forms:** submitting opens the visitor's email app with the message filled
  in, addressed to info@vkengse.com. No setup needed. (See "Forms" below to
  upgrade.)

---

## Version B — `advanced/`

**What it is:** dark editorial design with custom structural illustrations,
scroll animations, animated stats, hover previews, and a filterable project
gallery where every project has its own page.

```
advanced/index.html         Home
advanced/about.html         About
advanced/services.html      Services
advanced/projects.html      Projects — filterable grid
advanced/project.html       One project's page (fills itself in — see below)
advanced/contact.html       Contact + consultation request
advanced/css/styles.css     All colors, fonts, spacing — variables at the top
advanced/js/partials.js     The menu + footer (shared by every page)
advanced/js/projects-data.js  The project list — one entry per project
advanced/js/script.js       Animations, filters, popovers, forms
```

**How to edit it**

- **Any text on a page:** same as Version A — open the page, Ctrl+F, edit.
  Sections are labeled with comments.
- **The menu or footer (all pages at once):** open `advanced/js/partials.js`
  and edit the HTML inside the `SITE_HEADER` / `SITE_FOOTER` text near the
  top. Save, and every page updates.
- **Add, remove, or edit a project:** open `advanced/js/projects-data.js`,
  copy one `{ ... }` entry and change its fields. The comment at the top
  explains each field (name, location, `status`, `discipline`, square
  footage, description, photos). Both the Projects grid and that project's
  own page (`project.html#its-slug`) build themselves from this list.
- **Add real photos:** drop images into `advanced/images/`, then:
  - Team/principal photos — replace the initials circles in `about.html`.
  - Project photos — set `images.actual` / `images.render` on that project's
    entry in `projects-data.js`.
  - The hero illustration on the homepage is a drawn structural frame (inline
    SVG in `index.html`). Swap it for an `<img>` when you have a hero photo.
- **Colors or fonts:** `advanced/css/styles.css` — the `:root` block at the
  top. Note: the site deliberately uses no italics anywhere.
- **Animations:** they're automatic and respect the visitor's
  "reduce motion" setting. To turn them off entirely, delete the
  "Scroll-reveal" and "Animated stat counters" blocks at the top of
  `advanced/js/script.js`.

---

## The logo (both versions)

Each version has its own `images` folder holding three files, made from the
company logo you supplied:

```
logo.png        the logo in its normal colours — used on white backgrounds
logo-light.png  the same logo with the grey "V" turned white — used on the
                dark navy header and footer of Version B
favicon.png     the small "VK" icon shown on the browser tab
```

**To change the logo later,** replace these files with new ones **using the
same file names**. Nothing else needs editing. Use PNG files with a
transparent background so no white box appears behind the logo.

**To make the logo bigger or smaller,** open that version's stylesheet and
change a height value. In `simple/css/styles.css` look for `.brand img`
(header) and `.brand-foot img` (footer). In `advanced/css/styles.css` look
for `.logo-img` (header) and `.logo-img-foot` (footer).

The blue used across both sites (`#0372ba`) is taken from the logo, so the
site and the logo match exactly.

---

## Forms (both versions)

Both versions have two forms on the Contact page:

- **Send Inquiry** — a general project inquiry.
- **Request Consultation** — intentionally a *request*, not an instant booking.
  The visitor proposes a time and topic; a principal confirms by email. Nothing
  is added to any calendar automatically, so the schedule stays under your
  control.

Right now, submitting either form opens the visitor's email app with the
message pre-filled. That works with zero setup. If you'd rather collect
submissions in a dashboard (and receive them even when the visitor has no
email app configured), sign up for a free [Formspree](https://formspree.io)
form, then change the `<form ...>` tag's `action` to the URL they give you
(and in Version B, delete that form's submit handler in `js/script.js`).

If you later want real calendar-synced booking, Calendly or Google Calendar
"appointment schedules" both offer a *requires confirmation* mode that keeps
the same approval control.

---

## Editing the live site on GitHub (no software, no AI)

The website lives in a GitHub repository owned by the firm's GitHub account.
GitHub Pages publishes whatever is in that repository, so **editing a file on
github.com updates the live website automatically**, usually within a minute.

**To change text on a page**

1. Sign in to github.com with the firm account and open the website repository.
2. Click into the folder (`simple/` or `advanced/`) and click the page to edit,
   for example `about.html`.
3. Click the **pencil icon** (top right of the file, "Edit this file").
4. Use Ctrl+F to find the text and change it. Only change words between tags.
   Leave anything inside `< >` alone unless you know what it does.
5. Click the green **Commit changes...** button, then **Commit changes** again.
6. Wait about a minute and refresh the live site.

**To add a photo or logo**

1. Open the folder of the version you're editing and click
   **Add file > Upload files**. Drag the image in and click **Commit changes**.
2. Edit the page and reference the image by its file name, for example
   `<img src="logo.png" alt="VK Engineers">`.

**If something breaks:** every save is kept. Open the file, click
**History**, pick the last good version, and copy its contents back. Nothing
is ever lost.

**To edit on a computer instead:** click the green **Code** button, then
**Download ZIP**. Edit the files in Notepad, then upload the changed files
with **Add file > Upload files**.

**Who can edit:** anyone the firm account adds under the repository's
**Settings > Collaborators**. Keep the account under a work email so it
stays with the firm when people leave.

---

## Making it live

Static files can be hosted almost anywhere for free or very cheap:

- **Netlify Drop** — drag the chosen folder onto https://app.netlify.com/drop.
  Live in seconds with a free URL; no account needed to start.
- **GitHub Pages** — free hosting *and* a browser-based editor (click any
  file, hit the pencil icon, edit, save). Good long-term home.
- **Any web host** (GoDaddy, Hostinger, etc.) — upload the folder's contents
  via their file manager.

To use your own domain (`vkengse.com`, which the firm already owns for
email), point it at whichever host you choose — a few-minute DNS step,
documented by every host above.

---

## What still needs real content

- **Photos** — team headshots, the office, and project photos. Version B has
  clean placeholders that swap for images; Version A simply has no image
  slots yet (add `<img>` tags where you'd like them).
- **Project details** — most projects only had a name and city in the source
  material. In Version B, each project page shows a "details coming soon"
  note until you add a description, square footage, and photos in
  `projects-data.js`.
- **Civil and Specialty example projects** — none were listed yet, so those
  filter tabs in Version B are empty until you add some.
