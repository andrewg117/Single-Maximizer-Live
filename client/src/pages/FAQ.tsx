import React from "react";
import InspireImage from "../images/INSPIRE-WITH-YOUR-TALENT-150x150.png.webp";
import EliminateImage from "../images/ELIMINATE-THE-HUSSLE-150x150.png.webp";
import ItOnlyImage from "../images/IT-ONLY-TAKES-ONE-150x150.png.webp";
import HipDXImage from "../images/Hip-Hop-DX.jpeg.webp";
import PitchImage from "../images/Pitchfork-e1647388052851.jpeg";
import DudeImage from "../images/dude-fm-e1647388248275.jpeg";
import RapzImage from "../images/Rapzilla.com_.jpeg.webp";
import faq_style from "../css/faq_style.module.css";

const FaqBlock = ({ styles, src, alt, title, info }) => {
  return (
    <div className={styles.faq_block}>
      <img
        src={src}
        alt={alt}
      />
      <h3>{title}</h3>
      <p>{info}</p>
    </div>
  );
};

const outletList = [
  ["All Hip Hop", "XKSC Radio", "CHH Insider", "New H2O", "MTMV"],
  [
    "Christlike Radio",
    "Power 77 Radio",
    "Prayz",
    "Keep it Real Talk Radio",
    "DJ WadeO",
  ],
  [
    "Art Soul Radio",
    "Transformation Radio",
    "Coalition Kingdom DJs",
    "DJ Will",
    "All of our Radio Partners",
  ],
  [
    "Pigeons and Planes",
    "Solomon's Porch",
    "Five Twenty Collective",
    "CHH Leaks",
    "And Many More...",
  ],
];

export const FAQDistro = ({styles}) => {
  return (
    <section id={styles.faq_wrapper}>
      <section className={styles.content_block}>
        <section id={styles.head_grid}>
          <h3>
            {`We can save you time by submitting your music to hundreds of music
            blogs, Spotify playlists curators, magazines, radio stations, and
            outlets including:`.toUpperCase()}
          </h3>
        </section>
        <section id={styles.save_grid}>
          <FaqBlock
            styles={styles}
            src={HipDXImage}
            alt={"Hip Hop DX"}
            title={"Hip Hop DX"}
            info={
              "For new music, news & all things Rap & Hip Hop. HipHopDX has the latest videos, interviews and more."
            }
          />
          <FaqBlock
            styles={styles}
            src={PitchImage}
            alt={"Pitchfork"}
            title={"Pitchfork"}
            info={
              "His Hop Nation’s goal is to provide quality Radio, Podcasts, Music, Sermons and more to the world."
            }
          />
          <FaqBlock
            styles={styles}
            src={DudeImage}
            alt={"Dude FM"}
            title={"Dude FM"}
            info={
              "Yup, we dig Featuring Independent Artists, Bands,Conscious Hip Hop, DJ’s, EDM, MC’s& Musicians, via MUSIC VIDEOS & SOUNDCLOUD. Give us an ay-yup, a hola,a holla, a wassup, or a shout, eh. we are listening."
            }
          />
          <FaqBlock
            styles={styles}
            src={RapzImage}
            alt={"Rapzilla"}
            title={"Rapzilla"}
            info={
              "Christian Rap & Urban Christian Culture’s most visited destination has been Rapzilla.com, since 2003."
            }
          />
        </section>
        <section id={styles.outlet_grid}>
          {outletList.map((item, index) => {
            return (
              <ul key={index}>
                {item.map((value, i) => {
                  return (
                    <li key={i}>
                      <span>{value}</span>
                    </li>
                  );
                })}
              </ul>
            );
          })}
        </section>
      </section>
    </section>
  );
};

export const FAQSave = ({styles}) => {
  return (
    <section id={styles.faq_wrapper}>
      <section className={styles.content_block}>
        <section id={styles.head_grid}>
          <h1>WHAT IS THE SINGLE MAXIMIZER?</h1>
          <h2>HOW DOES IT HELP ME?</h2>
        </section>
        <section id={styles.faq_grid}>
          <FaqBlock
            styles={styles}
            src={InspireImage}
            alt={"Inspire"}
            title={"Inspire With Your Talent"}
            info={
              "At trackstarz, We believe that you, as an artist, can also make a difference by making your music talent known and heard to inspire the whole world."
            }
          />
          <FaqBlock
            styles={styles}
            src={EliminateImage}
            alt={"Eliminate"}
            title={"Eliminate the Hustle"}
            info={
              "We know how long it takes to send custom emails to each outlet in the format they request it in. As a music blog ourselves, we know for a fact that sending mass emails to music outlets does not work! And they don’t like when artists don’t follow their submission guidelines."
            }
          />
          <FaqBlock
            styles={styles}
            src={ItOnlyImage}
            alt={"ItOnly"}
            title={"It Takes Only One"}
            info={
              "You fill out a one-time form, we handle everything else. We will send individual submissions to each outlet in the exact format they request it in. No spam, No mass email blasts. Even better, your music still stays protected!"
            }
          />
        </section>
      </section>
    </section>
  );
};

function FAQ() {
  return (
    <section id={faq_style.faq_wrapper}>
      <FAQSave styles={faq_style}/>
      <FAQDistro styles={faq_style} />
    </section>
  );
}

export default FAQ;
