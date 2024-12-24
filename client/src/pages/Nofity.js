import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export const notifySuccess = (message) => {
    toast.success(message, { position: "top-right"})
};

export const notifyError = (err) => {
    toast.error(err, { position: "top-right"})
}
