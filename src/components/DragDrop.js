import React, { useState } from "react";
import { useEffect } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JPG", "JPEG", "PNG", "GIF"];

function DragDrop({ setBg }) {
  const [file, setFile] = useState(null);
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };
  const handleChange = (file) => {
    setFile(URL.createObjectURL(file));
    setBg(URL.createObjectURL(file));
    getBase64(file).then((res) => {
      localStorage["bg"] = res;
      console.debug("file stored", res);
    });
  };
  useEffect(() => {
    console.log(localStorage.getItem("bg"));
  }, [file]);

  return (
    <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
  );
}

export default DragDrop;
