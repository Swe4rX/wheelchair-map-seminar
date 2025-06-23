import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: number;
  showText?: boolean;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = 16,
  showText = true,
  className = "",
}) => {
  return (
    <div 
      className={`flex items-center ${className}`}
      role="img"
      aria-label={`Bewertung: ${rating} von 5 Sternen`}
    >
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={`${
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
          aria-hidden="true"
        />
      ))}
      {showText && (
        <span className="ml-2 text-sm text-gray-600" aria-hidden="true">{rating}/5</span>
      )}
    </div>
  );
};
