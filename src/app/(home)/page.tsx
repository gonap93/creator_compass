'use client';

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import anime from 'animejs';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Pricing from '@/app/components/Pricing';

export default function Home() {
  const [expandedItem, setExpandedItem] = useState<number | null>(2);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const { user } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: (
        <svg className="w-6 h-6 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      ),
      title: "Tablero de Contenido",
      description: "Organiza tu pipeline de contenido con nuestro tablero intuitivo. Arrastra y suelta piezas de contenido entre las columnas 'Ideas', 'En Progreso' y 'Listo para Publicar' para mantener un flujo de trabajo claro."
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Asistente de Contenido AI",
      description: "Permítenos que nuestra IA te ayude a generar ideas de contenido, escribir descripciones atractivas y sugerir temas de tendencia en tu género. Ahorra horas de brainstorming y tiempo de investigación."
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Análisis de Rendimiento",
      description: "Monitorea el rendimiento de tu contenido en todas las plataformas desde un solo panel. Rastrea tasas de engagement, crecimiento de audiencia e identifica tus mejores tipos de contenido."
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Programación Inteligente",
      description: "Programa publicaciones en los momentos óptimos basados en los patrones de actividad de tu audiencia. Nuestra IA analiza datos históricos para sugerir los mejores horarios de publicación para maximizar el engagement."
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16" />
        </svg>
      ),
      title: "Publicación Multiplataforma",
      description: "Crea una vez, publica en todas partes. Adapta automáticamente tu contenido para diferentes plataformas como Instagram, Twitter, LinkedIn y TikTok manteniendo tu voz de marca."
    }
  ];

  useEffect(() => {
    // Only keep the preview component animation
    anime({
      targets: '.preview-component',
      translateX: [20, 0],
      opacity: [0, 1],
      duration: 800,
      easing: 'easeOutCubic'
    });
  }, []);

  const handleItemClick = (index: number) => {
    if (expandedItem === index) {
      setExpandedItem(null);
    } else {
      setExpandedItem(index);
      // Animate the content when expanding
      anime({
        targets: `.feature-content-${index}`,
        height: ['0px', 'auto'],
        opacity: [0, 1],
        duration: 400,
        easing: 'easeOutCubic'
      });
    }
  };

  const handleDashboardClick = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/signin');
    }
  };

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-sm">
        <nav className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <svg 
                className="min-w-[24px] min-h-[24px] w-6 h-6 sm:w-8 sm:h-8 text-[#4CAF50]" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ color: '#4CAF50' }}
              >
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M16.24 7.76L14.12 14.12L7.76 16.24L9.88 9.88L16.24 7.76Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" fill="currentColor"/>
              </svg>
              <span className="font-semibold text-base sm:text-lg">Creator Compass</span>
            </Link>
          </div>
            
          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center gap-8">
              <button 
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-gray-300 hover:text-white transition-colors font-bold"
              >
                Características
              </button>
              <button
                onClick={() => {
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-gray-300 hover:text-white transition-colors font-bold"
              >
                Precios
              </button>
              {false &&
              <button
                onClick={() => {
                  document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-gray-300 hover:text-white transition-colors font-bold"
              >
                Testimonios
              </button>}
            </div>
          </div>

          {/* Auth Buttons and Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <>
                <button
                  onClick={handleDashboardClick}
                  className="hidden md:block bg-[#4CAF50] text-white hover:bg-[#45a049] transition-colors px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base"
                >
                  Ir al Panel
                </button>
                <button
                  onClick={() => router.push('/dashboard/profile')}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName || 'Profile'}
                      width={32}
                      height={32}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#4CAF50] flex items-center justify-center text-white">
                      {user.displayName?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                </button>
              </>
            ) : (
              <>
                <Link href="/signin" className="block text-gray-300 hover:text-white transition-colors px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base active:bg-white/10 rounded-lg touch-manipulation">
                  Iniciar Sesión
                </Link>
                <Link href="/signup" className="block bg-[#4CAF50] text-white hover:bg-[#45a049] transition-colors px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base active:bg-[#3d8b40] touch-manipulation">
                  Registrarse
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white ml-1"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-sm border-t border-gray-800">
            <div className="px-4 py-3 space-y-3">
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="block w-full text-left text-gray-300 hover:text-white transition-colors font-medium py-2"
              >
                Características
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="block w-full text-left text-gray-300 hover:text-white transition-colors font-medium py-2"
              >
                Precios
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="block w-full text-left text-gray-300 hover:text-white transition-colors font-medium py-2"
              >
                Testimonios
              </button>
              {user && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleDashboardClick();
                  }}
                  className="block w-full text-left text-gray-300 hover:text-white transition-colors font-medium py-2"
                >
                  Ir al Panel
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="min-h-screen translate-y-10 bg-[#0a0a0a] text-white relative overflow-hidden">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[#0a0a0a]" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#4CAF50]/5 via-[#0a0a0a] to-[#0a0a0a]" />
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(74, 175, 80, 0.05) 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px]">
              <div className="absolute inset-0 bg-[#4CAF50]/3 rounded-full blur-[120px] opacity-30" />
            </div>
          </div>

          {/* Content Container */}
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Column - Text Content */}
              <div className="flex flex-col max-w-2xl lg:max-w-none">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1a1a] border border-[#4CAF50]/20 mb-8 self-start">
                  <span className="text-[#4CAF50] text-sm font-medium">Novedades</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400 text-sm">Proximamente v1.0</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6">
                  <div className="whitespace-nowrap">
                    <span className="bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] text-transparent bg-clip-text">Planificá tus </span>
                    <span className="text-white">ideas.</span>
                  </div>
                  <div className="whitespace-nowrap">
                    <span className="bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] text-transparent bg-clip-text">Potenciá tus </span>
                    <span className="text-white">redes.</span>
                  </div>
                </h1>

                <p className="text-lg sm:text-xl text-gray-400 mb-8 leading-relaxed">
                  Transforma tus ideas creativas en una estrategia de contenido estructurada. Planifica, rastrea y gestiona tu contenido en todas las plataformas desde un solo lugar.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  {user ? (
                    <button
                      onClick={handleDashboardClick}
                      className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#4CAF50] text-white font-medium hover:bg-[#45a049] transition-all duration-300 hover:scale-[1.02] active:bg-[#3d8b40] touch-manipulation"
                    >
                      Ir al Panel
                      <svg className="ml-2 -mr-1 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  ) : (
                    <>
                      <Link
                        href="/signup"
                        className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#4CAF50] text-white font-medium hover:bg-[#45a049] transition-all duration-300 hover:scale-[1.02] active:bg-[#3d8b40] touch-manipulation"
                      >
                        Comenzar
                        <svg className="ml-2 -mr-1 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                      <Link
                        href="/signin"
                        className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#1a1a1a] text-white font-medium border border-[#4CAF50]/20 hover:bg-[#4CAF50]/5 hover:border-[#4CAF50]/40 transition-all duration-300"
                      >
                        Iniciar Sesión
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Right Column - App Preview */}
              <div className="relative lg:ml-4">
                <div className="relative w-[140%] aspect-[16/10] bg-[#1a1a1a] rounded-xl border border-[#4CAF50]/10 shadow-2xl shadow-black/20 overflow-hidden translate-x-[10%]">
                  <div className="absolute top-0 left-0 right-0 h-8 bg-[#0a0a0a] flex items-center px-4 z-10">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  <div className="absolute inset-20 pt-5 translate-x-[11%] translate-y-[1%] scale-[145%]">
                    <Image
                      src="/content-board.jpg"
                      alt="Content Board Interface"
                      width={1200}
                      height={800}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                  {/* Reflection/Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#4CAF50]/5 to-transparent pointer-events-none"></div>
                </div>
                {/* Background Glow */}
                <div className="absolute -inset-1 translate-y-5 bg-gradient-to-r from-[#4CAF50]/20 to-[#2E7D32]/20 rounded-xl blur-2xl opacity-50 -z-10"></div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="features" className="relative py-20 px-4">
          <div className="absolute inset-0 bg-[#0a0a0a]" />
          <div className="relative z-10 max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-center mb-20 text-white">
            Tu nuevo partner creativo <br className="hidden sm:block" /> en acción
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Features List */}
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`bg-[#1a1a1a] rounded-xl transition-all duration-300 cursor-pointer border ${
                      expandedItem === index ? 'border-[#4CAF50]' : 'border-[#4CAF50]/10 hover:border-[#4CAF50]/30'
                    }`}
                  >
                    <div
                      className="p-6 flex items-center justify-between gap-4"
                      onClick={() => handleItemClick(index)}
                    >
                      <div className="flex items-center gap-4">
                        {feature.icon}
                        <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                      </div>
                      <svg
                        className={`w-6 h-6 transform transition-transform ${
                          expandedItem === index ? 'rotate-45' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        {expandedItem === index ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        )}
                      </svg>
                    </div>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        expandedItem === index ? 'max-h-48' : 'max-h-0'
                      } feature-content-${index}`}
                    >
                      <div className="p-6 pt-0 text-gray-400">
                        {feature.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Preview Component */}
              <div className="preview-component sticky top-24 bg-[#1a1a1a] rounded-xl border border-[#4CAF50]/10 overflow-hidden">
                <div className="relative aspect-[4/3]">
                  {/* Mock Content Board Interface */}
                  <div className="absolute inset-0 bg-[#1a1a1a] p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-[#4CAF50]"></div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-8 bg-[#4CAF50]/10 rounded-lg"></div>
                        <div className="w-8 h-8 bg-[#4CAF50]/10 rounded-lg"></div>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="grid grid-cols-3 gap-4">
                      {/* Column 1 */}
                      <div className="bg-[#0a0a0a] rounded-lg p-3">
                        <div className="flex items-center justify-between mb-3">
                          <div className="h-4 w-20 bg-[#4CAF50]/20 rounded"></div>
                          <div className="h-4 w-4 bg-[#4CAF50]/20 rounded"></div>
                        </div>
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="bg-[#1a1a1a] rounded-lg p-3 mb-2">
                            <div className="h-3 w-3/4 bg-[#4CAF50]/10 rounded mb-2"></div>
                            <div className="h-2 w-1/2 bg-[#4CAF50]/10 rounded"></div>
                          </div>
                        ))}
                      </div>

                      {/* Column 2 */}
                      <div className="bg-[#0a0a0a] rounded-lg p-3">
                        <div className="flex items-center justify-between mb-3">
                          <div className="h-4 w-24 bg-[#4CAF50]/20 rounded"></div>
                          <div className="h-4 w-4 bg-[#4CAF50]/20 rounded"></div>
                        </div>
                        {[...Array(2)].map((_, i) => (
                          <div key={i} className="bg-[#1a1a1a] rounded-lg p-3 mb-2">
                            <div className="h-3 w-2/3 bg-[#4CAF50]/10 rounded mb-2"></div>
                            <div className="h-2 w-1/2 bg-[#4CAF50]/10 rounded"></div>
                          </div>
                        ))}
                      </div>

                      {/* Column 3 */}
                      <div className="bg-[#0a0a0a] rounded-lg p-3">
                        <div className="flex items-center justify-between mb-3">
                          <div className="h-4 w-16 bg-[#4CAF50]/20 rounded"></div>
                          <div className="h-4 w-4 bg-[#4CAF50]/20 rounded"></div>
                        </div>
                        {[...Array(2)].map((_, i) => (
                          <div key={i} className="bg-[#1a1a1a] rounded-lg p-3 mb-2">
                            <div className="h-3 w-5/6 bg-[#4CAF50]/10 rounded mb-2"></div>
                            <div className="h-2 w-1/3 bg-[#4CAF50]/10 rounded"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4CAF50]/5 to-transparent pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <Pricing 
          id="pricing" 
          className="py-24 px-4" 
          billingPeriod={billingPeriod} 
          setBillingPeriod={setBillingPeriod} 
        />

        {/* Testimonials Section - Hidden for now */}
        {false && (
          <section id="testimonials" className="py-24 px-4 bg-[#1a1a1a]">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#4CAF50] to-[#45a049]">
                Lo que dicen los Creadores
              </h2>
              <p className="text-xl text-gray-400 text-center mb-16 max-w-2xl mx-auto">
                Únete a miles de creadores de contenido que confían en Creator Compass
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Testimonial 1 */}
                <div className="bg-[#0a0a0a] rounded-xl p-8 border border-[#4CAF50]/10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-[#4CAF50]/10 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-[#4CAF50]">S</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Sofía Rodríguez</h3>
                      <p className="text-sm text-gray-400">Creadora de Contenido</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6">
                    &ldquo;Creator Compass ha transformado la forma en que gestiono mi contenido. Las herramientas de organización son increíbles y los análisis me ayudan a entender qué funciona.&rdquo;
                  </p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-[#4CAF50]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>

                {/* Testimonial 2 */}
                <div className="bg-[#0a0a0a] rounded-xl p-8 border border-[#4CAF50]/10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-[#4CAF50]/10 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-[#4CAF50]">M</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Martín González</h3>
                      <p className="text-sm text-gray-400">YouTuber</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6">
                    &ldquo;La función del tablero de contenido es revolucionaria. Finalmente puedo hacer un seguimiento de todas mis ideas de videos y su progreso en un solo lugar. ¡Los análisis también son súper útiles!&rdquo;
                  </p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-[#4CAF50]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>

                {/* Testimonial 3 */}
                <div className="bg-[#0a0a0a] rounded-xl p-8 border border-[#4CAF50]/10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-[#4CAF50]/10 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-[#4CAF50]">A</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Alejandro Martínez</h3>
                      <p className="text-sm text-gray-400">Gerente de Redes Sociales</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6">
                    &ldquo;Gestionar múltiples cuentas de redes sociales es mucho más fácil ahora. Las funciones de programación y análisis me ahorran horas cada semana. ¡Vale cada peso!&rdquo;
                  </p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-[#4CAF50]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
