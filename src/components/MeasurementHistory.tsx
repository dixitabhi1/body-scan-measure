import { useState } from "react";
import { format } from "date-fns";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  History 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface HistoryEntry {
  id: string;
  date: string;
  results: {
    "Estimated Height (cm)": number;
    "Shoulder (cm)": number;
    "Hip (cm)": number;
    "Arm Length (cm)": number;
    "Leg / Inseam (cm)": number;
  };
}

interface MeasurementHistoryProps {
  history: HistoryEntry[];
  onDelete: (id: string) => void;
  onClear: () => void;
}

const measurementLabels: Record<string, string> = {
  "Estimated Height (cm)": "Height",
  "Shoulder (cm)": "Shoulder",
  "Hip (cm)": "Hip",
  "Arm Length (cm)": "Arm",
  "Leg / Inseam (cm)": "Leg",
};

export const MeasurementHistory = ({ history, onDelete, onClear }: MeasurementHistoryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (history.length === 0) return null;

  const getChange = (current: number, previous: number) => {
    const diff = current - previous;
    if (Math.abs(diff) < 0.1) return { icon: Minus, color: "text-muted-foreground", value: "0" };
    if (diff > 0) return { icon: TrendingUp, color: "text-green-500", value: `+${diff.toFixed(1)}` };
    return { icon: TrendingDown, color: "text-red-500", value: diff.toFixed(1) };
  };

  const latestEntry = history[0];
  const previousEntry = history[1];

  return (
    <section className="bg-card rounded-2xl p-6 md:p-8 shadow-card mb-12 animate-fade-in">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <History className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-serif text-foreground">Measurement History</h3>
            <p className="text-sm text-muted-foreground">{history.length} record{history.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </Button>
      </div>

      {isExpanded && (
        <div className="mt-6 space-y-4">
          {/* Comparison with previous */}
          {previousEntry && (
            <div className="bg-accent/50 rounded-xl p-4 mb-4">
              <p className="text-sm font-medium text-foreground mb-3">Changes from last measurement</p>
              <div className="grid grid-cols-5 gap-2">
                {Object.keys(measurementLabels).map((key) => {
                  const change = getChange(
                    latestEntry.results[key as keyof typeof latestEntry.results],
                    previousEntry.results[key as keyof typeof previousEntry.results]
                  );
                  const ChangeIcon = change.icon;
                  return (
                    <div key={key} className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">{measurementLabels[key]}</p>
                      <div className={`flex items-center justify-center gap-1 ${change.color}`}>
                        <ChangeIcon className="w-3 h-3" />
                        <span className="text-sm font-medium">{change.value}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* History list */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {history.map((entry, index) => (
              <div 
                key={entry.id} 
                className="flex items-center justify-between p-3 rounded-lg bg-background border border-border"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {format(new Date(entry.date), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                  <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                    {Object.keys(measurementLabels).slice(0, 3).map((key) => (
                      <span key={key}>
                        {measurementLabels[key]}: {entry.results[key as keyof typeof entry.results]?.toFixed(1)}cm
                      </span>
                    ))}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(entry.id);
                  }}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {history.length > 1 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClear}
              className="w-full mt-4"
            >
              Clear All History
            </Button>
          )}
        </div>
      )}
    </section>
  );
};
