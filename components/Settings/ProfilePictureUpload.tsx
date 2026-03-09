/**
 * Profile Picture Upload Component
 */

import { UserPen, Camera } from 'lucide-react';

interface ProfilePictureUploadProps {
  image: File | null;
  imageUrl?: string;
  onImageChange: (file: File | null) => void;
  id?: string;
}

export default function ProfilePictureUpload({
  image,
  imageUrl,
  onImageChange,
  id = 'profile-image'
}: ProfilePictureUploadProps) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageChange(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="relative">
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <UserPen className="w-16 h-16 text-gray-400" />
          )}
        </div>
        <label
          htmlFor={id}
          className="absolute bottom-0 right-0 bg-[#BF4646] text-white p-2 rounded-full cursor-pointer hover:bg-[#a03939] transition"
        >
          <Camera className="w-5 h-5" />
          <input
            type="file"
            id={id}
            accept="image/*"
            className="hidden"
            onChange={handleChange}
          />
        </label>
      </div>
      <p className="text-sm text-gray-500 mt-2">Klikk for å laste opp profilbilde</p>
    </div>
  );
}
