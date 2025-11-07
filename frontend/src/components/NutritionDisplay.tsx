import React from 'react';
import { Apple, Utensils, Coffee, Salad, Moon, AlertCircle, TrendingUp, DollarSign } from 'lucide-react';

interface NutritionDisplayProps {
  content: string;
}

const NutritionDisplay: React.FC<NutritionDisplayProps> = ({ content }) => {
  // Clean content: remove asterisks and markdown tables
  const cleanContent = (text: string) => {
    return text
      .replace(/\*\*/g, '') // Remove bold asterisks
      .replace(/\*/g, '') // Remove single asterisks
      .split('\n')
      .filter(line => !line.trim().match(/^\|.*\|$/)) // Remove markdown table rows
      .filter(line => !line.trim().match(/^[-:| ]+$/)) // Remove table separators
      .join('\n');
  };

  // Parse the content to add formatting
  const formatContent = (text: string) => {
    const cleanedText = cleanContent(text);
    const lines = cleanedText.split('\n');
    const formattedLines: JSX.Element[] = [];
    let lineKey = 0;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) {
        formattedLines.push(<div key={`empty-${lineKey++}`} className="h-2" />);
        return;
      }

      // Main titles (all caps)
      if (trimmedLine === trimmedLine.toUpperCase() && trimmedLine.length > 10 && !trimmedLine.match(/^\d/)) {
        formattedLines.push(
          <div key={lineKey++} className="flex items-center gap-2 mt-6 mb-3">
            <Apple className="w-5 h-5 text-green-500" />
            <h3 className="text-xl font-bold gradient-text">
              {trimmedLine}
            </h3>
          </div>
        );
        return;
      }

      // Meal sections (Café da manhã, Almoço, etc)
      if (trimmedLine.match(/^(CAFÉ|ALMOÇO|JANTAR|LANCHE|CEIA)/i)) {
        const mealEmoji = trimmedLine.includes('CAFÉ') ? '☕' :
                         trimmedLine.includes('ALMOÇO') ? '🍽️' :
                         trimmedLine.includes('JANTAR') ? '🌙' :
                         trimmedLine.includes('CEIA') ? '🥛' : '🍎';
        
        formattedLines.push(
          <div key={lineKey++} className="flex items-center gap-2 mt-5 mb-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <span className="text-2xl">{mealEmoji}</span>
            <h4 className="text-lg font-semibold text-foreground">
              {trimmedLine.replace(/\*\*/g, '')}
            </h4>
          </div>
        );
        return;
      }

      // Calorie/Macro info
      if (trimmedLine.match(/calorias|kcal|proteína|carboidrato|gordura|meta calórica/i)) {
        formattedLines.push(
          <div key={lineKey++} className="my-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <p className="font-semibold text-foreground">{trimmedLine}</p>
            </div>
          </div>
        );
        return;
      }

      // Food items (numbered or with bullet points)
      if (trimmedLine.match(/^\d+\./) || trimmedLine.match(/^[-•]/)) {
        const foodName = trimmedLine.split(':')[0].replace(/^\d+\./, '').replace(/^[-•]/, '').trim();
        const details = trimmedLine.split(':').slice(1).join(':').trim();
        
        formattedLines.push(
          <div key={lineKey++} className="ml-4 mb-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-green-500/30 transition-colors">
            <div className="flex items-start gap-2">
              <Utensils className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-foreground">{foodName}</p>
                {details && (
                  <p className="text-sm text-muted-foreground mt-1">{details}</p>
                )}
              </div>
            </div>
          </div>
        );
        return;
      }

      // Price/Budget tips
      if (trimmedLine.match(/preço|custo|economizar|barato|acessível|lista de compras/i)) {
        formattedLines.push(
          <div key={lineKey++} className="ml-4 mb-2 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="text-sm text-muted-foreground">{trimmedLine}</span>
          </div>
        );
        return;
      }

      // Tips/Notes
      if (trimmedLine.match(/^(💡|⚠️|📌|Dica:|Observação:|Importante:|Nota:)/i)) {
        formattedLines.push(
          <div key={lineKey++} className="my-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-foreground">{trimmedLine}</p>
            </div>
          </div>
        );
        return;
      }

      // Weekly schedule
      if (trimmedLine.match(/segunda|terça|quarta|quinta|sexta|sábado|domingo|semana/i)) {
        formattedLines.push(
          <div key={lineKey++} className="ml-4 mb-2 flex items-center gap-2">
            <Coffee className="w-4 h-4 text-green-500" />
            <span className="text-sm text-muted-foreground font-medium">{trimmedLine}</span>
          </div>
        );
        return;
      }

      // Shopping list items
      if (trimmedLine.match(/^[-•]\s*\w+/) && index > 0 && lines[index - 1].match(/lista|compras/i)) {
        formattedLines.push(
          <div key={lineKey++} className="ml-6 mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-sm text-foreground">{trimmedLine.replace(/^[-•]/, '').trim()}</span>
          </div>
        );
        return;
      }

      // Regular paragraph
      formattedLines.push(
        <p key={lineKey++} className="mb-2 text-foreground/80 leading-relaxed">
          {trimmedLine}
        </p>
      );
    });

    return formattedLines;
  };

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 p-4 rounded-lg bg-green-500/20 border border-green-500/30">
        <Salad className="w-6 h-6 text-green-500" />
        <div>
          <h3 className="text-lg font-bold text-foreground">🍎 Seu Plano Nutricional</h3>
          <p className="text-sm text-muted-foreground">Alimentação acessível e balanceada</p>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-invert max-w-none">
        {formatContent(content)}
      </div>

      {/* Footer note */}
      <div className="mt-6 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <p className="text-xs text-blue-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Lembre-se: Consulte um nutricionista para um plano personalizado completo.
        </p>
      </div>
    </div>
  );
};

export default NutritionDisplay;
