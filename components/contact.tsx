import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function Contact() {
  return (
    <section id="contact" className="py-32 px-6 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-amber-500/5 to-transparent pointer-events-none animate-pulse" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <p className="text-sm tracking-widest text-amber-600 mb-4 font-medium animate-fade-in-up delay-300">GET IN TOUCH</p>
          <h2 className="text-4xl md:text-6xl font-light text-foreground text-balance mb-6 animate-fade-in-up delay-500 hover:text-amber-600 transition-colors duration-500">
            Let's Create Something Extraordinary
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-700">
            Share your vision with us, and we'll craft a digital experience that exceeds expectations.
          </p>
        </div>

        <form className="space-y-6 animate-fade-in-up delay-1000">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2 group">
              <label htmlFor="name" className="text-sm tracking-wide text-foreground group-hover:text-amber-600 transition-colors duration-300">
                Name
              </label>
              <Input 
                id="name" 
                placeholder="Your name" 
                className="bg-background border-border focus:border-amber-600 focus:ring-amber-600/20 transition-all duration-300 hover:border-amber-500/50" 
              />
            </div>
            <div className="space-y-2 group">
              <label htmlFor="email" className="text-sm tracking-wide text-foreground group-hover:text-amber-600 transition-colors duration-300">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="bg-background border-border focus:border-amber-600 focus:ring-amber-600/20 transition-all duration-300 hover:border-amber-500/50"
              />
            </div>
          </div>

          <div className="space-y-2 group">
            <label htmlFor="company" className="text-sm tracking-wide text-foreground group-hover:text-amber-600 transition-colors duration-300">
              Company
            </label>
            <Input
              id="company"
              placeholder="Your company name"
              className="bg-background border-border focus:border-amber-600 focus:ring-amber-600/20 transition-all duration-300 hover:border-amber-500/50"
            />
          </div>

          <div className="space-y-2 group">
            <label htmlFor="message" className="text-sm tracking-wide text-foreground group-hover:text-amber-600 transition-colors duration-300">
              Project Details
            </label>
            <Textarea
              id="message"
              placeholder="Tell us about your project..."
              rows={6}
              className="bg-background border-border focus:border-amber-600 focus:ring-amber-600/20 resize-none transition-all duration-300 hover:border-amber-500/50"
            />
          </div>

          <Button 
            size="lg" 
            className="w-full bg-amber-600 text-amber-50 hover:bg-amber-700 shadow-lg shadow-amber-600/25 hover:shadow-amber-600/40 hover:scale-105 transition-all duration-300 group"
          >
            <span className="group-hover:animate-pulse">Submit Inquiry</span>
          </Button>
        </form>
      </div>
    </section>
  )
}
