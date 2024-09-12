import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  dayjs.extend(relativeTime);
  dayjs.locale("ko");

  nuxtApp.provide("dayjs", dayjs);
});
