import SMLogo from "../images/single-Maximizer-tile.png.webp";
import styles from "../css/style.module.css";

function Spinner() {
  return (
    <div className={styles.loadingSpinnerContainer}>
      <img
        src={SMLogo}
        alt="Home"
        id={styles.logo}
      />
    </div>
  );
}

export default Spinner;
