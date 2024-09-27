import React from "react";
import "./Publications.scss";
import PublicationCard from "../../components/publicationCard/PublicationCard";
import {publicationInfo} from "../../portfolio";

export default function Publication() {
  if (publicationInfo.display) {
    return (
      <div className="education-section" id="education">
        <h1 className="education-heading">Publications</h1>
        <div className="education-card-container">
          {publicationInfo.schools.map((school, index) => (
            <PublicationCard key={index} school={school} 
            />
          ))}
        </div>
      </div>
    );
  }
  return null;
}
