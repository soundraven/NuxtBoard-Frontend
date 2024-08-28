<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import Cookies from "js-cookie";

const { $indexStore } = useNuxtApp();

onMounted(() => {
  if (process.server) return;
  if (Cookies.get("refreshToken") || Cookies.get("accessToken")) {
    $indexStore.auth.autoLogin();
  }
  console.log("Component has been mounted");
});
</script>

<style>
.body {
  height: calc(100vh - 50px);
  margin: 0px;
  box-sizing: border-box;
}
</style>
