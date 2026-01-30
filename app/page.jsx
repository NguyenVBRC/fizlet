import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import styles from "./Home.module.css";

export default async function Home() {
  const supabase = createClient();
  const { data, error } = await supabase.from("practice-tests").select("*");

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  console.log("Fetched practice tests:", data);

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
