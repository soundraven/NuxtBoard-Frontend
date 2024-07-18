<template>
    <div
        :class="[
            $colorMode.preference === 'dark' ? 'dark' : 'light',
            'min-h-screen',
        ]"
    >
        <header class="bg-primary dark:bg-secondary text-white p-4">
            <h1 class="text-4xl">My Nuxt App</h1>
            <button
                @click="toggleColorMode"
                class="ml-auto bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded"
            >
                Toggle Mode
            </button>
        </header>
        <main class="p-4">
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 class="text-black dark:text-white">Dark Mode Example</h2>
                <p class="text-gray-700 dark:text-gray-300">
                    This is an example of how to use TailwindCSS with Nuxt Color
                    Mode.
                </p>
            </div>
        </main>
    </div>
</template>

<script>
export default {
    methods: {
        toggleColorMode() {
            this.$colorMode.preference =
                this.$colorMode.preference === "dark" ? "light" : "dark"
        },
    },
}
</script>

<style scoped>
/* 추가적인 커스터마이징 스타일 */
</style>
