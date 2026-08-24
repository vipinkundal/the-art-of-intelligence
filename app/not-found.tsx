import Link from "next/link";

export default function NotFound() {
  return <main id="main-content" className="not-found"><span className="section-kicker">404 · unresolved state</span><h1>This node is outside the map.</h1><p>The address does not match a generated learning document.</p><Link className="primary-action" href="/lessons/">Return to the lab library</Link></main>;
}
