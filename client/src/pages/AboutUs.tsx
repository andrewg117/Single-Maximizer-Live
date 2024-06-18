import TSLogo from "../images/Trackstarz-Trademark-Logo-Horizontal-White-1.png";
import styles from "../css/aboutus_style.module.css";

function AboutUs() {
  return (
    <section id={styles.aboutus_wrapper}>
      <section id={styles.main_block}>
        <img
          src={TSLogo}
          alt="TrackStarz"
          id={styles.logo}
        />
        <p>
          Trackstarz is a Christian media company determined to bring
          high-quality Godly content to the mainstream. We have a heart for
          training young creatives to improve their craft and character in order
          to prepare them for Marketplace influence. We also provide our
          Trackstarz Universe of supporters and fans with engaging content and
          witnessing tools through our Radio show, TV show, Music Group, Events,
          and Publications. We also strive to help creatives improve the quality
          of their end product and provide them with the resources to get their
          message heard through our Design, Engineering, and Distribution
          services.
        </p>
      </section>
    </section>
  );
}

export default AboutUs;
