"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Menu, X } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export function Hero() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/luxury-abstract-dark-elegant-texture.jpg" alt="" className="w-full h-full object-cover opacity-20 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background transition-all duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 via-transparent to-amber-500/10 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-amber-500/5 to-transparent animate-pulse" />
      </div>

      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-20 px-4 sm:px-6 py-6 sm:py-8 backdrop-blur-sm bg-background/10 border-b border-border/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 group">
            <Image src="/styragon-logo.png" alt="Styragon" width={48} height={48} className="w-10 h-10 sm:w-12 sm:h-12 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3" />
            <span className="text-lg sm:text-xl md:text-2xl font-serif font-semibold tracking-wider text-amber-600 transition-all duration-500 group-hover:text-amber-500 group-hover:drop-shadow-lg">STYRAGON</span>
          </div>
          <div className="hidden md:flex items-center gap-8 lg:gap-12 text-base lg:text-lg tracking-wide font-medium">
            <a href="#services" className="hover:text-amber-600 transition-all duration-300 hover:scale-105 relative group">
              Services
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#work" className="hover:text-amber-600 transition-all duration-300 hover:scale-105 relative group">
              Work
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#philosophy" className="hover:text-amber-600 transition-all duration-300 hover:scale-105 relative group">
              Philosophy
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#blog" className="hover:text-amber-600 transition-all duration-300 hover:scale-105 relative group">
              Blog
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#contact" className="hover:text-amber-600 transition-all duration-300 hover:scale-105 relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden hover:bg-amber-600/10 transition-all duration-300 text-base"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div className="fixed inset-0 bg-background/95 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border/20">
            <div className="px-4 py-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3 group">
                  <Image src="/styragon-logo.png" alt="Styragon" width={48} height={48} className="w-10 h-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3" />
                  <span className="text-xl font-serif font-semibold tracking-wider text-amber-600 transition-all duration-500 group-hover:text-amber-500 group-hover:drop-shadow-lg">STYRAGON</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hover:bg-amber-600/10 transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="space-y-4">
                <a 
                  href="#services" 
                  className="block py-3 text-lg font-medium text-foreground hover:text-amber-600 transition-colors duration-300 border-b border-border/20"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Services
                </a>
                <a 
                  href="#work" 
                  className="block py-3 text-lg font-medium text-foreground hover:text-amber-600 transition-colors duration-300 border-b border-border/20"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Work
                </a>
                <a 
                  href="#philosophy" 
                  className="block py-3 text-lg font-medium text-foreground hover:text-amber-600 transition-colors duration-300 border-b border-border/20"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Philosophy
                </a>
                <a 
                  href="#blog" 
                  className="block py-3 text-lg font-medium text-foreground hover:text-amber-600 transition-colors duration-300 border-b border-border/20"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Blog
                </a>
                <a 
                  href="#contact" 
                  className="block py-3 text-lg font-medium text-foreground hover:text-amber-600 transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </a>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center space-y-6 sm:space-y-8 px-4 sm:px-6 animate-fade-in-up">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-serif font-bold leading-[0.95] tracking-tight text-balance text-foreground animate-fade-in-up">
          Crafting Digital
          <span className="block text-amber-600 animate-pulse hover:animate-none transition-all duration-500 hover:text-amber-500 hover:drop-shadow-2xl">Excellence</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-foreground/80 max-w-3xl mx-auto leading-relaxed text-pretty font-light animate-fade-in-up delay-300">
          We architect premium SAAS platforms and bespoke web experiences that transcend expectations
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-6 sm:pt-8 animate-fade-in-up delay-500">
          <Button
            size="lg"
            className="bg-amber-600 text-amber-50 hover:bg-amber-700 group px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-serif font-semibold shadow-lg shadow-amber-600/25 hover:shadow-amber-600/40 hover:scale-105 transition-all duration-300"
          >
            Start Your Project
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-border hover:bg-card bg-transparent px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-serif font-semibold hover:border-amber-600 hover:text-amber-600 hover:scale-105 transition-all duration-300"
          >
            View Our Work
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs tracking-widest text-muted-foreground font-serif">SCROLL</span>
        <div className="w-px h-12 bg-amber-600/40" />
      </div>
    </section>
  )
}
