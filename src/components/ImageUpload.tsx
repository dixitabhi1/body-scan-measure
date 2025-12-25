import { useCallback, useState, useEffect } from "react";
import { Upload, X, User, UserRound } from "lucide-react";

interface ImageUploadProps {
  label: string;
  description: string;
  icon: "front" | "side" | "stand";
  onImageSelect: (file: File | null) => void;
  selectedFile: File | null;
}

const iconMap = {
  front: User,
  side: UserRound,
  stand: User,
};

export const ImageUpload = ({
  label,
  description,
  icon,
  onImageSelect,
  selectedFile,
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Sync preview with selectedFile prop
  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  }, [selectedFile]);

  const handleFile = useCallback(
    (file: File | null) => {
      if (file && file.type.startsWith("image/")) {
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onImageSelect(null);
    },
    [onImageSelect]
  );

  const Icon = iconMap[icon];

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative group cursor-pointer rounded-lg border-2 border-dashed 
          transition-all duration-300 overflow-hidden aspect-[3/4]
          ${isDragging 
            ? "border-primary bg-accent scale-[1.02]" 
            : preview 
              ? "border-transparent" 
              : "border-border hover:border-primary/50 hover:bg-accent/50"
          }
        `}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt={label}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-foreground/80 text-background 
                         opacity-0 group-hover:opacity-100 transition-opacity duration-200
                         hover:bg-destructive z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-200" />
          </>
        ) : (
          <label className="flex flex-col items-center justify-center h-full p-4 cursor-pointer">
            <div className="p-3 rounded-full bg-accent mb-3 group-hover:bg-primary/10 transition-colors duration-200">
              <Icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-1">
              <Upload className="w-4 h-4" />
              Upload {label}
            </div>
            <p className="text-xs text-muted-foreground text-center">{description}</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e.target.files?.[0] || null)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>
        )}
      </div>
    </div>
  );
};
