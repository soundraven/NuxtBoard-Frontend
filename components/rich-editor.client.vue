<template>
  <ckeditor :editor="editor" />
</template>

<script setup>
const { $ckeditor } = useNuxtApp();

const editor = $ckeditor.classicEditor;
</script>
