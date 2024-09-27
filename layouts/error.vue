<template>
  <el-container
    class="w-full h-screen flex justify-center items-center"
    style="background-color: #f5f5f5"
  >
    <el-result
      icon="warning"
      title="Oops! Something went wrong."
      sub-title="The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."
      class="max-w-[600px]"
    >
      <template #extra>
        <el-button type="primary" @click="goHome">Go Back Home</el-button>
        <el-button @click="refreshPage">Try Again</el-button>
      </template>
    </el-result>
  </el-container>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goHome = () => {
  router.push("/");
};

const refreshPage = () => {
  location.reload();
};
</script>
