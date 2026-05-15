import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { portfolioItems } from "@/lib/portfolio-data"

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-4 py-24 text-white md:px-8">
      <Link href="/" className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.22em] text-white/60">
        <ArrowLeft className="size-4" />
        NaxyStudios
      </Link>
      <h1 className="mt-16 text-[clamp(4rem,12vw,12rem)] font-black uppercase leading-[0.72] tracking-[-0.09em]">Portfolio</h1>
      <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {portfolioItems.map((item) => (
          <a key={item.title} href={item.sourceUrl} className="border border-white/10 bg-white/[0.04] p-4">
            <div className="aspect-[5/4] bg-white/10" />
            <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-[#d7ff38]">{item.category}</p>
            <h2 className="mt-2 text-3xl font-black uppercase leading-[0.9]">{item.title}</h2>
          </a>
        ))}
      </div>
    </main>
  )
}
