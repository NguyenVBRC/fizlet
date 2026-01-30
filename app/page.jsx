import Link from "next/link";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={styles.dashboard}>
      <h1 className={styles.dashboardTitle}>Dashboard</h1>
      <div className={styles.dashboardLinks}>
        <Link href="/study" className={styles.dashboardLink}>
          Study
        </Link>
        <Link
          href="/create"
          className={`${styles.dashboardLink} ${styles.create}`}
        >
          Create
        </Link>
      </div>
    </div>
  );
}
