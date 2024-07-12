<template>
    <div>
        <NuxtLayout>
            <NuxtPage class="pt-[50px]" />
        </NuxtLayout>
    </div>
</template>

<script setup lang="ts">
onMounted(() => {
    if (process.server) return
    console.log("Component has been mounted")
})
</script>
