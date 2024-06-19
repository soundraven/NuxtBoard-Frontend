<template>
    <UContainer>
        <UCard>
            <template #header>
                <h2>{{ post.title }}</h2>
            </template>
            <template #content>
                <UImage :src="post.image" alt="Post Image" />
                <p>{{ post.content }}</p>
            </template>
            <template #footer>
                <div class="post-footer">
                    <span>Written by: {{ post.author }}</span>
                    <UButton @click="goBack">Back to Posts</UButton>
                </div>
            </template>
        </UCard>
    </UContainer>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const post = ref({})

onMounted(() => {
    // Fetch the post data based on the route parameter
    const postId = route.params.id
    // This is a mockup. Replace with your API call or data fetching logic.
    post.value = {
        id: postId,
        title: "Sample Post Title",
        image: "https://via.placeholder.com/600x300",
        content: "This is the content of the post.",
        author: "Author Name",
    }
})

const goBack = () => {
    router.push("/")
}
</script>

<style>
.post-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
