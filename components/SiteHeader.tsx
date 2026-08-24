import Link from "next/link";
import { Brain, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="The Art of Intelligence home">
        <span className="brand-mark"><Brain size={20} weight="duotone" aria-hidden /></span>
        <span>The Art of Intelligence</span>
      </Link>
      <nav className="top-nav" aria-label="Primary navigation">
        <Link href="/lessons/">Library</Link>
        <Link href="/terms/">Glossary</Link>
        <Link className="header-search" href="/#search"><MagnifyingGlass size={15} aria-hidden /> Search</Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}
