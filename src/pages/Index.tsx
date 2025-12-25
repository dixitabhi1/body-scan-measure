import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { MeasurementCard } from "@/components/MeasurementCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Ruler, 
  ArrowRight, 
  Sparkles, 
  MoveVertical, 
  CircleDot, 
  Armchair, 
  Footprints,
  Loader2
} from "lucide-react";

interface MeasurementResults {
  "Estimated Height (cm)": number;
  "Shoulder (cm)": number;
  "Hip (cm)": number;
  "Arm Length (cm)": number;
  "Leg / Inseam (cm)": number;
}

const Index = () => {
  const { toast } = useToast();
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [sideImage, setSideImage] = useState<File | null>(null);
  const [standImage, setStandImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<MeasurementResults | null>(null);

  const handleSubmit = async () => {
    if (!frontImage || !sideImage || !standImage) {
      toast({
        title: "Missing images",
        description: "Please upload all three pose images.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append("front", frontImage);
      formData.append("side", sideImage);
      formData.append("stand", standImage);

      const response = await fetch(
        "https://abhishek785-ai-body-measurement.hf.space/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get measurements");
      }

      const data = await response.json();
      setResults(data);
      
      toast({
        title: "Measurements ready!",
        description: "Your body measurements have been calculated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const measurementItems = results ? [
    { label: "Estimated Height", value: results["Estimated Height (cm)"], icon: MoveVertical },
    { label: "Shoulder", value: results["Shoulder (cm)"], icon: Ruler },
    { label: "Hip", value: results["Hip (cm)"], icon: CircleDot },
    { label: "Arm Length", value: results["Arm Length (cm)"], icon: Armchair },
    { label: "Leg / Inseam", value: results["Leg / Inseam (cm)"], icon: Footprints },
  ] : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Precision
            </div>
            <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-6 leading-tight">
              Your Perfect Measurements,{" "}
              <span className="text-primary">Instantly</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Upload three simple photos and get accurate body measurements in seconds. 
              No tape measure needed.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Upload Section */}
          <section className="bg-card rounded-2xl p-6 md:p-10 shadow-card mb-12">
            <div className="mb-8">
              <h2 className="text-2xl font-serif text-foreground mb-2">
                Upload Your Photos
              </h2>
              <p className="text-muted-foreground">
                Take three photos in different poses for the most accurate results.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
              <ImageUpload
                label="Front Pose"
                description="Face the camera directly"
                icon="front"
                selectedFile={frontImage}
                onImageSelect={setFrontImage}
              />
              <ImageUpload
                label="Side Pose"
                description="Turn 90° to your left or right"
                icon="side"
                selectedFile={sideImage}
                onImageSelect={setSideImage}
              />
              <ImageUpload
                label="Standing Pose"
                description="Arms slightly away from body"
                icon="stand"
                selectedFile={standImage}
                onImageSelect={setStandImage}
              />
            </div>

            <div className="flex justify-center">
              <Button
                variant="hero"
                size="lg"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Get Measurements
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          </section>

          {/* Results Section */}
          {results && (
            <section className="animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-2">
                  Your Measurements
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                {measurementItems.map((item, index) => (
                  <MeasurementCard
                    key={item.label}
                    label={item.label}
                    value={item.value}
                    unit="cm"
                    icon={item.icon}
                    delay={index * 100}
                  />
                ))}
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Measurements are approximate and generated using AI-based pose estimation.
              </p>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Results are approximate and based on AI pose estimation. 
            For precise measurements, consult a professional tailor.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
