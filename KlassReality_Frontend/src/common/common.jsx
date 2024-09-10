import { useDispatch } from "react-redux";
import { resetApplication } from "../redux/features/counter/applicationSlice";

const common = () => {

  async function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
    });
  }

  const dataURLtoFile = (dataURL, filename) => {
    var arr = dataURL.split(",");
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[arr.length - 1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], `${filename}.${mime.split("/")[1]}`, {
      type: mime,
    });
  };


  return {
    convertImageToBase64,
    dataURLtoFile,
  };
};
export default common;
