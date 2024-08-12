import { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import styles from "../css/new_release_style.module.css";

interface fileType extends FormData {
  name?: string;
}
interface ImageUploadProps {
  changeFile: any;
  file: any | fileType;
  altText: string;
}

const ImageUpload = ({ changeFile, file, altText }: ImageUploadProps) => {
  const [isEdit, setEdit] = useState(true);

  const makeBlob = useCallback(() => {
    if (file && !isEdit) {
      return URL.createObjectURL(file.get("Image"));
    } else if (isEdit === true) {
      return file;
    }
  }, [file, isEdit]);

  const [blob, getBlob] = useState(makeBlob());

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [".jpeg", ".png"],
    },
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles[0]) {
        let formData = new FormData();
        formData.append("Image", acceptedFiles[0]);
        let megBytes =
          Math.round((acceptedFiles[0].size / 1024 ** 2) * 100) / 100;
        let strBytes = megBytes.toString();
        formData.append("size", strBytes);

        setEdit(false);

        getBlob(URL.createObjectURL(formData.get("Image") as Blob));

        changeFile(formData);
      } else {
        toast.error("File size is too large");
      }
    },
    maxSize: 10000000,
  });

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(blob);
    };
  }, [blob]);

  return (
    <>
      <div
        id={styles.image_upload_div}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <p hidden={file}>Drag and drop or click to upload image</p>
        {file ? (
          <>
            {isEdit === true ? (
              <>
                <img
                  src={`data:image/*;base64,${makeBlob()}`}
                  alt={altText}
                />
                <FaEdit className={styles.edit_image} />
              </>
            ) : (
              <>
                <img
                  src={makeBlob()}
                  alt={altText}
                  onLoad={() => {
                    URL.revokeObjectURL(blob);
                  }}
                />
                <FaEdit className={styles.edit_image} />
              </>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default ImageUpload;
