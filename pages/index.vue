<template>
    <div :class="$style.index">
        <UContainer>
            <UAccordion multiple :items="explain" />
            <UContainer class="flex justify-center">
                <UButton class="mx-8" @click="navigateTo('/login')"
                    >login</UButton
                >
                <UButton class="mx-8" @click="navigateTo('/sign')"
                    >sign</UButton
                >
                <UButton class="mx-8" @click="navigateTo('/write')"
                    >write</UButton
                >
                <UButton class="mx-8" @click="navigateTo('/detail')"
                    >detail</UButton
                >
                <UButton class="mx-8" @click="navigateTo('/post')"
                    >post</UButton
                ></UContainer
            >
        </UContainer>
    </div>
</template>

<script setup lang="ts">
const explain = [
    {
        label: "Purpose",
        icon: "i-heroicons-information-circle",
        defaultOpen: true,
        content:
            "기존 Vue3으로 작성한 게시판을 Nuxt3으로 마이그레이션하였습니다.",
    },
    {
        label: "Explanation",
        icon: "i-heroicons-installation-circle",
        content:
            "NuxtUI의 NuxtColorMode, TailwindCSS, 컴포넌트 등을 활용하여 글 작성, 수정, 삭제, 게시글 조회 등의 기능을 구현하였습니다.",
    },
]
</script>

<style lang="scss" module>
.index {
    width: 100vw;
}
</style>
