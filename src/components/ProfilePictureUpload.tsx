import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProfilePictureUploadProps {
  memorialId: string;
  currentProfilePicture?: string | null;
  onProfilePictureUpdated: (url: string | null) => void;
  className?: string;
}

export const ProfilePictureUpload = ({ 
  memorialId, 
  currentProfilePicture, 
  onProfilePictureUpdated,
  className = ""
}: ProfilePictureUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(currentProfilePicture || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Delete old profile picture if it exists
      if (profilePicture) {
        const urlParts = profilePicture.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const oldFilePath = `${memorialId}/profile/${fileName}`;
        
        await supabase.storage
          .from('memorial-photos')
          .remove([oldFilePath]);
      }

      // Upload new profile picture
      const fileExt = file.name.split('.').pop();
      const fileName = `${memorialId}/profile/profile.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('memorial-photos')
        .upload(fileName, file, {
          upsert: true // Overwrite if exists
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('memorial-photos')
        .getPublicUrl(fileName);

      setProfilePicture(publicUrl);
      onProfilePictureUpdated(publicUrl);

      toast({
        title: "Profile picture updated",
        description: "Profile picture has been successfully updated.",
      });

    } catch (error: any) {
      console.error('Error uploading profile picture:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeProfilePicture = async () => {
    if (!profilePicture) return;

    try {
      // Extract the file path from the URL
      const urlParts = profilePicture.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${memorialId}/profile/${fileName}`;

      // Delete from storage
      const { error } = await supabase.storage
        .from('memorial-photos')
        .remove([filePath]);

      if (error) {
        console.error('Error deleting from storage:', error);
        // Continue even if storage deletion fails
      }

      setProfilePicture(null);
      onProfilePictureUpdated(null);

      toast({
        title: "Profile picture removed",
        description: "Profile picture has been removed.",
      });

    } catch (error: any) {
      console.error('Error removing profile picture:', error);
      toast({
        title: "Error",
        description: "Failed to remove profile picture. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Profile Picture</h3>
        <div className="flex gap-2">
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            variant="outline"
            size="sm"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Camera className="h-4 w-4 mr-2" />
            )}
            {profilePicture ? 'Change' : 'Upload'}
          </Button>
          {profilePicture && (
            <Button
              onClick={removeProfilePicture}
              variant="destructive"
              size="sm"
            >
              Remove
            </Button>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <Card className="p-6 text-center">
        <Avatar className="h-32 w-32 mx-auto mb-4">
          <AvatarImage src={profilePicture || undefined} alt="Profile picture" />
          <AvatarFallback className="text-4xl">
            <User className="h-16 w-16" />
          </AvatarFallback>
        </Avatar>
        
        {!profilePicture && (
          <p className="text-muted-foreground text-sm">
            Upload a profile picture to personalize this memorial
          </p>
        )}
      </Card>
    </div>
  );
};