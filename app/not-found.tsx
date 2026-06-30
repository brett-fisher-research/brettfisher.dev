import Link from "next/link";

export default function NotFound() {
  return (
    <div className="notfound">
      <h1>404</h1>
      <p>This page wandered off the board.</p>
      <p>
        <Link href="/">← Back home</Link>
      </p>
    </div>
  );
}
