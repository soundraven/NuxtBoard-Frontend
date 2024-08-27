export default defineNuxtPlugin((nuxtApp) => {
  const catchError = (error: any) => {
    if (error.response && error.response.data) {
      // API 응답에 기반한 에러 메시지 처리
      return ElMessage.error(
        error.response.data.message || "An error occurred."
      );
    } else if (error.message) {
      // 네트워크 오류 또는 기타 일반적인 오류 메시지 처리
      return ElMessage.error(error.message);
    } else {
      // 알 수 없는 오류 처리
      return ElMessage.error(
        "Unknown error occurred. Please check and try again."
      );
    }
  };

  nuxtApp.provide("catchError", catchError);
});
