// components/cards/TestimonialCard.tsx
import { Card, CardContent } from "../cards"; // Changed import to our new card components

interface TestimonialCardProps {
  quote: string;
  author: {
    name: string;
    title: string;
    avatar?: string;
  };
  rating?: number; // 1-5
}

export function TestimonialCard({
  quote,
  author,
  rating = 5,
}: TestimonialCardProps) {
  return (
    <Card variant="base" padding="lg">
      <CardContent>
        {/* Rating */}
        {rating && (
          <div className="flex gap-1 mb-4">
            {Array.from({ length: rating }).map((_, i) => (
              <span key={i} className="text-warning-300">★</span>
            ))}
          </div>
        )}

        {/* Quote */}
        <p className="text-gray-700 text-base mb-6 leading-relaxed italic">
          "{quote}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-3">
          {author.avatar && (
            <img
              src={author.avatar}
              alt={author.name}
              width={48}
              height={48}
              className="rounded-full"
            />
          )}
          <div>
            <p className="font-semibold text-gray-800">{author.name}</p>
            <p className="text-sm text-gray-600">{author.title}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
