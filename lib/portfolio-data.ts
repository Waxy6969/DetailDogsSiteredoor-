export type PortfolioItem = {
  title: string
  image: string
  category: string
  year: string
  summary: string
  sourceUrl?: string
}

export const portfolioItems: PortfolioItem[] = [
  {
    title: "3D Intro",
    image: "/naxy/portfolio-drive/001-2.jpg",
    category: "3d Intros",
    year: "Drive",
    summary: "3d Intros pulled from the live NaxyStudios Drive portfolio folder.",
    sourceUrl: "https://drive.google.com/file/d/1gLzUYyNtWBhMlvYLV6FdKbvc8bCaAV96/view"
  },
  {
    title: "T Shirt Drop",
    image: "/naxy/portfolio-drive/029-t-shirt-drop-5.jpg",
    category: "Art",
    year: "Drive",
    summary: "Art pulled from the live NaxyStudios Drive portfolio folder.",
    sourceUrl: "https://drive.google.com/file/d/1z4NQ0FomyH6XEKH4pFA9Fr8edHhdGrTv/view"
  },
  {
    title: "Design Banner",
    image: "/naxy/portfolio-drive/101-wallpaper.jpg",
    category: "Design Banners",
    year: "Drive",
    summary: "Design Banners pulled from the live NaxyStudios Drive portfolio folder.",
    sourceUrl: "https://drive.google.com/file/d/1POQTecq0DC80vCJ-NictfRYy6Y1FK1RJ/view"
  },
  {
    title: "Logo System",
    image: "/naxy/portfolio-drive/114-main-logo.jpg",
    category: "Logos Made",
    year: "Drive",
    summary: "Logos Made pulled from the live NaxyStudios Drive portfolio folder.",
    sourceUrl: "https://drive.google.com/file/d/1vcGvSh7VLImEkzBZPo4cZWxGz0cx4sag/view"
  }
]
