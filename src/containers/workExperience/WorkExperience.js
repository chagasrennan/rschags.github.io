import React, {useContext, useEffect, useRef, useState} from "react";
import "./WorkExperience.scss";
import ExperienceCard, {
  ExperienceDetails
} from "../../components/experienceCard/ExperienceCard";
import {workExperiences} from "../../portfolio";
import {Fade} from "react-reveal";
import StyleContext from "../../contexts/StyleContext";

export default function WorkExperience() {
  const {isDark} = useContext(StyleContext);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [columns, setColumns] = useState(1);
  const gridRef = useRef(null);
  const detailsId = "experience-details-panel";

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const measureColumns = () => {
      const tracks = window.getComputedStyle(grid).gridTemplateColumns;
      setColumns(
        tracks && tracks !== "none" ? tracks.trim().split(/\s+/).length : 1
      );
    };
    measureColumns();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measureColumns);
      return () => window.removeEventListener("resize", measureColumns);
    }
    const observer = new ResizeObserver(measureColumns);
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  if (workExperiences.display) {
    return (
      <div id="experience">
        <Fade bottom duration={1000} distance="20px" fraction={0}>
          <div className="experience-container" id="workExperience">
            <div>
              <h1 className="experience-heading">Experiences</h1>
              <div className="experience-cards-div" ref={gridRef}>
                {workExperiences.experience.map((card, i) => {
                  return (
                    <ExperienceCard
                      key={i}
                      isDark={isDark}
                      cardInfo={card}
                      isExpanded={expandedIndex === i}
                      detailsId={detailsId}
                      onToggle={() =>
                        setExpandedIndex(current => (current === i ? null : i))
                      }
                    />
                  );
                })}
                {expandedIndex !== null && (
                  <ExperienceDetails
                    id={detailsId}
                    cardInfo={workExperiences.experience[expandedIndex]}
                    isDark={isDark}
                    row={Math.floor(expandedIndex / columns) + 2}
                  />
                )}
              </div>
            </div>
          </div>
        </Fade>
      </div>
    );
  }
  return null;
}
