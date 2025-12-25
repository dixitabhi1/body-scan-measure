import { LucideIcon } from "lucide-react";

interface MeasurementCardProps {
  label: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  delay?: number;
}

export const MeasurementCard = ({
  label,
  value,
  unit,
  icon: Icon,
  delay = 0,
}: MeasurementCardProps) => {
  return (
    <div
      className="group relative bg-card rounded-xl p-6 shadow-card hover:shadow-hover 
                 transition-all duration-300 hover:-translate-y-1 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 rounded-xl gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-lg bg-accent group-hover:bg-primary/10 transition-colors duration-300">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-serif font-medium text-foreground">
          {value.toFixed(1)}
        </span>
        <span className="text-lg text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
};
