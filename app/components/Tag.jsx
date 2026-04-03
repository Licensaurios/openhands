import styles from "../search/search.module.css";

export function Tag({ label, active, onClick }) {
  return (
    <button 
      onClick={onClick} 
      className={`${styles.tagBtn} ${active ? styles.tagActive : ""}`}
    >
      {label}
    </button>
  );
}