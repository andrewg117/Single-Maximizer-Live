import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { FaRegWindowClose } from "react-icons/fa";
import styles from "../css/new_release_style.module.css";

interface FrameProps {
  blob: any;
  id: string;
  removePress: (e: any, id: string) => void;
}

const ImageFrame = ({ blob, id, removePress }: FrameProps) => {
  return (
    <>
      <div id={styles.press_frame}>
        <img
          src={`data:image/*;base64,${blob}`}
          alt={"N/A"}
        />
        <FaRegWindowClose
          id={styles.remove_press}
          onClick={(e: React.MouseEvent<SVGElement, MouseEvent>) => removePress(e, id)}
        />
      </div>
    </>
  );
};

const NewImageFrame = ({ blob, id, removePress }: FrameProps) => {
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
        <p
          id={styles.remove_press}
          onClick={(e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => removePress(e, id)}
        >
          X
        </p>
      </div>
    </>
  );
};

interface PressEditProps {
  changeFile: any;
  trackPress: Array<any>;
  newPressList: Array<any>;
  deletePressList: Array<any>;
}

function PressEdit({ changeFile, trackPress, newPressList, deletePressList }: PressEditProps) {
  const [listSize, setListSize] = useState<number>(0);

  interface stateType {
    genres: Array<string>;
    trackCover: any;
    trackAudio: any;
    trackPress: Array<any>;
    newPressList: Array<any>;
    deletePressList: Array<any>;
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [".jpeg", ".png"],
    },
    onDrop: async (acceptedFiles) => {
      let formData = new FormData();
      formData.append("Press", acceptedFiles[0]);
      let megBytes =
        Math.round((acceptedFiles[0].size / 1024 ** 2) * 100) / 100;
      formData.append("size", megBytes.toString());

      if (listSize + megBytes < 20) {
        changeFile((prevState: stateType) => ({
          ...prevState,
          newPressList: [...newPressList, formData.get("Press")],
        }));
      } else {
        toast.error("File size is too large");
      }
    },
  });

  const removePress = (e: Event, id: string) => {
    e.preventDefault();

    changeFile((prevState: stateType) => ({
      ...prevState,
      trackPress: trackPress.filter((item) => item._id as string !== id),
      deletePressList: [
        ...deletePressList,
        trackPress.find((item) => item._id === id),
      ],
    }));
  };

  const removeNewPress = (e: Event, id: string) => {
    e.preventDefault();

    changeFile((prevState: any) => ({
      ...prevState,
      newPressList: newPressList.filter((_, index) => index.toString() !== id),
    }));
  };

  useEffect(() => {
    setListSize(() => {
      let size = 0;
      if (trackPress.length > 0) {
        trackPress.forEach((item) => {
          size = size + item.file.size;
        });
      }
      if (newPressList.length > 0) {
        newPressList.forEach((item) => {
          size = size + item.size;
        });
      }

      let megBytes = Math.round((size / 1024 ** 2) * 100) / 100;
      return megBytes;
    });
  }, [trackPress, newPressList]);

  return (
    <>
      <div id={styles.press_upload}>
        {trackPress.length > 0
          ? trackPress.map((item, index) => {
              return (
                <ImageFrame
                  key={index}
                  id={item._id}
                  blob={item.file.buffer}
                  removePress={removePress}
                />
              );
            })
          : []}
        {newPressList.length > 0
          ? newPressList.map((item, index) => {
              return (
                <NewImageFrame
                  key={index}
                  id={index.toString()}
                  blob={item}
                  removePress={removeNewPress}
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

export default PressEdit;
