import { ref } from 'vue';
import { exportMapToImage, loadMapFromImage } from "@/utils/imageSnapshot.ts";
import { createGameDataForExport, updateEditorFromGameData } from "@/composables/useGameData.ts";

export function useImageHandler() {
  // 图片相关状态
  const imageDownloadUrl = ref<string | null>(null);
  const uploadedImageUrl = ref<string | null>(null);
  const uploadedGameData = ref<any>(null);

  // 导出图片快照
  const exportImageSnapshot = async () => {
    const gameData = createGameDataForExport();
    imageDownloadUrl.value = await exportMapToImage(gameData);
  };

  // 触发图片输入框点击事件
  const triggerImageInput = (imageInputRef: HTMLInputElement | null) => {
    if (imageInputRef) {
      imageInputRef.click();
    }
  };

  // 处理图片上传
  const handleImageUpload = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const imageDataUrl = e.target?.result as string;
        uploadedImageUrl.value = imageDataUrl;
        uploadedGameData.value = await loadMapFromImage(imageDataUrl);
      } catch (error) {
        alert('从图片加载地图失败: ' + (error as Error).message);
      }
    };

    reader.readAsDataURL(file);
  };

  // 关闭图片预览
  const closeImagePreview = () => {
    uploadedImageUrl.value = null;
    uploadedGameData.value = null;
    imageDownloadUrl.value = null;
  };

  // 确认加载上传的图片作为地图
  const confirmImageUpload = () => {
    if (uploadedGameData.value) {
      updateEditorFromGameData(uploadedGameData.value);
      uploadedImageUrl.value = null;
      uploadedGameData.value = null;
      alert('地图数据已从图片加载');
    }
  };

  // 保存地图到本地存储
  const saveMapToLocal = () => {
    // TODO: 直接将图片下载到 /pubic/data/ 目录中
  };

  return {
    imageDownloadUrl,
    uploadedImageUrl,
    uploadedGameData,
    exportImageSnapshot,
    triggerImageInput,
    handleImageUpload,
    closeImagePreview,
    confirmImageUpload,
    saveMapToLocal
  };
}