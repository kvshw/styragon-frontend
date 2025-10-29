export function Philosophy() {
  return (
    <section id="philosophy" className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-amber-500/10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent pointer-events-none animate-pulse" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-fade-in-left">
            <div className="animate-fade-in-up delay-300">
              <p className="text-sm tracking-widest text-amber-600 mb-4 font-medium">OUR PHILOSOPHY</p>
              <h2 className="text-5xl md:text-6xl font-serif font-bold leading-tight text-foreground text-balance hover:text-amber-600 transition-colors duration-500">
                Where Innovation Meets Elegance
              </h2>
            </div>
            <div className="space-y-6 text-foreground/75 leading-relaxed text-base animate-fade-in-up delay-500">
              <p className="hover:text-foreground transition-colors duration-300 group">
                We believe exceptional digital products are born from the intersection of meticulous craft, strategic
                thinking, and unwavering attention to detail.
              </p>
              <p className="hover:text-foreground transition-colors duration-300 group">
                Every project we undertake is an opportunity to push boundaries, challenge conventions, and create
                experiences that resonate deeply with users while driving measurable business outcomes.
              </p>
              <p className="hover:text-foreground transition-colors duration-300 group">
                Our approach combines technical excellence with design sophistication, ensuring your digital presence
                not only functions flawlessly but captivates and converts.
              </p>
            </div>
          </div>

          <div className="relative h-[600px] rounded-lg overflow-hidden border border-border/50 shadow-2xl shadow-amber-500/10 group animate-fade-in-right hover:shadow-amber-500/20 transition-all duration-700 hover:scale-105">
            <img src="/luxury_abstract.png" alt="Our studio workspace" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent group-hover:from-background/40 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>
        </div>
      </div>
    </section>
  )
}
