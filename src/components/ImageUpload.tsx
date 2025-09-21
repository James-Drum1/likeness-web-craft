import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  memorialId: string;
  existingImages?: string[];
  onImagesUpdated: (images: string[]) => void;
  maxImages?: number;
  className?: string;
}

export const ImageUpload = ({ 
  memorialId, 
  existingImages = [], 
  onImagesUpdated, 
  maxImages = 10,
  className = ""
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>(existingImages);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `You can only upload up to ${maxImages} images.`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${memorialId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('memorial-photos')
          .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('memorial-photos')
          .getPublicUrl(fileName);

        return publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const newImages = [...images, ...uploadedUrls];
      
      setImages(newImages);
      onImagesUpdated(newImages);

      toast({
        title: "Images uploaded",
        description: `Successfully uploaded ${files.length} image(s).`,
      });

    } catch (error: any) {
      console.error('Error uploading images:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = async (imageUrl: string, index: number) => {
    try {
      // Extract the file path from the URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${memorialId}/${fileName}`;

      // Delete from storage
      const { error } = await supabase.storage
        .from('memorial-photos')
        .remove([filePath]);

      if (error) {
        console.error('Error deleting from storage:', error);
        // Continue even if storage deletion fails
      }

      // Update local state
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
      onImagesUpdated(newImages);

      toast({
        title: "Image removed",
        description: "Image has been removed from the memorial.",
      });

    } catch (error: any) {
      console.error('Error removing image:', error);
      toast({
        title: "Error",
        description: "Failed to remove image. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Memorial Photos ({images.length}/{maxImages})</h3>
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || images.length >= maxImages}
          variant="outline"
          size="sm"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          Add Photos
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <img
                src={image}
                alt={`Memorial photo ${index + 1}`}
                className="w-full h-32 object-cover"
              />
              <Button
                onClick={() => removeImage(image, index)}
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 p-8 text-center">
          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No photos uploaded yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Click "Add Photos" to upload memorial images
          </p>
        </Card>
      )}
    </div>
  );
};