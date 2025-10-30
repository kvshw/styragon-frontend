import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { Philosophy } from "@/components/philosophy"
import { Process } from "@/components/process"
import { CaseStudies } from "@/components/case-studies"
import { Blog } from "@/components/blog"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { Testimonials } from "@/components/testimonials"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Services />
      <Philosophy />
      <Process />
      <CaseStudies />
      <Testimonials />
      <Blog />
      <Contact />
      <Footer />
    </main>
  )
}
