'use client';

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import anime from 'animejs';

export default function Home() {
  const [expandedItem, setExpandedItem] = useState<number | null>(2);

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

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-sm">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <svg className="w-8 h-8 text-[#4CAF50]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M16.24 7.76L14.12 14.12L7.76 16.24L9.88 9.88L16.24 7.76Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" fill="currentColor"/>
            </svg>
            <span className="font-semibold text-lg">Creator Compass</span>
          </Link>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Link href="/signin" className="text-gray-300 hover:text-white transition-colors px-4 py-2">
              Sign in
            </Link>
            <Link href="/signup" className="bg-[#4CAF50] text-white hover:bg-[#45a049] transition-colors px-4 py-2 rounded-lg">
              Sign up
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="min-h-screen bg-[#0a0a0a] text-white">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] opacity-80" />
          
          {/* Content */}
          <div className="relative z-10 text-center px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white leading-[1.4] py-2">
              Organize Your Content Journey
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Transform your creative ideas into a structured content strategy. Plan, track, and manage your content across all platforms in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/signin"
                className="bg-transparent border-2 border-[#4CAF50] hover:bg-[#4CAF50]/10 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-24 px-4 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto">
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
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#4CAF50] to-[#45a049]">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-400 text-center mb-16 max-w-2xl mx-auto">
              Choose the plan that best fits your content creation needs
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Free Plan */}
              <div className="bg-[#1a1a1a] rounded-xl p-8 border border-[#4CAF50]/10 hover:border-[#4CAF50]/30 transition-all duration-300">
                <div className="flex flex-col h-full">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-4">Free</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-4xl font-bold">$0</span>
                      <span className="text-gray-400">/month</span>
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
                      <span className="text-4xl font-bold">$19</span>
                      <span className="text-gray-400">/month</span>
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
                      <span className="text-4xl font-bold">$49</span>
                      <span className="text-gray-400">/month</span>
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
        <section className="py-24 px-4 bg-[#1a1a1a]">
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
