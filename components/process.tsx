const steps = [
  {
    number: "01",
    title: "Discovery",
    description: "Deep dive into your vision, objectives, and market landscape to establish a solid foundation.",
  },
  {
    number: "02",
    title: "Strategy",
    description: "Craft a comprehensive roadmap that aligns technical architecture with business goals.",
  },
  {
    number: "03",
    title: "Design",
    description: "Create sophisticated interfaces that balance aesthetic appeal with functional excellence.",
  },
  {
    number: "04",
    title: "Development",
    description: "Build robust, scalable solutions using cutting-edge technologies and best practices.",
  },
  {
    number: "05",
    title: "Launch",
    description: "Deploy with precision and provide ongoing support to ensure sustained success.",
  },
]

export function Process() {
  return (
    <section id="process" className="py-32 px-6 bg-gradient-to-br from-amber-600 via-yellow-600 to-amber-700 text-amber-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/10 to-transparent animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.15),transparent_50%)] animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-amber-300/5 to-transparent animate-float" />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24 animate-fade-in-up">
          <p className="text-sm tracking-widest text-amber-100/90 mb-6 font-medium animate-fade-in-up delay-300">HOW WE WORK</p>
          <h2 className="text-5xl md:text-7xl font-serif font-bold text-amber-50 text-balance leading-tight drop-shadow-lg animate-fade-in-up delay-500 hover:animate-glow">
            A Refined Process
          </h2>
          <p className="text-lg text-amber-100/90 mt-6 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-700">
            Our systematic approach ensures every project delivers exceptional results
          </p>
        </div>

        <div className="relative">
          <div className="grid md:grid-cols-5 gap-8 relative">
            {steps.map((step, index) => (
              <div 
                key={step.number} 
                className="relative group animate-slide-in-bottom"
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                
                {/* Step Circle Container */}
                <div className="relative flex flex-col items-center">
                  {/* Outer Circle with Enhanced Effects */}
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-amber-200/20 to-yellow-300/20 border-2 border-amber-300/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-amber-200/50 transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-amber-300/30 group-hover:animate-elegant-bounce">
                    {/* Inner Circle */}
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-amber-100 to-yellow-200 flex items-center justify-center group-hover:from-amber-50 group-hover:to-yellow-100 transition-colors duration-700 relative overflow-hidden">
                      <span className="text-2xl md:text-3xl font-serif font-bold text-amber-800 group-hover:text-amber-900 transition-colors duration-500 relative z-10">
                        {step.number}
                      </span>
                      
                      {/* Shimmer Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                    
                    {/* Animated Pulse Ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-amber-300/20 group-hover:border-amber-200/40 group-hover:scale-125 transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:animate-pulse-ring" />
                    
                    {/* Additional Glow Ring */}
                    <div className="absolute inset-0 rounded-full border border-amber-300/10 group-hover:border-amber-200/30 group-hover:scale-150 transition-all duration-1000 opacity-0 group-hover:opacity-100" />
                  </div>
                  
                  {/* Step Content with Enhanced Animations */}
                  <div className="text-center space-y-4 group-hover:translate-y-[-8px] transition-transform duration-500">
                    <h3 className="text-xl md:text-2xl font-serif font-semibold text-amber-50 group-hover:text-yellow-100 transition-colors duration-500 group-hover:drop-shadow-lg">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-base text-amber-100/80 leading-relaxed group-hover:text-amber-50 transition-colors duration-500 text-2xl">
                      {step.description}
                    </p>
                  </div>
                  
                  {/* Subtle Hover Glow */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
                  
                  {/* Floating Particles Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute top-4 left-4 w-1 h-1 bg-amber-300/60 rounded-full animate-float" style={{ animationDelay: '0s' }} />
                    <div className="absolute top-8 right-6 w-1 h-1 bg-yellow-300/60 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
                    <div className="absolute bottom-8 left-6 w-1 h-1 bg-amber-200/60 rounded-full animate-float" style={{ animationDelay: '1s' }} />
                    <div className="absolute bottom-4 right-4 w-1 h-1 bg-yellow-200/60 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <p className="text-amber-100/90 text-lg font-medium drop-shadow-md">
            Ready to experience our refined process?
          </p>
        </div>
      </div>
    </section>
  )
}
