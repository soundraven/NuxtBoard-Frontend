<template>
    <div>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
onMounted(() => {
    if (process.server) return
    console.log("Component has been mounted")
})
</script>
