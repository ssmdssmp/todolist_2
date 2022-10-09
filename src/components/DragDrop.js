import { FileUploader } from "react-drag-drop-files";
const fileTypes = ["JPG", "JPEG", "PNG", "GIF"];

function DragDrop({ setBg }) {
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };
  const handleChange = (file) => {
    URL.createObjectURL(file);
    getBase64(file).then((res) => {
      setBg(res);
      localStorage.setItem("bg", res);
    });
  };

  return (
    <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
  );
}

export default DragDrop;
