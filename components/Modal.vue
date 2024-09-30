<template>
  <el-dialog
    :model-value="props.visible"
    @close="handleClose"
    @update:model-value="handleClose"
  >
    <template #title>
      <span>{{ props.title }}</span>
    </template>
    <div class="mb-[12px]">
      <slot></slot>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">Cancel</el-button>
      <el-button type="primary" @click="handleConfirm">Confirm</el-button>
    </span>
  </el-dialog>
</template>

<script setup lang="ts">
const props = defineProps({
  visible: Boolean,
  title: String,
});

//cancel 버튼은 옵션으로 넣어서 확인만 할 수 있게

const emits = defineEmits(["close", "confirm", "update:model-value"]);

const handleClose = () => {
  emits("close");
  emits("update:model-value", false);
};

const handleConfirm = () => {
  emits("confirm");
  emits("update:model-value", false);
};

const handleCancel = () => {
  emits("close");
  emits("update:model-value", false);
};
</script>
