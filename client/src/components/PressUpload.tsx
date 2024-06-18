import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { FaRegWindowClose } from "react-icons/fa";
import styles from "../css/new_release_style.module.css";

const ImageFrame = ({ blob, id, removePress }) => {
  return (
    <>
      <div id={styles.press_frame}>
        <img
          src={URL.createObjectURL(blob)}
          alt="N/A"
          onLoad={() => {
            URL.revokeObjectURL(blob);
          }}
        />
        <FaRegWindowClose
          id={styles.remove_press}
          onClick={(e) => removePress(e, id)}
        />
      </div>
    </>
  );
};

function PressUpload({ changeFile, trackPress }) {
  const [listSize, setListSize] = useState();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [".jpeg", ".png"],
    },
    onDrop: async (acceptedFiles) => {
      let formData = new FormData();
      formData.append("Press", acceptedFiles[0]);
      let megBytes =
        Math.round((acceptedFiles[0].size / 1024 ** 2) * 100) / 100;
      formData.append("size", megBytes);

      if (listSize + megBytes < 20) {
        changeFile((prevState) => ({
          ...prevState,
          trackPress: [...trackPress, formData.get("Press")],
        }));
      } else {
        toast.error("File size is too large");
      }
    },
  });

  useEffect(() => {
    setListSize(() => {
      let size = 0;
      if (trackPress.length > 0) {
        trackPress.forEach((item) => {
          size = size + item.size;
        });
      }

      let megBytes = Math.round((size / 1024 ** 2) * 100) / 100;
      return megBytes;
    });
  }, [trackPress]);

  const removePress = (e, id) => {
    e.preventDefault();

    changeFile((prevState) => ({
      ...prevState,
      trackPress: trackPress.filter((item, index) => index !== id),
    }));
  };

  return (
    <>
      <div id={styles.press_upload}>
        {trackPress.length > 0
          ? trackPress.map((item, index) => {
              return (
                <ImageFrame
                  key={index}
                  id={index}
                  blob={item}
                  removePress={removePress}
                />
              );
            })
          : []}
        <div
          id={styles.add_press}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <div>Add Photo</div>
        </div>
      </div>
      <p>Size Limit: {listSize} / 20 MB</p>
    </>
  );
}

export default PressUpload;
