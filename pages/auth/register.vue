<template>
  <div class="h-screen flex justify-center">
    <el-card
      :class="{ 'opacity-0': !showCard, 'opacity-100': showCard }"
      class="w-[600px] h-[320px] flex justify-center items-center my-auto p-[40px] transition-opacity duration-1000 ease-in-out"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="registerForm"
        label-width="auto"
        class="flex flex-col justify-center items-center"
      >
        <el-form-item label="Email" prop="email" class="w-full">
          <el-input type="email" v-model="form.email" />
        </el-form-item>
        <el-form-item label="Password" prop="password" class="w-full">
          <el-input type="password" v-model="form.password" show-password />
        </el-form-item>
        <el-form-item label="userName" prop="userName" class="w-full">
          <el-input v-model="form.userName" />
        </el-form-item>
        <el-button type="primary" @click="submitForm">회원가입</el-button>
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
  if (!registerForm.value) return;

  try {
    await registerForm.value.validate();
    onSubmit();
  } catch (error) {
    ElMessage.error("Validation failed");
  }
};

const onSubmit = async () => {
  const result = await $apiPost("/users/register", {
    user: form,
  });

  ElMessage(`${result.message}`);
  navigateTo("/");
};

const showCard: Ref<Boolean> = ref(false);

const toggleCard = () => {
  showCard.value = !showCard.value;
};
</script>
