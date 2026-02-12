import Sidebar from '@/components/shared/Sidebar';
import CopyWright from '@/components/shared/CopyWright';
import { UserPen, Camera } from 'lucide-react';
/**
 * Profile component for displaying and editing user profile information
 * @author noravsk
 * @author marennod
 */
export default function Profile() {
  // TODO: Hent brukerdata fra database
  const userName = "Nora Skou"; // Midlertidig - skal hentes fra database
  const userEmail = "nora.skou@outlook.com"; // Midlertidig - skal hentes fra database

  return (
    <div className="flex min-h-screen bg-[#f5f2ef]">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Profil</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            {/* Profile picture */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  <UserPen className="w-16 h-16 text-gray-400" />
                </div>
                <label htmlFor="profile-image" className="absolute bottom-0 right-0 bg-[#BF4646] text-white p-2 rounded-full cursor-pointer hover:bg-[#a03939] transition">
                  <Camera className="w-5 h-5" />
                  <input 
                    type="file" 
                    id="profile-image" 
                    accept="image/*" 
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-2">Klikk for å laste opp profilbilde</p>
            </div>

            {/* Name input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Navn
              </label>
              <input
                type="text"
                defaultValue={userName}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Email input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Epost
              </label>
              <input
                type="email"
                defaultValue={userEmail}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Password inputs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endre passord
              </label>
              <input
                type="password"
                placeholder="Skriv inn nytt passord"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bekreft passord
              </label>
              <input
                type="password"
                placeholder="Bekreft nytt passord"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-4">
              <button
                type="button"
                className="w-full bg-[#7EACB5] text-white py-2 px-4 rounded-md hover:bg-[#6a9aa3] transition font-medium"
              >
                Lagre endringer
              </button>
            </div>

            <div className="pt-2">
              <button
                type="button"
                className="w-full bg-white text-[#BF4646] border-2 border-[#BF4646] py-2 px-4 rounded-md hover:bg-[#BF4646] hover:text-white transition font-medium"
              >
                Logg ut
              </button>
            </div>
          </div>
        </div>
      </main>
      <CopyWright />
    </div>
  );
}