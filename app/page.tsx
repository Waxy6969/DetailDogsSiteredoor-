import Link from "next/link"
import { ArrowUpRight, Mail, ShoppingBag, Sparkles } from "lucide-react"
import { portfolioItems } from "@/lib/portfolio-data"

const navItems = ["Home", "Shop", "Services", "Portfolio", "Story", "Contact"]

const products = [
  {
    name: "Ascension. Hoodie",
    price: "$38.50",
    image: "/naxy/product-hoodie.jpg",
    href: "https://www.ebay.com/itm/377180830375",
    condition: "New with tags",
    shipping: "+$8.49 Economy Shipping",
    inventory: "5 available",
    colors: "Black, Maroon, Red, Indigo Blue, Heliconia, Sport Grey, Light Pink",
    sizes: "S, M, L, XL, 2XL, 3XL, 4XL, 5XL",
  },
]

const services = [
  ["01", "Graphic Design", "Custom visual systems, campaign layouts, product drops, and brand assets."],
  ["02", "Apparel", "One-of-one streetwear concepts, print files, mockups, and eBay-ready presentation."],
  ["03", "AI Visuals", "AI-assisted images and motion pieces tuned into finished creative direction."],
  ["04", "Brand Builds", "Logos, launch pages, product storytelling, and creator-facing digital systems."],
]

const clients = [
  { name: "D4K", image: "/naxy/client-d4k.png" },
  { name: "Custom", image: "/naxy/client-custom.png" },
  { name: "Logo 1", image: "/naxy/client-logo1.png" },
  { name: "Final Logo", image: "/naxy/client-final.png" },
]

function ChapterLabel({ number, label }: { number: string; label: string }) {
  return (
    <div className="mb-8 flex items-center gap-4 text-xs font-black uppercase tracking-[0.28em] text-white/55">
      <span className="grid size-12 place-items-center border border-white/20 text-[#d7ff38]">{number}</span>
      <span>{label}</span>
    </div>
  )
}

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#050505]/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1700px] items-center gap-5 px-4 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid size-10 place-items-center bg-[#d7ff38] text-sm font-black text-black">N</div>
            <span className="text-sm font-black uppercase tracking-[0.24em]">NaxyStudios</span>
          </Link>
          <nav className="ml-auto hidden items-center gap-7 text-[11px] font-black uppercase tracking-[0.22em] text-white/55 lg:flex">
            {navItems.map((item) => (
              <a key={item} href={item === "Portfolio" ? "/portfolio" : item === "Services" ? "/services" : item === "Story" ? "/story" : `#${item.toLowerCase()}`} className="transition hover:text-[#d7ff38]">
                {item}
              </a>
            ))}
          </nav>
          <a href="#shop" className="ml-auto inline-flex items-center gap-2 border border-white/15 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] lg:ml-0">
            <ShoppingBag className="size-4" />
            Shop
          </a>
        </div>
      </header>

      <section id="home" className="relative isolate min-h-screen overflow-hidden border-b border-white/10 pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(215,255,56,.24),transparent_26%),linear-gradient(90deg,#050505_0%,rgba(5,5,5,.88)_38%,rgba(5,5,5,.28)_100%)]" />
        <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:88px_88px]" />
        <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-[1700px] content-between px-4 pb-8 pt-12 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] font-black uppercase tracking-[0.26em] text-white/55">
            <span>Creative system / apparel / AI motion</span>
            <span>Charlotte NC / Worldwide</span>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="mb-6 inline-flex items-center gap-2 border border-white/20 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-[#d7ff38] backdrop-blur">
                <Sparkles className="size-4" />
                Home of NaxyStudios and Ascension Aesthetics
              </p>
              <h1 className="max-w-6xl text-[clamp(4.8rem,14vw,15rem)] font-black uppercase leading-[0.72] tracking-[-0.08em]">
                Naxy
                <span className="block text-[#d7ff38]">Studios</span>
              </h1>
            </div>
            <div className="max-w-xl lg:pb-5">
              <p className="text-2xl leading-9 text-white/78 md:text-3xl md:leading-10">
                Where graphic design, apparel drops, and AI-assisted motion become one sharp creative universe.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="/portfolio" className="inline-flex items-center gap-2 bg-[#d7ff38] px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-black">
                  View Portfolio
                  <ArrowUpRight className="size-4" />
                </a>
                <a href="#shop" className="inline-flex items-center gap-2 border border-white/25 px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-white">
                  Shop Drop
                  <ArrowUpRight className="size-4" />
                </a>
                <a href="/story" className="inline-flex items-center gap-2 border border-white/25 px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-white/75">
                  Read Story
                  <ArrowUpRight className="size-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="grid gap-3 border-t border-white/10 pt-6 text-xs font-black uppercase tracking-[0.2em] text-white/45 md:grid-cols-4">
            <span>01 Shop</span>
            <a href="/services" className="transition hover:text-[#d7ff38]">02 Creative Services</a>
            <span>03 Portfolio</span>
            <a href="/story" className="transition hover:text-[#d7ff38]">04 Story</a>
          </div>
        </div>
      </section>

      <section id="shop" className="relative border-b border-white/10 px-4 py-20 md:px-8 md:py-28">
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="relative mx-auto max-w-[1700px]">
          <ChapterLabel number="01" label="Live eBay inventory" />
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="text-[clamp(4rem,10vw,11rem)] font-black uppercase leading-[0.78] tracking-[-0.08em]">
                Shop
                <span className="block text-white/22">Drop</span>
              </h2>
              <p className="mt-8 max-w-lg text-xl leading-8 text-white/62">
                Active listings from skybound_collection, styled into the NaxyStudios storefront while sending buyers straight to eBay.
              </p>
            </div>

            {products.map((product) => (
              <article key={product.name} className="grid border border-white/12 bg-white/[0.04] lg:grid-cols-[0.9fr_1.1fr]">
                <div className="relative min-h-[520px] overflow-hidden bg-[#111]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(215,255,56,.28),transparent_32%),linear-gradient(135deg,#171717,#050505)]" />
                  <div className="absolute left-4 top-4 bg-[#d7ff38] px-3 py-2 text-xs font-black uppercase tracking-[0.2em] text-black">{product.inventory}</div>
                </div>
                <div className="flex flex-col justify-between gap-10 p-6 md:p-10">
                  <div>
                    <div className="mb-6 flex flex-wrap gap-2">
                      <span className="border border-white/14 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-white/60">{product.condition}</span>
                      <span className="border border-white/14 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-white/60">Buy It Now</span>
                    </div>
                    <h3 className="text-6xl font-black uppercase leading-[0.82] tracking-[-0.06em] md:text-8xl">{product.name}</h3>
                    <p className="mt-5 text-5xl font-black text-[#d7ff38]">{product.price}</p>
                    <div className="mt-8 grid gap-5 text-sm leading-6 text-white/62 md:grid-cols-2">
                      <p><span className="block text-xs font-black uppercase tracking-[0.18em] text-white">Colors</span>{product.colors}</p>
                      <p><span className="block text-xs font-black uppercase tracking-[0.18em] text-white">Sizes</span>{product.sizes}</p>
                      <p><span className="block text-xs font-black uppercase tracking-[0.18em] text-white">Shipping</span>{product.shipping}</p>
                      <p><span className="block text-xs font-black uppercase tracking-[0.18em] text-white">Seller</span>skybound_collection, 100% positive feedback</p>
                    </div>
                  </div>
                  <a href={product.href} className="inline-flex w-fit items-center gap-2 bg-white px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-black">
                    Buy on eBay
                    <ArrowUpRight className="size-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="border-b border-white/10 px-4 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1700px]">
          <ChapterLabel number="02" label="Studio capabilities" />
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
            <h2 className="text-[clamp(4rem,9vw,10rem)] font-black uppercase leading-[0.78] tracking-[-0.08em]">
              Built for
              <span className="block text-[#d7ff38]">Creators</span>
            </h2>
            <div className="grid border-t border-white/12">
              {services.map(([number, title, copy]) => (
                <article key={title} className="grid gap-5 border-b border-white/12 py-8 md:grid-cols-[0.2fr_0.8fr_1fr] md:items-center">
                  <p className="text-sm font-black uppercase tracking-[0.24em] text-[#d7ff38]">{number}</p>
                  <h3 className="text-3xl font-black uppercase tracking-[-0.04em] md:text-5xl">{title}</h3>
                  <p className="text-lg leading-8 text-white/60">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="portfolio" className="bg-[#d7ff38] px-4 py-20 text-black md:px-8 md:py-28">
        <div className="mx-auto max-w-[1700px]">
          <div className="mb-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <h2 className="text-[clamp(4rem,10vw,12rem)] font-black uppercase leading-[0.76] tracking-[-0.09em]">
              Portfolio
            </h2>
            <p className="max-w-2xl text-xl leading-8 text-black/70">
              A focused look at visual systems, apparel graphics, brand marks, and creator-facing assets built around the NaxyStudios universe.
            </p>
          </div>
          <div className="grid border-t border-black/20">
            {portfolioItems.slice(0, 4).map((item, index) => (
              <article key={item.sourceUrl ?? `${item.title}-${index}`} className="group grid gap-5 border-b border-black/20 py-6 md:grid-cols-[0.16fr_0.44fr_0.4fr] md:items-center">
                <p className="text-sm font-black uppercase tracking-[0.22em] text-black/55">{String(index + 1).padStart(2, "0")}</p>
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-black/55">{item.category}</p>
                  <h3 className="text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em] md:text-7xl">{item.title}</h3>
                </div>
                <div className="h-56 overflow-hidden bg-black md:h-72" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="story" className="border-b border-white/10 px-4 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1700px]">
          <ChapterLabel number="04" label="Proof and story" />
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="text-[clamp(4rem,8vw,9rem)] font-black uppercase leading-[0.78] tracking-[-0.08em]">
                Brands
                <span className="block text-white/22">Believe</span>
              </h2>
              <p className="mt-8 max-w-lg text-xl leading-8 text-white/62">
                Every piece tells a story of motion, emotion, and the journey that built NaxyStudios.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {clients.map((client) => (
                <div key={client.name} className="grid aspect-square place-items-center border border-white/12 bg-white/[0.04] p-8">
                  <span className="text-2xl font-black uppercase tracking-[0.12em] text-white/70">{client.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="px-4 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-[1700px] gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-[#d7ff38]">Stay tuned</p>
            <h2 className="text-[clamp(4.5rem,11vw,13rem)] font-black uppercase leading-[0.74] tracking-[-0.09em]">
              Ready?
            </h2>
          </div>
          <form className="grid gap-4 border border-white/12 bg-white/[0.04] p-5 md:grid-cols-[1fr_auto] md:p-8">
            <label className="sr-only" htmlFor="email">Email</label>
            <div className="flex items-center gap-3 border border-white/12 px-4">
              <Mail className="size-5 text-white/45" />
              <input id="email" type="email" placeholder="Email" className="h-14 w-full bg-transparent text-base text-white outline-none placeholder:text-white/35" />
            </div>
            <button className="bg-[#d7ff38] px-8 py-4 text-sm font-black uppercase tracking-[0.2em] text-black">Submit</button>
            <label className="flex items-center gap-3 text-sm text-white/55 md:col-span-2">
              <input type="checkbox" className="size-4 accent-[#d7ff38]" />
              Yes, subscribe me to your newsletter.
            </label>
          </form>
        </div>
      </section>
    </main>
  )
}
