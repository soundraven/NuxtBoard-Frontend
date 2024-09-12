export default defineNuxtPlugin((nuxtApp) => {
  const catchError = (error: any) => {
    if (error.response && error.response.data) {
      return ElMessage.error(
        error.response.data.message || "An error occurred."
      );
    } else if (error.message) {
      return ElMessage.error(error.message);
    } else {
      return ElMessage.error(
        "Unknown error occurred. Please check and try again."
      );
    }
  };

  nuxtApp.provide("catchError", catchError);
});
