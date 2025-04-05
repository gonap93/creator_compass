'use client';

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import anime from 'animejs';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
      title: "Content Board",
      description: "Organize your content pipeline with our intuitive board view. Drag and drop content pieces between 'Ideas', 'In Progress', and 'Ready to Publish' columns to maintain a clear workflow."
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "AI Content Assistant",
      description: "Let our AI help you generate content ideas, write engaging captions, and suggest trending topics in your niche. Save hours of brainstorming and research time."
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Performance Analytics",
      description: "Track your content's performance across all platforms in one dashboard. Monitor engagement rates, audience growth, and identify your best-performing content types."
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Smart Scheduling",
      description: "Schedule posts at optimal times based on your audience's activity patterns. Our AI analyzes historical data to suggest the best posting times for maximum engagement."
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16" />
        </svg>
      ),
      title: "Cross-Platform Publishing",
      description: "Create once, publish everywhere. Automatically adapt your content for different platforms like Instagram, Twitter, LinkedIn, and TikTok while maintaining your brand voice."
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
      router.push('/dashboard/content');
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
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#4CAF50]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                Features
              </button>
              <button
                onClick={() => {
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-gray-300 hover:text-white transition-colors font-bold"
              >
                Pricing
              </button>
              <button
                onClick={() => {
                  document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-gray-300 hover:text-white transition-colors font-bold"
              >
                Testimonials
              </button>
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
                  Go to Dashboard
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
                  Sign in
                </Link>
                <Link href="/signup" className="block bg-[#4CAF50] text-white hover:bg-[#45a049] transition-colors px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base active:bg-[#3d8b40] touch-manipulation">
                  Sign up
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
                Features
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="block w-full text-left text-gray-300 hover:text-white transition-colors font-medium py-2"
              >
                Pricing
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="block w-full text-left text-gray-300 hover:text-white transition-colors font-medium py-2"
              >
                Testimonials
              </button>
              {user && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleDashboardClick();
                  }}
                  className="block w-full text-left text-gray-300 hover:text-white transition-colors font-medium py-2"
                >
                  Go to Dashboard
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
        {/* Hero Section */}
        <section className="relative min-h-[100svh] flex flex-col items-center justify-center px-4 pt-24 pb-16 sm:py-32">
          {/* Background gradient */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[#0a0a0a]" />
            {/* Multiple overlapping gradients for smoother transition */}
            <div className="absolute inset-0">
              {/* Base gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#4CAF50]/3 from-0% via-[#0a0a0a] via-70% to-[#0a0a0a] to-100%" />
              {/* Subtle overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent from-60% via-[#0a0a0a]/80 via-80% to-[#0a0a0a] to-100%" />
              {/* Extended glow effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1000px]">
                <div className="absolute inset-0 bg-[#4CAF50]/3 rounded-[100%] blur-[150px] opacity-50" />
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 max-w-[1200px] mx-auto text-center">
            <h1 className="text-[2.5rem] sm:text-6xl md:text-8xl font-bold mb-4 sm:mb-8 leading-[1.1] tracking-tight bg-gradient-to-b from-[#4CAF50] to-[#2E7D32] text-transparent bg-clip-text pb-4">
              Organize Your Content<br className="hidden sm:block" />Journey
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-16 max-w-3xl mx-auto font-light leading-relaxed px-4 sm:px-0">
              Transform your creative ideas into a structured content strategy. Plan, track, and manage your content across all platforms in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-16 px-6 sm:px-0">
              {user ? (
                <button
                  onClick={handleDashboardClick}
                  className="w-full sm:w-auto bg-[#4CAF50] hover:bg-[#45a049] text-white px-6 sm:px-10 py-4 rounded-lg text-lg sm:text-xl font-medium transition-all duration-300 hover:scale-105 active:bg-[#3d8b40] touch-manipulation relative z-20"
                >
                  Go to Dashboard
                </button>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="w-full sm:w-auto bg-[#4CAF50] hover:bg-[#45a049] text-white px-6 sm:px-10 py-4 rounded-lg text-lg sm:text-xl font-medium transition-all duration-300 hover:scale-105 active:bg-[#3d8b40] touch-manipulation relative z-20"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/signin"
                    className="w-full sm:w-auto bg-transparent border-2 border-[#4CAF50] hover:bg-[#4CAF50]/10 text-white px-6 sm:px-10 py-4 rounded-lg text-lg sm:text-xl font-medium transition-all duration-300 active:bg-[#4CAF50]/20 touch-manipulation relative z-20"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Device Previews */}
            <div className="relative w-full max-w-[90%] sm:max-w-7xl mx-auto mt-4 sm:mt-8">
              {/* Glow Effects */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#4CAF50]/20 rounded-full blur-[100px] opacity-40" />
                <div className="absolute top-1/2 left-1/2 -translate-x-[45%] -translate-y-1/2 w-[600px] h-[600px] bg-[#2E7D32]/20 rounded-full blur-[100px] opacity-40" />
              </div>

              {/* MacBook Preview */}
              <div className="relative w-full sm:w-[1200px] bg-[#1a1a1a] rounded-lg border border-gray-800 shadow-2xl transform hover:scale-[1.02] transition-transform duration-300 mx-auto">
                <div className="absolute top-0 left-0 right-0 h-6 sm:h-8 bg-[#0a0a0a] rounded-t-lg flex items-center px-4">
                  <div className="flex gap-1.5 sm:gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="pt-6 sm:pt-8">
                  <Image
                    src="/content-board.jpg"
                    alt="Content Board Interface"
                    width={1200}
                    height={800}
                    className="w-full h-auto rounded-b-lg"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="features" className="relative py-24 px-4">
          <div className="absolute inset-0 bg-[#0a0a0a]" />
          <div className="relative z-10 max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-20 text-white">
              How It Works
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
        <section id="pricing" className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#4CAF50] to-[#45a049]">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-400 text-center mb-16 max-w-2xl mx-auto">
              Choose the plan that best fits your content creation needs
            </p>
            
            {/* Billing Period Toggle */}
            <div className="flex flex-col items-center justify-center mb-12">
              <div className="flex flex-col items-center gap-3">
                <div className="bg-[#1a1a1a] rounded-full p-1 flex items-center">
                  <button
                    onClick={() => setBillingPeriod('monthly')}
                    className={`relative z-10 px-6 py-2 rounded-full transition-colors ${
                      billingPeriod === 'monthly'
                        ? 'bg-[#4CAF50] text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingPeriod('yearly')}
                    className={`relative z-10 px-6 py-2 rounded-full transition-colors ${
                      billingPeriod === 'yearly'
                        ? 'bg-[#4CAF50] text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Yearly
                  </button>
                </div>
                <span className="text-sm bg-[#4CAF50]/10 text-[#4CAF50] px-3 py-1 rounded-full">
                  Save 20% Yearly
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Free Plan */}
              <div className="bg-[#1a1a1a] rounded-xl p-8 border border-[#4CAF50]/10 hover:border-[#4CAF50]/30 transition-all duration-300">
                <div className="flex flex-col h-full">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-4">Free</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-4xl font-bold">$0</span>
                      <span className="text-gray-400">/{billingPeriod === 'monthly' ? 'month' : 'year'}</span>
                    </div>
                    <p className="text-gray-400">Perfect for getting started with content planning</p>
                  </div>
                  <ul className="space-y-4 mb-8 flex-grow">
                    <li className="flex items-center gap-2 text-gray-300">
                      <svg className="w-5 h-5 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Up to 10 content ideas
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <svg className="w-5 h-5 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Basic analytics
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <svg className="w-5 h-5 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Single platform support
                    </li>
                  </ul>
                  <Link
                    href="/signup"
                    className="bg-transparent border-2 border-[#4CAF50] hover:bg-[#4CAF50]/10 text-white px-8 py-3 rounded-lg text-center font-medium transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              </div>

              {/* Pro Plan */}
              <div className="bg-[#1a1a1a] rounded-xl p-8 border-2 border-[#4CAF50] relative transform hover:scale-105 transition-all duration-300">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#4CAF50] text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
                <div className="flex flex-col h-full">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-4">Pro</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-4xl font-bold">
                        ${billingPeriod === 'monthly' ? '19' : '15'}
                      </span>
                      <span className="text-gray-400">/{billingPeriod === 'monthly' ? 'month' : 'year'}</span>
                    </div>
                    <p className="text-gray-400">For growing content creators</p>
                  </div>
                  <ul className="space-y-4 mb-8 flex-grow">
                    <li className="flex items-center gap-2 text-gray-300">
                      <svg className="w-5 h-5 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Unlimited content ideas
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <svg className="w-5 h-5 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Advanced analytics
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <svg className="w-5 h-5 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Multi-platform support
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <svg className="w-5 h-5 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Content calendar
                    </li>
                  </ul>
                  <Link
                    href="/signup"
                    className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-8 py-3 rounded-lg text-center font-medium transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              </div>

              {/* Business Plan */}
              <div className="bg-[#1a1a1a] rounded-xl p-8 border border-[#4CAF50]/10 hover:border-[#4CAF50]/30 transition-all duration-300">
                <div className="flex flex-col h-full">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-4">Business</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-4xl font-bold">
                        ${billingPeriod === 'monthly' ? '49' : '39'}
                      </span>
                      <span className="text-gray-400">/{billingPeriod === 'monthly' ? 'month' : 'year'}</span>
                    </div>
                    <p className="text-gray-400">For professional content teams</p>
                  </div>
                  <ul className="space-y-4 mb-8 flex-grow">
                    <li className="flex items-center gap-2 text-gray-300">
                      <svg className="w-5 h-5 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Everything in Pro
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <svg className="w-5 h-5 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Team collaboration
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <svg className="w-5 h-5 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Custom workflows
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <svg className="w-5 h-5 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Priority support
                    </li>
                  </ul>
                  <Link
                    href="/signup"
                    className="bg-transparent border-2 border-[#4CAF50] hover:bg-[#4CAF50]/10 text-white px-8 py-3 rounded-lg text-center font-medium transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 px-4 bg-[#1a1a1a]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#4CAF50] to-[#45a049]">
              What Creators Say
            </h2>
            <p className="text-xl text-gray-400 text-center mb-16 max-w-2xl mx-auto">
              Join thousands of content creators who trust Creator Compass
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-[#0a0a0a] rounded-xl p-8 border border-[#4CAF50]/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#4CAF50]/10 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-[#4CAF50]">S</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Sarah Johnson</h3>
                    <p className="text-sm text-gray-400">Content Creator</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-6">
                  &ldquo;Creator Compass has transformed how I manage my content. The organization tools are incredible, and the analytics help me understand what works.&rdquo;
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
                    <h3 className="font-semibold">Michael Chen</h3>
                    <p className="text-sm text-gray-400">YouTuber</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-6">
                  &ldquo;The content board feature is a game-changer. I can finally keep track of all my video ideas and their progress in one place. The analytics are super helpful too!&rdquo;
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
                    <h3 className="font-semibold">Alex Rivera</h3>
                    <p className="text-sm text-gray-400">Social Media Manager</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-6">
                  &ldquo;Managing multiple social media accounts is so much easier now. The scheduling and analytics features save me hours every week. Worth every penny!&rdquo;
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
      </main>
    </>
  );
}
