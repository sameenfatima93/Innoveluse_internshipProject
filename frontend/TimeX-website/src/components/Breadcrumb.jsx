import React from "react";
import { Link } from "react-router-dom";
import "../styles/Breadcrumb.css";

export default function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index < items.length - 1 ? (
            <>
              <Link to={item.path} className="breadcrumb__link">
                {item.label}
              </Link>
              <span className="breadcrumb__sep">›</span>
            </>
          ) : (
            <span className="breadcrumb__current">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
