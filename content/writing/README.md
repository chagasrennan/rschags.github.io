# Publishing writing

`publications.json` is the shared catalog for the portfolio, writing index, and
article metadata. Each entry is one publication; translations are language
variants of that publication. The build sorts by publication date, showing the
three most recent entries on the homepage.

## Write a Markdown post

1. Create `content/writing/my-post/post-en.md` with the article body. The page
   template supplies the title, summary, date, navigation, and theme toggle.
2. Add this entry to `publications.json`:

```json
{
  "id": "my-post",
  "type": "post",
  "date": "2026-11-01",
  "tags": ["Optimization"],
  "translations": {
    "en": {
      "title": "My post title",
      "summary": "A short description for the index and sharing previews.",
      "path": "/writing/my-post/",
      "source": "my-post/post-en.md",
      "readTime": "5 min read"
    }
  }
}
```

Use `##` for section headings; the template provides the page's `h1`. Markdown
supports tables, links, figures, and fenced code blocks. Repository content is
trusted author-written content, so inline HTML is preserved. For local figures,
add `"assets": ["my-post/chart.png"]` to the publication and reference the image
as `/writing/assets/my-post/chart.png` in the Markdown. Asset filenames should
not duplicate a PDF or the shared `style.css`/`theme.js` files.

Add a `pt` translation with its own title, summary, source, and a path such as
`/writing/my-post/pt/` to offer Portuguese. Both versions get reciprocal language
links. Publication types are `post` and `whitepaper`; a white paper can include
`"version": "1.0"` at the publication level.

After publishing on Zenodo, add `"doi": "10.5281/zenodo.<record-number>"`
to the publication entry using the actual registered DOI. Do not add a reserved
or placeholder DOI. The build adds its link to both language editions, the
writing index and homepage cards, plus citation and structured metadata.

## Build, preview, and check

Use Node 20 or newer and install dependencies with `npm ci`.

```sh
npm start
```

The start/build/test lifecycle generates writing before React starts. After
editing the catalog or article sources while the dev server is running, run
`npm run writing:build` again and refresh the page. Homepage data reloads through
React's file watcher.

```sh
npm run build
npm run writing:check -- --production
python3 -m http.server 8000 --directory build
```

Visit `http://localhost:8000/writing/` or any article URL directly. Generated files
in `public/writing/`, `public/sitemap.xml`, and `src/generated/` are ignored by Git.
The source articles, catalog, styles, and PDF downloads are tracked here. Builds
do not need the original research project, a database, or a content service.

Optional browser checks use Playwright with installed Google Chrome, or its
bundled Chromium if present. Set `WRITING_BROWSER_EXECUTABLE` for another Chromium
installation. To install bundled Chromium, use `npx playwright install chromium`.

```sh
npm run writing:check -- --production --browser
```

This verifies chart rendering, geography/scenario filters, mobile widths, shared
theme preferences, language navigation, and PDF downloads. The static checks
also verify local links, anchors, metadata, Markdown rendering, and that imported
research data is unchanged.

## First publications: Brazil vote transfers

The four `brazil-2026-vote-transfers/*.html` files are verbatim snapshots from the
research project's `site/` folder. The research generator remains the source of
the article text and interactive visualizations. `provenance.json` records their
hashes and the matching report hash at import. The website build integrates
navigation, metadata, theme preferences, author attribution, and PDF links while
preserving the embedded dataset and charts.

To update these publications:

1. Regenerate the intended publication version in the research project, following
   its `site/README.md`. Confirm the public pages reflect the intended results.
2. Copy the four HTML files into this content folder and update the provenance
   hashes. Do not copy raw datasets or research dependencies into the website.
3. Update publication dates or versions in the catalog when appropriate, then
   regenerate PDFs and rerun the checks.

## Social sharing previews

Set `socialImage` inside a translation to choose the image used when its URL is
shared on WhatsApp and other platforms. The image affects sharing metadata;
homepage cards and the browser-tab icon are unchanged. Example:

```json
"socialImage": {
  "source": "my-post/share-pt.png",
  "alt": "My post title — Rennan Chagas",
  "width": 1200,
  "height": 630
}
```

Paths are relative to `content/writing`. PNG, JPEG and WebP are supported.
The build copies the image and writes absolute Open Graph and Twitter image URLs
in the generated HTML. A publication-level `socialImage` can supply a shared
fallback for its translations. Use a new filename when replacing a preview
image, since social platforms can cache the old URL.

To export title covers from the catalog with the site's font:

```sh
node scripts/export-social-images.js
npm run writing:build
```

The export requires Chrome and updates each translation's `socialImage` with a
content-based filename. These cover images are tracked in Git.

## PDF exports

The white papers have tracked English and Portuguese PDFs. Their `pdf` fields
refer to paths relative to this content directory. The build publishes them at
`/writing/assets/<filename>.pdf`; filenames must be unique.

```sh
npm run writing:pdf
```

The export command starts a temporary local server, opens headless Chrome,
renders the charts in print layout, expands supplementary details, exports both
languages, and rebuilds the pages with download links. PDFs contain the default
national scenario; interactive filters remain available in the HTML publication.
Inspect the exported figures and pagination after changes. Ordinary website
builds reuse the tracked PDFs and never launch a browser.

To deploy the reviewed production build through the existing GitHub Pages setup:

```sh
npm run deploy
```
