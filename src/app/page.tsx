'use client';

import React from 'react';
import Link from "next/link";

export default function Home() {
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
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] opacity-80" />
          
          {/* Content */}
          <div className="relative z-10 text-center px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#4CAF50] to-[#45a049]">
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
        <section className="py-24 px-4 bg-[#1a1a1a]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-[#4CAF50] to-[#45a049]">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="relative">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#4CAF50]/10 rounded-full flex items-center justify-center mb-4 relative">
                    <span className="text-2xl font-bold text-[#4CAF50]">1</span>
                    <div className="hidden md:block absolute top-1/2 left-full w-[calc(200%+2rem)] h-[2px] bg-[#4CAF50] -translate-y-1/2" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-center">Create Ideas</h3>
                  <p className="text-gray-400 text-center">Brainstorm and capture your content ideas in one place</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#4CAF50]/10 rounded-full flex items-center justify-center mb-4 relative">
                    <span className="text-2xl font-bold text-[#4CAF50]">2</span>
                    <div className="hidden md:block absolute top-1/2 left-full w-[calc(200%+2rem)] h-[2px] bg-[#4CAF50] -translate-y-1/2" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-center">Plan & Organize</h3>
                  <p className="text-gray-400 text-center">Structure your content pipeline with our intuitive board</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#4CAF50]/10 rounded-full flex items-center justify-center mb-4 relative">
                    <span className="text-2xl font-bold text-[#4CAF50]">3</span>
                    <div className="hidden md:block absolute top-1/2 left-full w-[calc(200%+2rem)] h-[2px] bg-[#4CAF50] -translate-y-1/2" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-center">Track Progress</h3>
                  <p className="text-gray-400 text-center">Monitor your content from ideation to publication</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#4CAF50]/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-[#4CAF50]">4</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-center">Analyze & Improve</h3>
                  <p className="text-gray-400 text-center">Get insights and optimize your content strategy</p>
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
