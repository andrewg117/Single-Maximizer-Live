import React from "react";
import styles from "../css/new_release_style.module.css";

const ImageFrame = ({ blob }) => {
  return (
    <div id={styles.press_frame}>
      <img
        src={`data:image/*;base64,${blob}`}
        alt={"N/A"}
      />
    </div>
  );
};

function PressView({ trackPress }) {
  return (
    <div id={styles.press_upload}>
      {trackPress.length > 0
        ? trackPress.map((item, index) => {
            return (
              <ImageFrame
                key={index}
                blob={item.file.buffer}
              />
            );
          })
        : []}
    </div>
  );
}

export default PressView;
