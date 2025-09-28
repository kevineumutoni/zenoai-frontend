'use client';

import React, { useState, useEffect } from 'react';
import useFetchAdmins from '../hooks/useFetchAdmin';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

interface FormData {
  role?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  date_joined?: string;
  image?: string;
  password?: string;
  [key: string]: string | undefined;
}

const ProfilePage = () => {
  const { user, loading, error, updateAdmin, refetch } = useFetchAdmins();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        role: user.role,
        first_name: user.first_name || user.firstName || '',
        last_name: user.last_name || user.lastName || '',
        email: user.email || '',
        date_joined: user.date_joined || user.registeredDate || user.created_at || '',
        image: user.image,
        password: ''
      });
    }
  }, [user]);

  const handleEditClick = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    setStatus(null);
    if (user) {
      setFormData({
        role: user.role,
        first_name: user.first_name || user.firstName || '',
        last_name: user.last_name || user.lastName || '',
        email: user.email || '',
        date_joined: user.date_joined || user.registeredDate || user.created_at || '',
        image: user.image,
        password: ''
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.password || formData.password.trim() === '') {
      setStatus('Password is required to update the profile.');
      return;
    }

    try {
      const snakeCaseData: any = {
        role: formData.role ?? user.role,
        first_name: formData.first_name ?? user.first_name ?? user.firstName ?? '',
        last_name: formData.last_name ?? user.last_name ?? user.lastName ?? '',
        email: formData.email ?? user.email ?? '',
        image: formData.image ?? user.image,
        date_joined: formData.date_joined ?? user.date_joined ?? user.registeredDate ?? user.created_at ?? '',
        password: formData.password,
      };

      const safeId = user.id ?? user.user_id;
      if (safeId !== undefined) {
        const updatedUser = await updateAdmin(safeId, snakeCaseData);

        setFormData({
          role: updatedUser.role,
          first_name: updatedUser.first_name || '',
          last_name: updatedUser.last_name || '',
          email: updatedUser.email || '',
          date_joined: updatedUser.date_joined || updatedUser.registeredDate || updatedUser.created_at || '',
          image: updatedUser.image,
          password: ''
        });

        setIsEditing(false);
        setStatus('Profile updated successfully!');
        setTimeout(() => setStatus(null), 2000);
      }
    } catch (err) {
      setStatus('Update failed.');
      setTimeout(() => setStatus(null), 2000);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4 animate-spin"></div>
          <p className="text-white text-base sm:text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="bg-red-600 text-white p-4 sm:p-6 rounded-lg mb-4">
            <h2 className="text-lg sm:text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
          </div>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors text-sm sm:text-base"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 lg:py-1">
        <div className="text-white text-base sm:text-lg">User not found</div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-cover xl:mt-20 lg:mt- 2xl:mt-40 bg-center -mt-4 sm:-mt-6 lg:-mt-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mt-8 sm:mt-12 flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 lg:mb-8">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Profile</h1>
            <p className="text-xs sm:text-sm lg:text-base mt-1 text-zinc-100">View your profile</p>
          </div>
        </header>

        <div className="w-full h-px mb-6 sm:mb-8 lg:mb-10 border-t border-dashed border-white"></div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          <div className="flex-1 flex justify-center mb-6 lg:mb-0">
            <div style={{ backgroundColor: '#0F243D' }} className="rounded-3xl pt-6 sm:pt-10 lg:pt-14 shadow-lg border border-none max-w-xs sm:max-w-sm w-full">
              <div className="relative">
                <img
                  src={formData.image}
                  alt="Admin"
                  className="w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 xl:w-64 xl:h-64 rounded-full border-4 border-cyan-400 object-cover mx-auto"
                />
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div style={{ backgroundColor: '#0F243D' }} className="rounded-3xl p-3 sm:p-4 lg:p-6 shadow-lg">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Details</h2>
                {!isEditing ? (
                  <button
                    onClick={handleEditClick}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-300 text-orange-700 rounded-lg hover:bg-white transition-colors duration-200 cursor-pointer text-sm sm:text-base"
                  >
                    Update
                  </button>
                ) : (
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={handleCancel}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 text-red-400 hover:text-red-300 transition-colors duration-200 cursor-pointer text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 cursor-pointer text-sm sm:text-base"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>

              {status && (
                <div
                  className={`mb-3 sm:mb-4 px-4 py-2 rounded text-center ${
                    status.includes('success')
                      ? 'bg-green-600 text-white'
                      : 'bg-red-600 text-white'
                  } text-sm sm:text-base`}
                >
                  {status}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-3 sm:mb-4">
                  <div className="flex-1">
                    <label className="block text-sm sm:text-base lg:text-lg text-cyan-300 mb-2">Role</label>
                    <p className="text-white text-sm sm:text-base">{formData.role}</p>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm sm:text-base lg:text-lg text-cyan-300 mb-2">Registered date</label>
                    <p className="text-white text-sm sm:text-base">
                      {formData.date_joined
                        ? new Date(formData.date_joined).toLocaleDateString()
                        : 'Not specified'}
                    </p>
                  </div>
                </div>
                <hr className="border-gray-700 my-3 sm:my-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-3 sm:mb-4">
                  <div>
                    <label className="block text-sm sm:text-base lg:text-lg text-cyan-300 mb-2">First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name || ''}
                        onChange={handleChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm sm:text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    ) : (
                      <p className="text-white text-base sm:text-lg lg:text-xl">{formData.first_name || 'Not specified'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm sm:text-base lg:text-lg text-cyan-300 mb-2">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name || ''}
                        onChange={handleChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm sm:text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    ) : (
                      <p className="text-white text-base sm:text-lg lg:text-xl">{formData.last_name || 'Not specified'}</p>
                    )}
                  </div>
                </div>
                <hr className="border-gray-700 my-3 sm:my-4" />
                <div className="mb-3 sm:mb-4">
                  <label className="block text-sm sm:text-base lg:text-lg text-cyan-300 mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm sm:text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    ) : (
                      <p className="text-white text-base sm:text-lg lg:text-xl">{formData.email || 'Not specified'}</p>
                    )}
                </div>
                <hr className="border-gray-700 my-3 sm:my-4" />
                {isEditing && (
                  <div className="mb-3 sm:mb-6 lg:mb-8">
                    <label className="block text-sm sm:text-base lg:text-lg text-cyan-300 mb-2">Password (required for update)</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password || ''}
                        onChange={handleChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm sm:text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-white"
                      >
                        {showPassword ? (
                          <AiOutlineEyeInvisible size={20} className="w-5 sm:w-6 h-5 sm:h-6" />
                        ) : (
                          <AiOutlineEye size={20} className="w-5 sm:w-6 h-5 sm:h-6" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        <div className="w-full h-px mt-6 sm:mt-8 lg:mt-10 border-t border-dashed border-white"></div>
      </div>
    </div>
  );
};

export default ProfilePage;