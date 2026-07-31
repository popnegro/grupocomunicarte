import React from 'react';
import { Sparkles } from 'lucide-react';
import { Card } from '../../ui/card';
import { LoadingState } from '../shared/StateIndicators';
import { CardProps } from './types';

interface Suggestion {
  type: 'Sugerencia de Precios' | 'Soporte Ocioso';
  details: string;
}

interface AIRevenueSuggestionsProps extends CardProps {
  suggestions: Suggestion[];
}

const SuggestionCard: React.FC<{ suggestion: Suggestion }> = ({ suggestion }) => {
  const isPriceSuggestion = suggestion.type === 'Sugerencia de Precios';
  return (
    <div className="p-3 bg-white rounded-xl border border-stone-100 space-y-1.5 shadow-2xs">
      <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
        isPriceSuggestion 
          ? 'bg-amber-500/10 text-amber-700' 
          : 'bg-[#06434a]/8 text-[#06434a]'
      }`}>
        {suggestion.type}
      </span>
      <p className="text-[10px] text-stone-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: suggestion.details }} />
    </div>
  );
};


export const AIRevenueSuggestions: React.FC<AIRevenueSuggestionsProps> = React.memo(({ loading, suggestions }) => {
  return (
    <Card className="bg-gradient-to-b from-[#FAF9F5] to-stone-50 border border-stone-200/80 rounded-2xl p-5 space-y-4 shadow-xs">
      <div className="flex items-center gap-2 border-b border-stone-200/60 pb-3">
        <Sparkles className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
        <h4 className="text-[11px] font-extrabold text-stone-800 uppercase tracking-wider font-mono">
          Sugerencias de Revenue IA
        </h4>
      </div>

      {loading ? (
        <div className="space-y-3">
          <LoadingState count={2} />
        </div>
      ) : (
        <div className="space-y-3.5">
          {suggestions.map((suggestion, index) => (
            <SuggestionCard key={index} suggestion={suggestion} />
          ))}
        </div>
      )}
    </Card>
  );
});
