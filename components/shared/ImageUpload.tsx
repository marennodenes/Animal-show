/**
 * Image Upload Component
 * Reusable component for uploading images
 */

import { Camera } from 'lucide-react';

interface ImageUploadProps {
  label: string;
  image: File | null;
  onImageChange: (file: File | null) => void;
  id?: string;
  buttonText?: string;
}

export default function ImageUpload({ 
  label, 
  image, 
  onImageChange,
  id = 'image-upload',
  buttonText = 'Velg bilde'
}: ImageUploadProps) {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageChange(e.target.files[0]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <label 
          htmlFor={id}
          className="bg-[#7EACB5] hover:bg-[#6a9aa3] text-white py-2 px-4 rounded-md cursor-pointer transition flex items-center gap-2"
        >
          <Camera size={20} />
          {buttonText}
          <input 
            type="file" 
            id={id}
            accept="image/*" 
            className="hidden"
            onChange={handleChange}
          />
        </label>
        {image && (
          <span className="text-sm text-gray-600">{image.name}</span>
        )}
      </div>
    </div>
  );
}
