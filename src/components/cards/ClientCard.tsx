// components/cards/ClientCard.tsx
import { BaseCard } from '@/src/components/ui/BaseCard';

interface ClientCardProps {
  logo: string;
  name: string;
  type: string;
  impact?: string;
}

export function ClientCard({ logo, name, type, impact }: ClientCardProps) {
  return (
    <BaseCard variant="ghost" padding="md" className="flex flex-col items-center">
      <div className="mb-4 relative h-16 w-full">
        <img
          src={logo}
          alt={name}
          className="object-contain object-center h-full w-full"
        />
      </div>
      <p className="font-semibold text-center text-gray-800 mb-1">{name}</p>
      <p className="text-xs text-gray-600 text-center mb-2">{type}</p>
      {impact && (
        <p className="text-xs font-medium text-primary-400 text-center">{impact}</p>
      )}
    </BaseCard>
  );
}
