export function useModal() {
  const isModalVisible = ref(false);
  const modalTitle = ref("");
  const modalContent = ref("");
  const modalConfirmAction = ref<() => void>(() => {});

  const openModal = (
    title: string,
    content: string,
    confirmAction: () => void
  ) => {
    modalTitle.value = title;
    modalContent.value = content;
    modalConfirmAction.value = confirmAction;
    isModalVisible.value = true;
  };

  const closeModal = () => {
    isModalVisible.value = false;
  };

  return {
    isModalVisible,
    modalTitle,
    modalContent,
    modalConfirmAction,
    openModal,
    closeModal,
  };
}
