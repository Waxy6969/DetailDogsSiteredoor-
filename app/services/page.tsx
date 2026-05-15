import Link from "next/link"
import { ArrowLeft } from "lucide-react"

const services = [
  ["Social Revamp", "$70+", "Headers, avatars, and profile systems."],
  ["Stream Package", "$120+", "Creator overlays, graphics, and launch visuals."],
  ["Graphic Design", "$40+", "Custom product, campaign, and brand assets."],
  ["3D Character", "$150+", "Stylized character and motion-led design."],
]

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-4 py-24 text-white md:px-8">
      <Link href="/" className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.22em] text-white/60">
        <ArrowLeft className="size-4" />
        NaxyStudios
      </Link>
      <h1 className="mt-16 text-[clamp(4rem,12vw,12rem)] font-black uppercase leading-[0.72] tracking-[-0.09em]">Services</h1>
      <div className="mt-12 grid border-t border-white/12">
        {services.map(([name, price, copy]) => (
          <article key={name} className="grid gap-4 border-b border-white/12 py-8 md:grid-cols-[1fr_0.3fr_1fr] md:items-center">
            <h2 className="text-4xl font-black uppercase tracking-[-0.05em]">{name}</h2>
            <p className="text-3xl font-black text-[#d7ff38]">{price}</p>
            <p className="text-white/62">{copy}</p>
          </article>
        ))}
      </div>
    </main>
  )
}
