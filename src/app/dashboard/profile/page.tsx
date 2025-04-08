'use client';

import React from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import ProfileForm from '@/components/profile/ProfileForm';
import ProfilePictureUpload from '@/components/profile/ProfilePictureUpload';
import SocialMediaPlatforms from '@/components/profile/SocialMediaPlatforms';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Configuración de Perfil</h1>
        <div className="text-sm text-gray-400">
          Última actualización: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Profile Picture Section */}
        <section className="bg-[#1a1a1a] rounded-xl p-6 border border-[#4CAF50]/10">
          <h2 className="text-xl font-semibold mb-4">Foto de Perfil</h2>
          <div className="flex items-start gap-8">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-[#2a2a2a] overflow-hidden">
                {user?.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName || 'Profile'}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gray-500">
                    {user?.displayName?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
              </div>
            </div>
            <div className="flex-grow">
              <ProfilePictureUpload />
              <p className="mt-2 text-sm text-gray-400">
                Recomendado: Imagen cuadrada, al menos 400x400 píxeles
              </p>
            </div>
          </div>
        </section>

        {/* Personal Information Section */}
        <section className="bg-[#1a1a1a] rounded-xl p-6 border border-[#4CAF50]/10">
          <h2 className="text-xl font-semibold mb-4">Información Personal</h2>
          <ProfileForm />
        </section>

        {/* Social Media Section */}
        <section className="bg-[#1a1a1a] rounded-xl p-6 border border-[#4CAF50]/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Plataformas Conectadas</h2>
            <span className="text-xs text-gray-400 px-2 py-1 bg-[#2a2a2a] rounded-full">
              Próximamente
            </span>
          </div>
          <SocialMediaPlatforms />
          <p className="mt-4 text-sm text-gray-400">
            Conecta tus cuentas de redes sociales para habilitar la gestión y análisis de contenido multiplataforma.
          </p>
        </section>

        {/* Content Preferences Section */}
        <section className="bg-[#1a1a1a] rounded-xl p-6 border border-[#4CAF50]/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Preferencias de Contenido</h2>
            <span className="text-xs text-gray-400 px-2 py-1 bg-[#2a2a2a] rounded-full">
              Próximamente
            </span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-800">
              <div>
                <h3 className="font-medium">Categorías de Contenido</h3>
                <p className="text-sm text-gray-400">Selecciona tus categorías principales de contenido</p>
              </div>
              <button className="text-[#4CAF50] hover:text-[#45a049] text-sm" disabled>
                Configurar
              </button>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-800">
              <div>
                <h3 className="font-medium">Calendario de Publicación</h3>
                <p className="text-sm text-gray-400">Establece tu frecuencia ideal de publicación de contenido</p>
              </div>
              <button className="text-[#4CAF50] hover:text-[#45a049] text-sm" disabled>
                Configurar
              </button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="font-medium">Preferencias de Análisis</h3>
                <p className="text-sm text-gray-400">Personaliza tu panel de análisis</p>
              </div>
              <button className="text-[#4CAF50] hover:text-[#45a049] text-sm" disabled>
                Configurar
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 