<template>
  <div class="w-full">
    <ckeditor
      :editor="editor"
      :value="value"
      @input="emitInput"
      :config="editorConfig"
    />
  </div>
</template>

<script setup>
const { $ckeditor } = useNuxtApp();
const editor = $ckeditor.classicEditor;

const editorConfig = {
  language: "ko",
  placeholder: "Type your content here...",
  link: {
    decorators: {
      addTargetToExternalLinks: true,
    },
  },
  image: {
    toolbar: ["imageTextAlternative", "imageStyle:full", "imageStyle:side"],
    styles: ["full", "side"],
    resizeUnit: "%",
    resizeOptions: [
      {
        name: "resizeImage:original",
        label: "Original size",
        value: null,
      },
      {
        name: "resizeImage:50",
        label: "50%",
        value: "50",
      },
      {
        name: "resizeImage:75",
        label: "75%",
        value: "75",
      },
    ],
  },
  mediaEmbed: {
    previewsInData: true,
  },
};

defineProps({
  value: {
    type: String,
  },
});

const emit = defineEmits(["input"]);
const emitInput = (e) => {
  emit("input", e);
};
</script>

<style>
.ck-editor__editable {
  height: 780px;
}
</style>
