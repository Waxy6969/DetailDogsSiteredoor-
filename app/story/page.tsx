import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function StoryPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-4 py-24 text-white md:px-8">
      <Link href="/" className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.22em] text-white/60">
        <ArrowLeft className="size-4" />
        NaxyStudios
      </Link>
      <h1 className="mt-16 text-[clamp(4rem,12vw,12rem)] font-black uppercase leading-[0.72] tracking-[-0.09em]">
        Struggle
        <span className="block text-white/20">To Signal</span>
      </h1>
      <p className="mt-10 max-w-3xl text-2xl leading-10 text-white/68">
        NaxyStudios was born from pressure and rebuilt through passion: a shift from smudged paper and frustration into a digital creative system built for art, fashion, motion, and brand identity.
      </p>
    </main>
  )
}
