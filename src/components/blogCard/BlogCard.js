import React from "react";
import "./BlogCard.scss";

export default function BlogCard({blog, isDark}) {
  const date = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${blog.date}T12:00:00Z`));

  return (
    <article
      className={`writing-preview${isDark ? " writing-preview-dark" : ""}`}
    >
      <div className="writing-preview-meta">
        <span className="writing-preview-kind">{blog.type}</span>
        <time dateTime={blog.date}>{date}</time>
      </div>
      <h2 className="writing-preview-title">
        <a href={blog.url}>{blog.title}</a>
      </h2>
      <p className="writing-preview-summary">{blog.description}</p>
      <div className="writing-preview-links">
        {blog.languages.map(({lang, url}) => (
          <a
            key={lang}
            href={url}
            lang={lang}
            hrefLang={lang}
            aria-label={`${blog.title} — ${
              lang === "pt" ? "Português" : "English"
            }`}
          >
            {lang === "pt" ? "Português" : "English"}{" "}
            <span aria-hidden="true">↗</span>
          </a>
        ))}
        {blog.doi && (
          <a href={blog.doiURL} aria-label={`DOI for ${blog.title}`}>
            DOI <span aria-hidden="true">↗</span>
          </a>
        )}
        <span className="writing-preview-time">{blog.readTime}</span>
      </div>
    </article>
  );
}
