// components/cards/BenefitCard.tsx
import { Card, CardContent } from "../cards"; // Changed import to our new card components

interface BenefitCardProps {
  number: number;
  title: string;
  description: string;
}

export function BenefitCard({ number, title, description }: BenefitCardProps) {
  return (
    <Card variant="base" padding="lg">
      <CardContent>
        {/* Number Badge */}
        <div className="text-4xl font-bold text-primary-400 mb-4">
          {String(number).padStart(2, '0')}
        </div>

        {/* Content */}
        <h3 className="text-2xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-base leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
