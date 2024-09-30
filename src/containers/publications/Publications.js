import React from "react";
import "./Publications.scss";
import PublicationCard from "../../components/publicationCard/PublicationCard";
import {publicationInfo} from "../../portfolio";

export default function Publication() {
  if (publicationInfo.display) {
    return (
      <div className="publication-section" id="publications">
        <h1 className="publication-heading">Publications</h1>
        <div className="publication-card-container">
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
