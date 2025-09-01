<template>
  <header class="bg-white shadow-sm sticky top-0 z-10">
    <div class="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-gray-900">推箱子地图编辑器</h1>
      <div class="flex space-x-2">
        <button @click="exportImage"
                class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clip-rule="evenodd"/>
          </svg>
          导出图片
        </button>
        <button @click="importImage"
                class="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 011.414 0L9 8.586V3a1 1 0 112 0v5.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clip-rule="evenodd"/>
          </svg>
          导入图片
        </button>
        <input type="file"
               ref="imageInputRef"
               accept="image/*"
               @change="handleImageUpload"
               class="hidden"/>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'exportImage'): void;
  (e: 'importImage'): void;
  (e: 'imageUpload', event: Event): void;
}>();

const imageInputRef = ref<HTMLInputElement | null>(null);

const exportImage = () => {
  emit('exportImage');
};

const importImage = () => {
  emit('importImage');
};

const handleImageUpload = (event: Event) => {
  emit('imageUpload', event);
};

// 暴露 imageInputRef 给父组件
defineExpose({
  imageInputRef
});
</script>