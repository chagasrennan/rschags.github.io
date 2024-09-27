import React, {createRef, useContext} from "react";
import {Fade, Slide} from "react-reveal";
import "./PublicationCard.scss";
import StyleContext from "../../contexts/StyleContext";
import Button from "../button/Button";

export default function PublicationCard({school}) {
  function openUrlInNewTab(url, name) {
    if (!url) {
      console.log(`URL for ${name} not found`);
      return;
    }
    var win = window.open(url, "_blank");
    win.focus();
  }
  const imgRef = createRef();

  const GetDescBullets = ({descBullets}) => {
    return descBullets
      ? descBullets.map((item, i) => (
          <li key={i} className="subTitle">
            {item}
          </li>
        ))
      : null;
  };
  const {isDark} = useContext(StyleContext);

  if (!school.logo)
    console.error(`Image of ${school.name} is missing in publication section`);
  return (
    <div>
      <Fade left duration={1000}>
        <div className="publication-card">
          {school.logo && (
            <div className="publication-card-left">
              <img
                crossOrigin={"anonymous"}
                ref={imgRef}
                className="publication-roundedimg"
                src={school.logo}
                alt={school.schoolName}
              />
            </div>
          )}
          <div className="publication-card-right">
            <h5 className="publication-text-school">{school.schoolName}</h5>

            <div className="publication-text-details">
              <h5
                className={
                  isDark
                    ? "dark-mode publication-text-subHeader"
                    : "publication-text-subHeader"
                }
              >
                {school.subHeader}
              </h5>
              <p
                className={`${
                  isDark ? "dark-mode" : ""
                } publication-text-duration`}
              >
                {school.duration}
              </p>
              <span  className="publication-text-desc"
                onClick={() => openUrlInNewTab(school.desc, school.desc)}>
                {school.desc}
              </span>
              <div className="publication-text-bullets">
                <ul>
                  <GetDescBullets descBullets={school.descBullets} />
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Fade>
      <Slide left duration={2000}>
        <div className="publication-card-border"></div>
      </Slide>
    </div>
  );
}
