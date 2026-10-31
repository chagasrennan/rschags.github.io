import React, {useState, createRef} from "react";
import "./ExperienceCard.scss";
import ColorThief from "colorthief";

export default function ExperienceCard({
  cardInfo,
  isDark,
  isExpanded,
  onToggle,
  detailsId
}) {
  const [colorArrays, setColorArrays] = useState([]);
  const imgRef = createRef();

  function getColorArrays() {
    const colorThief = new ColorThief();
    setColorArrays(colorThief.getColor(imgRef.current));
  }

  function rgb(values) {
    return typeof values === "undefined"
      ? null
      : "rgb(" + values.join(", ") + ")";
  }

  return (
    <div className={isDark ? "experience-card-dark" : "experience-card"}>
      <div style={{background: rgb(colorArrays)}} className="experience-banner">
        <div className="experience-blurred_div"></div>
        <div className="experience-div-company">
          <h5 className="experience-text-company">{cardInfo.company}</h5>
        </div>

        <img
          crossOrigin={"anonymous"}
          ref={imgRef}
          className={`experience-roundedimg${
            cardInfo.logoFit === "contain" ? " experience-logo-contain" : ""
          }`}
          src={cardInfo.companylogo}
          alt={cardInfo.company}
          onLoad={() => getColorArrays()}
        />
      </div>
      <div className="experience-text-details">
        <h5
          className={
            isDark
              ? "experience-text-role dark-mode-text"
              : "experience-text-role"
          }
        >
          {cardInfo.role}
        </h5>
        <h5
          className={
            isDark
              ? "experience-text-date dark-mode-text"
              : "experience-text-date"
          }
        >
          {cardInfo.date}
        </h5>
        <button
          type="button"
          className="experience-toggle"
          aria-label={`${isExpanded ? "Hide" : "Show"} experience details at ${
            cardInfo.company
          }`}
          aria-expanded={isExpanded}
          aria-controls={isExpanded ? detailsId : undefined}
          onClick={onToggle}
          title="Experience details"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function ExperienceDetails({cardInfo, isDark, id, row}) {
  return (
    <section
      id={id}
      className={`experience-expanded-details${
        isDark ? " dark-mode-text" : ""
      }`}
      style={{gridRow: row}}
      aria-labelledby={`${id}-title`}
    >
      <h2 id={`${id}-title`}>
        {cardInfo.company} · {cardInfo.role}
      </h2>
      {cardInfo.employmentType && <p>{cardInfo.employmentType}</p>}
      <p className="experience-text-desc">{cardInfo.desc}</p>
      {cardInfo.descBullets && (
        <ul>
          {cardInfo.descBullets.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
      {cardInfo.coreAreas && (
        <p className="experience-core-areas">
          <strong>Core areas:</strong> {cardInfo.coreAreas}
        </p>
      )}
    </section>
  );
}
