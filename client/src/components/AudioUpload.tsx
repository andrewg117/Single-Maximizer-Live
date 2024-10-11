import { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Buffer } from "buffer";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

interface fileType extends FormData {
  name?: string | FormDataEntryValue;
}

interface AudioUploadProps {
  changeFile: any;
  file: any | fileType;
  fieldname: string;
}

interface newFileType extends Blob {
  name?: string;
}

function AudioUpload({ changeFile, file, fieldname }: AudioUploadProps) {
  const [isEdit, setEdit] = useState(true);

  const makeBlob = useCallback((): string | null => {
    if (file && !isEdit) {
      return URL.createObjectURL(file.get(fieldname));
    } else if (isEdit === true) {
      const audioBuffer = Buffer.from(file.buffer, "base64");
      const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
      const href = URL.createObjectURL(blob);
      return href;
    } else {
      return null;
    }
  }, [file, isEdit, fieldname]);

  const [blob, getBlob] = useState<string>();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "audio/mp3": [".mp3"],
    },
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles[0]) {
        let formData = new FormData();

        formData.append(fieldname, acceptedFiles[0] as newFileType);
        let megBytes =
          Math.round((acceptedFiles[0].size / 1024 ** 2) * 100) / 100;
        let strBytes = megBytes.toString();
        formData.append("size", strBytes);

        setEdit(false);

        getBlob(URL.createObjectURL(formData.get(fieldname) as Blob));

        changeFile(formData);
      } else {
        toast.error("File size is too large");
      }
    },
    maxSize: 21000000,
  });

  const getAudioFileName = () => {
    if (file instanceof FormData && file != null) {
      const newFile = file.get("trackAudio") as newFileType;
      return newFile.name ? newFile.name.toString() : "";
    } else {
      return "";
    }
  };

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(blob as string);
    };
  }, [blob]);

  return (
    <>
      <div>
        {file !== null ? (
          <>
            {isEdit === true ? (
              <>
                <AudioPlayer
                  src={makeBlob() as string}
                  layout="horizontal"
                  autoPlayAfterSrcChange={false}
                  volume={0.2}
                />
              </>
            ) : (
              <>
                <AudioPlayer
                  src={blob}
                  layout="horizontal"
                  autoPlayAfterSrcChange={false}
                  volume={0.2}
                />
                <p>{getAudioFileName()}</p>
              </>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
      <div
        style={{ cursor: "pointer" }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <p>Drag and drop or click to upload audio</p>
        <div>
          <p>
            {file ? (
              <></>
            ) : (
              <>
                <FaEdit /> Change Audio
              </>
            )}
          </p>
        </div>
      </div>
    </>
  );
}

export default AudioUpload;
