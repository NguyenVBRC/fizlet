import Link from "next/link";
import styles from "./GlobalHeader.module.css";

export default function GlobalHeader() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          Fizlet
        </Link>
        <div className={styles.links}>
          <Link href="/study" className={styles.link}>
            Study
          </Link>
          <Link href="/create" className={styles.link}>
            Create
          </Link>
        </div>
      </nav>
    </header>
  );
}
