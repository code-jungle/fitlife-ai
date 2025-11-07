import React from 'react';
import { Dumbbell, Zap, Clock, Repeat, Target, AlertCircle } from 'lucide-react';

interface WorkoutDisplayProps {
  content: string;
}

const WorkoutDisplay: React.FC<WorkoutDisplayProps> = ({ content }) => {
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

      // Main titles (all caps or starts with **)
      if (trimmedLine.match(/^\*\*.*\*\*/) || trimmedLine === trimmedLine.toUpperCase() && trimmedLine.length > 10) {
        formattedLines.push(
          <div key={lineKey++} className="flex items-center gap-2 mt-6 mb-3">
            <Dumbbell className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold gradient-text">
              {trimmedLine.replace(/\*\*/g, '')}
            </h3>
          </div>
        );
        return;
      }

      // Section headers (DIA A, DIA B, AQUECIMENTO, etc)
      if (trimmedLine.match(/^(DIA [A-Z]|AQUECIMENTO|TREINO|ALONGAMENTO|FREQUÊNCIA)/i)) {
        const emoji = trimmedLine.includes('AQUECIMENTO') ? '🔥' :
                     trimmedLine.includes('ALONGAMENTO') ? '🧘' :
                     trimmedLine.includes('TREINO') ? '💪' : '📅';
        
        formattedLines.push(
          <div key={lineKey++} className="flex items-center gap-2 mt-5 mb-2 p-3 rounded-lg bg-gradient-primary/10 border border-primary/20">
            <span className="text-2xl">{emoji}</span>
            <h4 className="text-lg font-semibold text-foreground">
              {trimmedLine.replace(/\*\*/g, '')}
            </h4>
          </div>
        );
        return;
      }

      // Exercise items (numbered or with bullet points)
      if (trimmedLine.match(/^\d+\./) || trimmedLine.match(/^[-•]/)) {
        const exerciseName = trimmedLine.split(':')[0].replace(/^\d+\./, '').replace(/^[-•]/, '').trim();
        const details = trimmedLine.split(':').slice(1).join(':').trim();
        
        formattedLines.push(
          <div key={lineKey++} className="ml-4 mb-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-primary/30 transition-colors">
            <div className="flex items-start gap-2">
              <Target className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-foreground">{exerciseName}</p>
                {details && (
                  <p className="text-sm text-muted-foreground mt-1">{details}</p>
                )}
              </div>
            </div>
          </div>
        );
        return;
      }

      // Series/Repetitions info
      if (trimmedLine.match(/séries|repetições|descanso|tempo/i)) {
        formattedLines.push(
          <div key={lineKey++} className="ml-8 mb-2 flex items-center gap-2 text-sm">
            <Repeat className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">{trimmedLine}</span>
          </div>
        );
        return;
      }

      // Tips/Notes (starts with 💡, Dica:, Observação:, etc)
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

      // Frequency/Schedule info
      if (trimmedLine.match(/frequência|vezes por semana|dias|segunda|terça|quarta/i)) {
        formattedLines.push(
          <div key={lineKey++} className="ml-4 mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">{trimmedLine}</span>
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
      <div className="flex items-center gap-2 mb-4 p-4 rounded-lg bg-gradient-primary/20 border border-primary/30">
        <Zap className="w-6 h-6 text-primary" />
        <div>
          <h3 className="text-lg font-bold text-foreground">💪 Seu Treino Personalizado</h3>
          <p className="text-sm text-muted-foreground">Gerado com IA baseado no seu perfil</p>
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
          Lembre-se: Consulte um profissional antes de iniciar qualquer programa de exercícios.
        </p>
      </div>
    </div>
  );
};

export default WorkoutDisplay;
