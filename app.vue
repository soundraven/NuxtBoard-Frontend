<template>
    <div>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
const { $indexStore } = useNuxtApp()

onMounted(() => {
    if (process.server) return
    $indexStore.auth.autoLogin()
    console.log("Component has been mounted")
})
</script>
