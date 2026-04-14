import React from "react";

export default function StarRating({ rating, size = 16, showNumber = false }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <div style={{ display: "flex", gap: "2px" }}>
        {stars.map((star) => {
          const filled = star <= Math.floor(rating);
          const half   = !filled && star === Math.ceil(rating) && rating % 1 >= 0.5;
          return (
            <span
              key={star}
              style={{
                fontSize: `${size}px`,
                color: filled || half ? "#fbbf24" : "#374151",
                opacity: half ? 0.7 : 1,
              }}
            >
              ★
            </span>
          );
        })}
      </div>
      {showNumber && (
        <span style={{ fontSize: "13px", color: "#fbbf24", fontWeight: "700" }}>
          {rating}
        </span>
      )}
    </div>
  );
}
