import { Button } from "@/components/ui/button"

export function Contact() {
  return (
    <section id="contact" className="py-32 px-6 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-amber-500/5 to-transparent pointer-events-none animate-pulse" />

      <div className="max-w-4xl mx-auto relative z-10 text-center space-y-8 animate-fade-in-up">
        <div>
          <p className="text-sm tracking-widest text-amber-600 mb-4 font-medium">GET IN TOUCH</p>
          <h2 className="text-4xl md:text-6xl font-light text-foreground text-balance mb-4">
            Ready to start?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The fastest way to move forward is to start your project or book a discovery call. We reply within 1 business day.
          </p>
        </div>

        <div className="flex items-center justify-center">
          <Button className="bg-amber-600 hover:bg-amber-700 text-amber-50 h-12 px-8" asChild>
            <a href="/start-project">Start your project</a>
          </Button>
        </div>

        <div className="text-base text-foreground/70">
          Prefer email? <a href="mailto:hello@styragon.com" className="text-amber-600 hover:text-amber-700">hello@styragon.com</a>
        </div>

        <div className="flex items-center justify-center gap-6 text-base text-muted-foreground">
          <a href="https://www.instagram.com/styragon/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-600">Instagram</a>
          <a href="https://www.linkedin.com/company/54283314/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-600">LinkedIn</a>
          <a href="https://www.facebook.com/styragon" target="_blank" rel="noopener noreferrer" className="hover:text-amber-600">Facebook</a>
        </div>
      </div>
    </section>
  )
}
