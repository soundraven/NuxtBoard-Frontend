<template>
    <div
        @click="navigateTo('/')"
        class="w-screen h-12 flex justify-center items-center"
    >
        GoToMain
    </div>
    <slot />
</template>

<script setup lang="ts"></script>
