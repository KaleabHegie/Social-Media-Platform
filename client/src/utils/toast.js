  import { useToast } from "vue-toastification";

  export default function ToastService() {
    const toast = useToast();

    return {
      success(message, options = {}) {
        toast.success(message, options);
      },
      error(message, options = {}) {
        toast.error(message, options);
      },
      info(message, options = {}) {
        toast.info(message, options);
      },
    };
  }
