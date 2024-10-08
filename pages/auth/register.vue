<template>
  <div class="h-screen flex justify-center">
    <el-card
      :class="{ 'opacity-0': !showCard, 'opacity-100': showCard }"
      class="w-[600px] h-[320px] | flex justify-center items-center | my-auto p-[40px] | transition-opacity duration-1000 ease-in-out"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="registerForm"
        label-width="auto"
        class="flex flex-col justify-center items-center"
      >
        <el-form-item
          label="Email"
          prop="email"
          class="w-full whitespace-nowrap"
        >
          <el-input type="email" v-model="form.email" />
        </el-form-item>
        <el-form-item
          label="Password"
          prop="password"
          class="w-full whitespace-nowrap"
        >
          <el-input type="password" v-model="form.password" show-password />
        </el-form-item>
        <el-form-item
          label="userName"
          prop="userName"
          class="w-full whitespace-nowrap"
        >
          <el-input v-model="form.userName" />
        </el-form-item>
        <div class="w-[300px] flex justify-center">
          <el-button type="primary" @click="submitForm">회원가입</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import type { UserInfo } from "@/types/interface";
import type { FormInstance } from "element-plus";
import rules from "@/utils/formRules";
const { $apiPost } = useNuxtApp();

const registerForm = ref<FormInstance | null>(null);
const form: UserInfo = reactive({
  email: "",
  password: "",
  userName: "",
});

onMounted(() => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toggleCard();
    });
  });
});

const submitForm = async () => {
  if (!registerForm.value) {
    ElMessage.error("Please check your info");
    return;
  }

  await registerForm.value.validate();
  onSubmit();
};

const onSubmit = async () => {
  const registerResult = await $apiPost("/users/register", {
    user: form,
  });

  if (registerResult.success) {
    ElMessage({
      message: `${registerResult.message} Move to login page.`,
      type: "success",
    });

    navigateTo("/auth/login");
  }
};

const showCard: Ref<Boolean> = ref(false);

const toggleCard = () => {
  showCard.value = !showCard.value;
};
</script>
