import { forwardRef } from "react";
import { Ruler, MoveVertical, CircleDot, Armchair, Footprints, Sparkles } from "lucide-react";

interface MeasurementResults {
  "Estimated Height (cm)": number;
  "Shoulder (cm)": number;
  "Hip (cm)": number;
  "Arm Length (cm)": number;
  "Leg / Inseam (cm)": number;
}

interface ShareableResultsCardProps {
  results: MeasurementResults;
}

export const ShareableResultsCard = forwardRef<HTMLDivElement, ShareableResultsCardProps>(
  ({ results }, ref) => {
    const measurementItems = [
      { label: "Estimated Height", value: results["Estimated Height (cm)"], icon: MoveVertical },
      { label: "Shoulder", value: results["Shoulder (cm)"], icon: Ruler },
      { label: "Hip", value: results["Hip (cm)"], icon: CircleDot },
      { label: "Arm Length", value: results["Arm Length (cm)"], icon: Armchair },
      { label: "Leg / Inseam", value: results["Leg / Inseam (cm)"], icon: Footprints },
    ];

    return (
      <div
        ref={ref}
        className="bg-gradient-to-br from-background via-card to-accent/20 p-8 rounded-2xl w-[400px]"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
            <Sparkles className="w-3 h-3" />
            AI Body Measurements
          </div>
          <h3 className="text-xl font-serif text-foreground">Your Measurements</h3>
        </div>

        {/* Measurements Grid */}
        <div className="space-y-3">
          {measurementItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center justify-between bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-foreground">
                    {item.value?.toFixed(1)}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">cm</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-border/50 text-center">
          <p className="text-xs text-muted-foreground">
            Generated using AI-based pose estimation
          </p>
        </div>
      </div>
    );
  }
);

ShareableResultsCard.displayName = "ShareableResultsCard";
