import React, {useContext} from "react";
import "./Blog.scss";
import BlogCard from "../../components/blogCard/BlogCard";
import {blogSection} from "../../portfolio";
import publications from "../../generated/writing.json";
import {Fade} from "react-reveal";
import StyleContext from "../../contexts/StyleContext";

export default function Blogs() {
  const {isDark} = useContext(StyleContext);
  if (!blogSection.display) return null;

  return (
    <Fade bottom duration={1000} distance="20px">
      <section className="main" id="writing" aria-labelledby="writing-title">
        <div className="blog-header">
          <h1 className="blog-header-text" id="writing-title">
            {blogSection.title}
          </h1>
          <p className="writing-subtitle">{blogSection.subtitle}</p>
        </div>
        <div className="blog-text-div">
          {publications.slice(0, 3).map(publication => (
            <BlogCard key={publication.id} isDark={isDark} blog={publication} />
          ))}
        </div>
        <a className="writing-view-all" href="/writing/">
          View all writing <span aria-hidden="true">→</span>
        </a>
      </section>
    </Fade>
  );
}
