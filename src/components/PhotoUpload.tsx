
import React, { useState } from 'react';
import { Camera, Upload, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PhotoUploadProps {
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotosChange, maxPhotos = 3 }) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const uploadPhoto = async (file: File): Promise<string | null> => {
    if (!user) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('safety-photos')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('safety-photos')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      return null;
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || photos.length >= maxPhotos) return;

    setUploading(true);
    const newPhotos: string[] = [];

    for (let i = 0; i < Math.min(files.length, maxPhotos - photos.length); i++) {
      const file = files[i];
      
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file.`,
          variant: "destructive",
        });
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 5MB.`,
          variant: "destructive",
        });
        continue;
      }

      const photoUrl = await uploadPhoto(file);
      if (photoUrl) {
        newPhotos.push(photoUrl);
      }
    }

    const updatedPhotos = [...photos, ...newPhotos];
    setPhotos(updatedPhotos);
    onPhotosChange(updatedPhotos);
    setUploading(false);

    if (newPhotos.length > 0) {
      toast({
        title: "Photos uploaded successfully",
        description: `${newPhotos.length} photo(s) added to your report.`,
      });
    }
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    setPhotos(updatedPhotos);
    onPhotosChange(updatedPhotos);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-700">
          Photos (Optional)
        </label>
        <span className="text-xs text-slate-500">
          {photos.length}/{maxPhotos} photos
        </span>
      </div>

      {/* Photo Preview Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <img
                src={photo}
                alt={`Safety report photo ${index + 1}`}
                className="w-full h-20 object-cover rounded-lg border"
              />
              <button
                onClick={() => removePhoto(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {photos.length < maxPhotos && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-500 transition-colors">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="photo-upload"
            disabled={uploading}
          />
          <label htmlFor="photo-upload" className="cursor-pointer">
            <div className="space-y-2">
              {uploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
              ) : (
                <Camera className="h-8 w-8 text-gray-400 mx-auto" />
              )}
              <div className="text-sm text-gray-600">
                {uploading ? 'Uploading...' : 'Click to add photos'}
              </div>
              <div className="text-xs text-gray-500">
                PNG, JPG up to 5MB each
              </div>
            </div>
          </label>
        </div>
      )}

      {/* Info Message */}
      <div className="flex items-start space-x-2 text-xs text-slate-600 bg-blue-50 p-3 rounded-lg">
        <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium">Photo Guidelines:</p>
          <ul className="mt-1 space-y-1">
            <li>• Avoid including faces or identifying information</li>
            <li>• Focus on safety-relevant features (lighting, security, etc.)</li>
            <li>• Photos help other travelers understand the location better</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;
