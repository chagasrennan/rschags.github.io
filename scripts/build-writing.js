const fs = require("fs");
const path = require("path");
const {JSDOM} = require("jsdom");

const ROOT = path.resolve(__dirname, "..");
const CONTENT = path.join(ROOT, "content/writing");
const OUTPUT = path.join(ROOT, "public/writing");
const ORIGIN = "https://rchags.dev";
const LABELS = {post: "Blog post", whitepaper: "White paper"};
const escapeHTML = value =>
  String(value).replace(
    /[&<>"']/g,
    char =>
      ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[
        char
      ])
  );

function contentFile(relative) {
  const absolute = path.resolve(CONTENT, relative);
  if (!absolute.startsWith(CONTENT + path.sep)) {
    throw new Error(`Content must be inside content/writing: ${relative}`);
  }
  return absolute;
}

function loadPublications({includePDFs = true} = {}) {
  const publications = JSON.parse(
    fs.readFileSync(path.join(CONTENT, "publications.json"), "utf8")
  );
  const routes = new Set(["/writing/", "/writing/assets/"]);
  const ids = new Set();
  for (const publication of publications) {
    if (ids.has(publication.id) || !/^[a-z0-9-]+$/.test(publication.id)) {
      throw new Error(`Invalid or duplicate publication id: ${publication.id}`);
    }
    ids.add(publication.id);
    if (publication.doi && !/^10\.\d{4,9}\/\S+$/.test(publication.doi)) {
      throw new Error(`Invalid DOI: ${publication.id}`);
    }
    for (const asset of publication.assets || []) {
      if (
        path.isAbsolute(asset) ||
        asset.split("/").includes("..") ||
        !fs.existsSync(contentFile(asset))
      ) {
        throw new Error(`Invalid or missing publication asset: ${asset}`);
      }
    }
    if (
      !LABELS[publication.type] ||
      !/^\d{4}-\d{2}-\d{2}$/.test(publication.date) ||
      Number.isNaN(Date.parse(publication.date)) ||
      !publication.translations.en
    ) {
      throw new Error(
        `Invalid type, date, or missing English version: ${publication.id}`
      );
    }
    for (const [lang, item] of Object.entries(publication.translations)) {
      if (
        !/^[a-z]{2}(-[A-Z]{2})?$/.test(lang) ||
        !/^\/writing\/(?:[a-z0-9-]+\/)+$/.test(item.path) ||
        item.path.startsWith("/writing/assets/") ||
        routes.has(item.path)
      ) {
        throw new Error(`Invalid or duplicate publication route: ${item.path}`);
      }
      routes.add(item.path);
      const image = item.socialImage || publication.socialImage;
      if (image) {
        if (
          !image.source ||
          !/\.(png|jpe?g|webp)$/i.test(image.source) ||
          !fs.existsSync(contentFile(image.source)) ||
          !image.alt ||
          !Number.isInteger(image.width) ||
          image.width <= 0 ||
          !Number.isInteger(image.height) ||
          image.height <= 0
        ) {
          throw new Error(`Invalid social image: ${publication.id}/${lang}`);
        }
      }
      if (
        !item.title ||
        !item.summary ||
        !/\.(html|md)$/.test(item.source) ||
        !fs.existsSync(contentFile(item.source))
      ) {
        throw new Error(
          `Missing title, summary, or source: ${publication.id}/${lang}`
        );
      }
      if (item.pdf && includePDFs && !fs.existsSync(contentFile(item.pdf))) {
        throw new Error(
          `Missing ${item.pdf}. Run npm run writing:pdf to export it.`
        );
      }
    }
  }
  return publications.sort((a, b) => b.date.localeCompare(a.date));
}

function dateLabel(date, lang = "en") {
  return new Intl.DateTimeFormat(lang, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${date}T12:00:00Z`));
}

function header() {
  return `<a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <a class="brand" href="/"><span>&lt;</span> Rennan Chagas <span>/&gt;</span></a>
    <nav aria-label="Main navigation"><a href="/">Portfolio</a><a href="/writing/" aria-current="page">Writing</a><button class="theme-toggle" id="writing-theme-toggle" type="button">Theme</button></nav>
  </header>`;
}

function footer() {
  return `<footer class="site-footer"><span>Rennan Chagas · Data science &amp; optimization</span><a href="/#contact">Get in touch</a></footer>`;
}

function shell({title, summary, route, body, lang = "en"}) {
  return `<!doctype html><html lang="${lang}"><head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${escapeHTML(title)} · Rennan Chagas</title>
    <meta name="description" content="${escapeHTML(summary)}">
    <link rel="canonical" href="${ORIGIN}${route}">
    <meta property="og:type" content="${
      route === "/writing/" ? "website" : "article"
    }">
    <meta property="og:title" content="${escapeHTML(title)}">
    <meta property="og:description" content="${escapeHTML(summary)}">
    <meta property="og:url" content="${ORIGIN}${route}">
    <meta property="og:image" content="${ORIGIN}/android-chrome-384x384.png">
    <meta name="twitter:card" content="summary">
    <link rel="icon" href="/favicon.ico">
    <script src="/writing/assets/theme.js"></script>
    <link rel="stylesheet" href="/writing/assets/style.css">
  </head><body>${header()}${body}${footer()}</body></html>`;
}

function card(publication) {
  const en = publication.translations.en;
  return `<article class="writing-card">
    <div class="card-meta"><span class="kind">${
      LABELS[publication.type]
    }</span><time datetime="${publication.date}">${dateLabel(
    publication.date
  )}</time>${en.readTime ? `<span>${escapeHTML(en.readTime)}</span>` : ""}</div>
    <h3><a href="${en.path}">${escapeHTML(en.title)}</a></h3>
    <p>${escapeHTML(en.summary)}</p>
    <ul class="tags" aria-label="Topics">${(publication.tags || [])
      .map(tag => `<li>${escapeHTML(tag)}</li>`)
      .join("")}</ul>
    <div class="card-links">${Object.entries(publication.translations)
      .map(
        ([lang, item]) =>
          `<a href="${
            item.path
          }" lang="${lang}" hreflang="${lang}" aria-label="${escapeHTML(
            item.title
          )} — ${lang === "pt" ? "Português" : "English"}">${
            lang === "pt" ? "Português" : "English"
          } <span aria-hidden="true">↗</span></a>`
      )
      .join("")}${
    publication.doi
      ? `<a href="${doiURL(
          publication.doi
        )}">DOI <span aria-hidden="true">↗</span></a>`
      : ""
  }</div>
  </article>`;
}

function doiURL(doi) {
  return `https://doi.org/${encodeURIComponent(doi).replace(/%2F/gi, "/")}`;
}

function setMeta(document, key, value, property = false) {
  const attr = property ? "property" : "name";
  let element = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attr, key);
    document.head.append(element);
  }
  element.content = value;
}

function addLink(document, attributes) {
  const element = document.createElement("link");
  for (const [key, value] of Object.entries(attributes))
    element.setAttribute(key, value);
  document.head.append(element);
}

function metadata(document, publication, lang) {
  const item = publication.translations[lang];
  const url = ORIGIN + item.path;
  document.documentElement.lang = lang;
  document.title = `${item.title} · Rennan Chagas`;
  document
    .querySelectorAll(
      'link[rel="canonical"], link[rel="alternate"][hreflang], script[type="application/ld+json"]'
    )
    .forEach(el => el.remove());
  addLink(document, {rel: "canonical", href: url});
  addLink(document, {rel: "icon", href: "/favicon.ico"});
  for (const [translationLang, translation] of Object.entries(
    publication.translations
  )) {
    addLink(document, {
      rel: "alternate",
      hreflang: translationLang,
      href: ORIGIN + translation.path
    });
  }
  addLink(document, {
    rel: "alternate",
    hreflang: "x-default",
    href: ORIGIN + publication.translations.en.path
  });
  setMeta(document, "description", item.summary);
  setMeta(document, "author", "Rennan Chagas");
  if (publication.doi) setMeta(document, "citation_doi", publication.doi);
  setMeta(document, "og:title", item.title, true);
  setMeta(document, "og:description", item.summary, true);
  setMeta(document, "og:url", url, true);
  setMeta(document, "og:type", "article", true);
  setMeta(document, "og:locale", lang === "pt" ? "pt_BR" : "en_US", true);
  const image = item.socialImage || publication.socialImage;
  const imageURL = image
    ? `${ORIGIN}/writing/assets/${image.source}`
    : `${ORIGIN}/android-chrome-384x384.png`;
  // Replace inherited image tags so crawlers receive one unambiguous preview.
  document
    .querySelectorAll(
      'meta[property^="og:image"], meta[name="twitter:image"], meta[name="twitter:image:alt"]'
    )
    .forEach(el => el.remove());
  setMeta(document, "og:image", imageURL, true);
  setMeta(document, "og:image:secure_url", imageURL, true);
  setMeta(document, "og:image:width", image ? image.width : 384, true);
  setMeta(document, "og:image:height", image ? image.height : 384, true);
  setMeta(document, "og:image:alt", image ? image.alt : "Rennan Chagas", true);
  setMeta(
    document,
    "og:image:type",
    image
      ? {
          ".png": "image/png",
          ".jpg": "image/jpeg",
          ".jpeg": "image/jpeg",
          ".webp": "image/webp"
        }[path.extname(image.source).toLowerCase()]
      : "image/png",
    true
  );
  setMeta(document, "twitter:card", image ? "summary_large_image" : "summary");
  setMeta(document, "twitter:image", imageURL);
  setMeta(document, "twitter:image:alt", image ? image.alt : "Rennan Chagas");
  setMeta(document, "twitter:title", item.title);
  setMeta(document, "twitter:description", item.summary);
  setMeta(
    document,
    "article:published_time",
    `${publication.date}T00:00:00-03:00`,
    true
  );
  const structured = document.createElement("script");
  structured.type = "application/ld+json";
  structured.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type":
      publication.type === "whitepaper" ? "ScholarlyArticle" : "BlogPosting",
    headline: item.title,
    description: item.summary,
    inLanguage: lang,
    datePublished: publication.date,
    url,
    mainEntityOfPage: url,
    author: {"@type": "Person", name: "Rennan Chagas", url: ORIGIN},
    ...(publication.doi
      ? {
          identifier: {
            "@type": "PropertyValue",
            propertyID: "DOI",
            value: publication.doi,
            url: doiURL(publication.doi)
          }
        }
      : {}),
    ...(publication.version ? {version: publication.version} : {})
  }).replace(/</g, "\\u003c");
  document.head.append(structured);
}

async function renderArticle(publication, lang, publications, includePDFs) {
  const item = publication.translations[lang];
  const source = fs.readFileSync(contentFile(item.source), "utf8");
  let html = source;
  if (item.source.endsWith(".md")) {
    const {marked} = await import("marked");
    html = shell({
      title: item.title,
      summary: item.summary,
      route: item.path,
      lang,
      body: `<main class="writing-main" id="main"><header class="writing-hero"><p class="eyebrow">${
        LABELS[publication.type]
      } · ${dateLabel(publication.date, lang)}</p><h1>${escapeHTML(
        item.title
      )}</h1><p class="intro">${escapeHTML(
        item.summary
      )}</p></header><article class="prose">${marked.parse(
        source
      )}</article></main>`
    });
  }
  const dom = new JSDOM(html);
  const {document} = dom.window;
  metadata(document, publication, lang);

  // Rewrite only actual links, preserving the embedded data and chart scripts.
  const sourceLinks = new Map();
  for (const p of publications)
    for (const translation of Object.values(p.translations)) {
      sourceLinks.set(translation.source, translation.path);
    }
  for (const anchor of document.querySelectorAll("a[href]")) {
    const href = anchor.getAttribute("href");
    if (/^(?:[a-z]+:|\/|#)/i.test(href)) continue;
    const [file, fragment] = href.split("#");
    const resolved = path.posix.normalize(
      path.posix.join(path.posix.dirname(item.source), file)
    );
    if (sourceLinks.has(resolved))
      anchor.setAttribute(
        "href",
        sourceLinks.get(resolved) + (fragment ? `#${fragment}` : "")
      );
  }

  if (item.source.endsWith(".html")) {
    const pt = lang === "pt";
    const topbar = document.querySelector(".topbar");
    if (!topbar)
      throw new Error(`Missing article navigation in ${item.source}`);
    const brand = topbar.querySelector(".brand");
    brand.textContent = "Rennan Chagas";
    brand.setAttribute("href", "/");
    const writingLink = document.createElement("a");
    writingLink.href = "/writing/";
    writingLink.textContent = pt ? "Publicações" : "All writing";
    topbar.querySelector("nav").prepend(writingLink);
    const languageLink = topbar.querySelector("a[hreflang]");
    if (languageLink) {
      languageLink.className = "language-toggle";
      languageLink.dataset.language = lang;
      languageLink.lang = lang;
      const label = pt
        ? "Idioma: português. Mudar para inglês."
        : "Language: English. Switch to Portuguese.";
      languageLink.setAttribute("aria-label", label);
      languageLink.title = label;
      languageLink.innerHTML =
        '<span aria-hidden="true">🇺🇸</span><span aria-hidden="true">🇧🇷</span>';
    }

    const main = document.createElement("main");
    main.id = "main";
    while (
      topbar.nextSibling &&
      !(
        topbar.nextSibling.nodeType === 1 &&
        topbar.nextSibling.matches("footer.site")
      )
    ) {
      main.append(topbar.nextSibling);
    }
    topbar.after(main);
    const skip = document.createElement("a");
    skip.className = "writing-skip";
    skip.href = "#main";
    skip.textContent = pt ? "Pular para o conteúdo" : "Skip to content";
    document.body.prepend(skip);

    const integrationCSS = document.createElement("style");
    integrationCSS.textContent = `
      :root{--accent:#55198b;--accent-soft:#f0e8f8}
      :root[data-theme="dark"]{--accent:#cca5f2;--accent-soft:#30233f}
      :focus-visible{outline:3px solid var(--accent);outline-offset:4px}
      .writing-skip{position:absolute;top:-100px;left:16px;z-index:10;background:var(--surface);padding:10px}
      .writing-skip:focus{top:10px}
      .topbar .wide{padding-top:12px;padding-bottom:12px;gap:12px}
      .language-toggle{position:relative;isolation:isolate;display:inline-flex;align-items:center;flex-shrink:0;gap:2px;padding:4px;border:1px solid var(--line);border-radius:999px;background:var(--soft);text-decoration:none}
      .language-toggle::before{content:"";position:absolute;z-index:-1;top:4px;left:4px;width:36px;height:30px;border-radius:999px;background:var(--surface);box-shadow:0 1px 4px #0002;transition:transform .18s ease}
      .language-toggle[data-language="pt"]::before{transform:translateX(38px)}
      .language-toggle span{display:grid;place-items:center;width:36px;height:30px;font-family:"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif;font-size:23px;line-height:1;opacity:.55}
      .language-toggle[data-language="en"] span:first-child,.language-toggle[data-language="pt"] span:last-child{opacity:1}
      .language-toggle:hover{border-color:var(--accent)}
      @media(prefers-reduced-motion:reduce){.language-toggle::before{transition:none}}
      .publication-download{font-family:var(--sans);font-size:14px;margin:18px 0}
      @media(max-width:600px){.topbar nav{gap:10px}.topbar .brand{width:100%}}
      @media print{
        :root,:root[data-theme="dark"]{color-scheme:light;--bg:#fff;--surface:#fff;--ink:#111;--ink2:#444;--muted:#555;--line:#ddd;--soft:#f5f5f5;--accent:#55198b;--accent-soft:#f6f0fa;--heat:31,78,140;--band:#9e7100;--bound:#b0aaa0}
        html{scroll-behavior:auto}body{font-size:10.5pt;line-height:1.5}
        .writing-skip,.publication-download,#tip,.controls,.seg,.theme-btn,.topbar,.toc,footer.site{display:none!important}
        .wrap,.wide{max-width:none;padding:0}header.hero{padding:0 0 10px}
        h1{font-size:30pt}h2{font-size:20pt;margin-top:28px;break-after:avoid}
        h3,figcaption{break-after:avoid}p{orphans:3;widows:3}
        figure.fig{margin:20px 0;break-inside:avoid}figure.fig h3{font-size:14pt}
        .fig-card{padding:12px;box-shadow:none}figure.fig svg{max-height:165mm;width:100%;height:auto}
        .stats{grid-template-columns:repeat(2,minmax(0,1fr));break-inside:avoid}
        .stat{padding:12px}.stat b{font-size:21px}.stat span{font-size:12px}
        .toy>label,.toy>div:has(input[type="range"]){display:none!important}
        details{break-inside:auto}footer.site{margin-top:24px;padding-bottom:0}
        @page{size:A4;margin:17mm}
      }`;
    document.head.append(integrationCSS);

    // Share the portfolio theme preference; keep the chart renderer's theme handling.
    const theme = [...document.head.querySelectorAll("script")].find(script =>
      script.textContent.includes("vt-theme")
    );
    if (theme)
      theme.textContent = `try{var t=localStorage.getItem('isDark');if(t==='true'||t==='false')document.documentElement.dataset.theme=t==='true'?'dark':'light'}catch(e){}`;
    for (const script of document.body.querySelectorAll("script:not([type])")) {
      script.textContent = script.textContent.replace(
        "localStorage.setItem('vt-theme', n)",
        "localStorage.setItem('isDark', JSON.stringify(n === 'dark'))"
      );
    }
    for (const byline of document.querySelectorAll(".byline")) {
      byline.innerHTML = byline.innerHTML.replace(
        /\bRennan\b(?! Chagas)/,
        "Rennan Chagas"
      );
    }
    if (item.pdf && includePDFs) {
      const download = document.createElement("p");
      download.className = "publication-download";
      const anchor = document.createElement("a");
      anchor.href = `/writing/assets/${path.basename(item.pdf)}`;
      anchor.setAttribute("download", path.basename(item.pdf));
      anchor.textContent = pt
        ? "Baixar whitepaper em PDF"
        : "Download white paper (PDF)";
      download.append(anchor);
      document.querySelector("header.hero").append(download);
    }
  } else {
    const languages = document.createElement("p");
    languages.className = "card-links";
    for (const [otherLang, other] of Object.entries(publication.translations)) {
      if (otherLang === lang) continue;
      const anchor = document.createElement("a");
      anchor.href = other.path;
      anchor.hreflang = otherLang;
      anchor.lang = otherLang;
      anchor.textContent = otherLang === "pt" ? "Português" : "English";
      languages.append(anchor);
    }
    if (item.pdf && includePDFs)
      languages.insertAdjacentHTML(
        "beforeend",
        `<a href="/writing/assets/${path.basename(
          item.pdf
        )}" download>Download PDF</a>`
      );
    document.querySelector(".writing-hero").append(languages);
  }
  if (publication.doi) {
    const citation = document.createElement("p");
    citation.className = "publication-doi";
    const link = document.createElement("a");
    link.href = doiURL(publication.doi);
    link.textContent = `DOI: ${publication.doi}`;
    citation.append(link);
    document.querySelector("header.hero, .writing-hero").append(citation);
  }
  const result = dom.serialize();
  dom.window.close();
  return result;
}

function write(relative, value) {
  const dest = path.join(OUTPUT, relative);
  fs.mkdirSync(path.dirname(dest), {recursive: true});
  fs.writeFileSync(dest, value);
}

async function build({includePDFs = true} = {}) {
  const publications = loadPublications({includePDFs});
  // OUTPUT is entirely generated; rebuilding also removes retired routes.
  fs.rmSync(OUTPUT, {recursive: true, force: true});
  for (const file of ["style.css", "theme.js"]) {
    write(`assets/${file}`, fs.readFileSync(path.join(CONTENT, file)));
  }
  const index = shell({
    title: "Writing",
    summary:
      "Thoughts and white papers on data science, optimization, and research by Rennan Chagas.",
    route: "/writing/",
    body: `<main class="writing-main" id="main"><header class="writing-hero"><p class="eyebrow">Notes &amp; research</p><h1>Writing</h1><p class="intro">Thoughts on data science and optimization, with a closer look at the methods behind the results.</p></header><section aria-labelledby="all-publications"><div class="index-label"><h2 id="all-publications">Posts &amp; white papers</h2><span>${
      publications.length
    } publications · English &amp; Português</span></div><div class="writing-grid">${publications
      .map(card)
      .join("")}</div></section></main>`
  });
  write("index.html", index);
  const sitemap = [`${ORIGIN}/`, `${ORIGIN}/writing/`];
  for (const publication of publications) {
    for (const asset of publication.assets || []) {
      write(`assets/${asset}`, fs.readFileSync(contentFile(asset)));
    }
    for (const [lang, item] of Object.entries(publication.translations)) {
      const image = item.socialImage || publication.socialImage;
      if (image)
        write(
          `assets/${image.source}`,
          fs.readFileSync(contentFile(image.source))
        );
      write(
        `${item.path.slice("/writing/".length)}index.html`,
        await renderArticle(publication, lang, publications, includePDFs)
      );
      sitemap.push(ORIGIN + item.path);
      if (item.pdf && includePDFs)
        write(
          `assets/${path.basename(item.pdf)}`,
          fs.readFileSync(contentFile(item.pdf))
        );
    }
  }
  fs.writeFileSync(
    path.join(ROOT, "public/sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemap
      .map(url => `<url><loc>${escapeHTML(url)}</loc></url>`)
      .join("")}</urlset>\n`
  );
  const cards = publications.map(publication => ({
    id: publication.id,
    type: LABELS[publication.type],
    date: publication.date,
    title: publication.translations.en.title,
    description: publication.translations.en.summary,
    url: publication.translations.en.path,
    ...(publication.doi
      ? {doi: publication.doi, doiURL: doiURL(publication.doi)}
      : {}),
    readTime: publication.translations.en.readTime || "Working paper",
    languages: Object.entries(publication.translations).map(([lang, item]) => ({
      lang,
      url: item.path
    }))
  }));
  fs.mkdirSync(path.join(ROOT, "src/generated"), {recursive: true});
  fs.writeFileSync(
    path.join(ROOT, "src/generated/writing.json"),
    JSON.stringify(cards, null, 2) + "\n"
  );
  console.log(`Built writing index and ${sitemap.length - 2} article pages.`);
  return publications;
}

if (require.main === module)
  build().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
module.exports = {
  build,
  loadPublications,
  renderArticle,
  contentFile,
  ROOT,
  CONTENT,
  OUTPUT
};
