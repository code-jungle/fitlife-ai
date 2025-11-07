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

      // Main titles (all caps)
      if (trimmedLine === trimmedLine.toUpperCase() && trimmedLine.length > 10 && !trimmedLine.match(/^\d/)) {
        formattedLines.push(
          <div key={lineKey++} className="flex items-center gap-2 mt-6 mb-3">
            <Dumbbell className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold gradient-text">
              {trimmedLine}
            </h3>
          </div>
        );
        return;
      }

      // Section headers (DIA A, DIA B, AQUECIMENTO, etc)
      if (trimmedLine.match(/^(DIA [A-Z]|AQUECIMENTO|TREINO|ALONGAMENTO|FREQUÊNCIA|EXERCÍCIO)/i)) {
        const emoji = trimmedLine.match(/AQUECIMENTO/i) ? '🔥' :
                     trimmedLine.match(/ALONGAMENTO/i) ? '🧘' :
                     trimmedLine.match(/TREINO/i) ? '💪' :
                     trimmedLine.match(/EXERCÍCIO/i) ? '🏋️' : '📅';
        
        const bgColor = trimmedLine.match(/ALONGAMENTO/i) ? 'bg-blue-500/10 border-blue-500/20' : 'bg-gradient-primary/10 border-primary/20';
        
        formattedLines.push(
          <div key={lineKey++} className={`flex items-center gap-2 mt-5 mb-2 p-3 rounded-lg ${bgColor}`}>
            <span className="text-2xl">{emoji}</span>
            <h4 className="text-lg font-semibold text-foreground">
              {trimmedLine}
            </h4>
          </div>
        );
        return;
      }
      
      // Stretching instructions (Como fazer:)
      if (trimmedLine.match(/^\s*Como fazer:/i)) {
        const instruction = trimmedLine.replace(/^\s*Como fazer:/i, '').trim();
        formattedLines.push(
          <div key={lineKey++} className="ml-8 mb-2 p-2 rounded bg-blue-500/5 border-l-2 border-blue-500">
            <p className="text-sm text-blue-200 italic">{instruction}</p>
          </div>
        );
        return;
      }
      
      // Stretching guidance text
      if (trimmedLine.match(/Mantenha cada posição|Respire profundamente/i)) {
        formattedLines.push(
          <div key={lineKey++} className="ml-4 mb-3 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-xs text-blue-300 italic flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {trimmedLine}
            </p>
          </div>
        );
        return;
      }

      // Exercise items (numbered or with bullet points)
      if (trimmedLine.match(/^\d+\./) || trimmedLine.match(/^[-•]/)) {
        // Check if it's an exercise description with series/reps
        const hasDetails = trimmedLine.includes(':') || trimmedLine.match(/\d+\s*(séries|repetições|x)/i);
        
        if (hasDetails) {
          const parts = trimmedLine.split(/[:-]/);
          const exerciseName = parts[0].replace(/^\d+\./, '').replace(/^[-•]/, '').trim();
          const details = parts.slice(1).join(' - ').trim();
          
          formattedLines.push(
            <div key={lineKey++} className="ml-4 mb-3 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-primary/30 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Target className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-base mb-2">{exerciseName}</p>
                  {details && (
                    <div className="flex flex-wrap gap-2">
                      {details.split(/[,;]/).map((detail, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-xs text-foreground border border-primary/20">
                          <Repeat className="w-3 h-3" />
                          {detail.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        } else {
          const exerciseName = trimmedLine.replace(/^\d+\./, '').replace(/^[-•]/, '').trim();
          formattedLines.push(
            <div key={lineKey++} className="ml-4 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="text-foreground">{exerciseName}</span>
            </div>
          );
        }
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
      if (trimmedLine.match(/^(💡|⚠️|📌|Dica:|Observação:|Importante:|Nota:|Atenção)/i)) {
        const cleanedTip = trimmedLine.replace(/^(💡|⚠️|📌|Dica:|Observação:|Importante:|Nota:|Atenção:)/i, '').trim();
        formattedLines.push(
          <div key={lineKey++} className="my-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-foreground leading-relaxed">{cleanedTip}</p>
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
