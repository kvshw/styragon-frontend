import Image from "next/image"

export function Footer() {
  return (
    <footer className="py-16 px-6 border-t border-border relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4 animate-fade-in-up">
            <div className="flex items-center gap-3 group">
              <Image src="/styragon-logo.png" alt="Styragon" width={40} height={40} className="w-10 h-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3" />
              <div className="text-2xl font-serif font-semibold tracking-wider text-amber-600 group-hover:text-amber-500 transition-colors duration-500">STYRAGON</div>
            </div>
            <p className="text-base text-muted-foreground leading-relaxed hover:text-foreground transition-colors duration-300">
              Crafting premium digital experiences for discerning clients worldwide.
            </p>
          </div>

          <div className="space-y-4 animate-fade-in-up delay-300">
            <h4 className="text-sm tracking-widest text-foreground font-serif font-semibold hover:text-amber-600 transition-colors duration-300">SERVICES</h4>
            <ul className="space-y-2 text-base text-muted-foreground">
              <li>
                <a href="#" className="hover:text-amber-600 transition-all duration-300 hover:translate-x-1 block">
                  SAAS Development
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-600 transition-all duration-300 hover:translate-x-1 block">
                  Web Design
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-600 transition-all duration-300 hover:translate-x-1 block">
                  Custom Development
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-600 transition-all duration-300 hover:translate-x-1 block">
                  Digital Strategy
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4 animate-fade-in-up delay-500">
            <h4 className="text-sm tracking-widest text-foreground font-serif font-semibold hover:text-amber-600 transition-colors duration-300">COMPANY</h4>
            <ul className="space-y-2 text-base text-muted-foreground">
              <li>
                <a href="#" className="hover:text-amber-600 transition-all duration-300 hover:translate-x-1 block">
                  About
                </a>
              </li>
              <li>
                <a href="#work" className="hover:text-amber-600 transition-all duration-300 hover:translate-x-1 block">
                  Work
                </a>
              </li>
              <li>
                <a href="/blog-section" className="hover:text-amber-600 transition-all duration-300 hover:translate-x-1 block">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-600 transition-all duration-300 hover:translate-x-1 block">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-600 transition-all duration-300 hover:translate-x-1 block">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4 animate-fade-in-up delay-700">
            <h4 className="text-sm tracking-widest text-foreground font-serif font-semibold hover:text-amber-600 transition-colors duration-300">CONNECT</h4>
            <ul className="space-y-2 text-base text-muted-foreground">
              <li>
                <a href="#" className="hover:text-amber-600 transition-all duration-300 hover:translate-x-1 block">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-600 transition-all duration-300 hover:translate-x-1 block">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-600 transition-all duration-300 hover:translate-x-1 block">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-600 transition-all duration-300 hover:translate-x-1 block">
                  Dribbble
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-base text-muted-foreground animate-fade-in-up delay-1000">
          <p className="hover:text-foreground transition-colors duration-300">© 2025 Styragon. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-amber-600 transition-all duration-300 hover:translate-y-[-2px]">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-amber-600 transition-all duration-300 hover:translate-y-[-2px]">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
