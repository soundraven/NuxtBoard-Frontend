<template>
    <UContainer>
        <UForm :state="form" class="space-y-4">
            <UFormGroup label="Email" name="email">
                <UInput v-model="form.email" />
            </UFormGroup>
            <UFormGroup label="Password" name="password">
                <UInput v-model="form.password" type="password" />
            </UFormGroup>

            <UButton @click="onSubmit">Submit!</UButton>
        </UForm>
    </UContainer>
</template>
<script setup lang="ts">
import type { Userinfo } from "@/structure/userinfo"

const emitForm = defineEmits<{ (e: "onSubmit", form: Userinfo): void }>()

const form: Userinfo = reactive({
    email: "",
    password: "",
})

const onSubmit = () => {
    emitForm("onSubmit", form)
}
</script>
