<template>
  <div class="h-screen flex justify-center">
    <el-card
      :class="{ 'opacity-0': !showCard, 'opacity-100': showCard }"
      class="w-[600px] h-[320px] | flex justify-center items-center | my-auto p-[40px] | transition-opacity duration-1000 ease-in-out"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="loginForm"
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
        <div class="flex justify-center items-center">
          <el-button type="primary" @click="submitForm">로그인</el-button>
          <el-button @click="navigateTo('/auth/register')">회원가입</el-button>
          <el-button @click="ElMessage('현재 준비중 입니다.')">
            비밀번호 찾기
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import type { UserInfo } from "@/types/interface.d.ts";
import type { FormInstance } from "element-plus";
import rules from "@/utils/formRules";
const { $indexStore, $apiPost } = useNuxtApp();

const router = useRouter();

const loginForm = ref<FormInstance | null>(null);
const form: UserInfo = reactive({
  email: "",
  password: "",
});

onMounted(() => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toggleCard();
    });
  });
});

const submitForm = async () => {
  if (!loginForm.value) return;

  try {
    await loginForm.value.validate();
    onSubmit();
  } catch (error) {
    ElMessage.error("Validation failed");
  }
};

const onSubmit = async () => {
  const loginResult = await $apiPost<{
    user: UserInfo;
    refreshToken: string;
    accessToken: string;
  }>("/users/login", {
    user: form,
  });

  const user = loginResult.data?.user;
  const refreshToken = loginResult.data?.refreshToken;
  const accessToken = loginResult.data?.accessToken;

  if (user && refreshToken && accessToken) {
    $indexStore.auth.login(user, refreshToken, accessToken);
    router.replace("/");
  }
};

const showCard: Ref<Boolean> = ref(false);

const toggleCard = () => {
  showCard.value = !showCard.value;
};
</script>
