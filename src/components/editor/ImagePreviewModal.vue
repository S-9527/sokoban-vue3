<template>
  <Teleport to="body">
    <div v-if="imageDownloadUrl || uploadedImageUrl"
         class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div class="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-900">
            {{ uploadedImageUrl ? '图片导入预览' : '图片导出预览' }}
          </h3>
          <button @click="closeImagePreview" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="flex-1 p-6 flex justify-center items-center overflow-auto">
          <img :src="uploadedImageUrl || imageDownloadUrl || ''"
               :alt="uploadedImageUrl ? '导入图片预览' : '导出图片预览'"
               class="max-w-full h-auto max-h-[60vh]"/>
        </div>

        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-wrap gap-2">
          <template v-if="uploadedImageUrl">
            <button @click="confirmImageUpload"
                    class="flex-1 min-w-[120px] bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded">
              确认导入地图
            </button>
            <button @click="closeImagePreview"
                    class="flex-1 min-w-[120px] bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded">
              取消
            </button>
          </template>
          <template v-else>
            <a :href="imageDownloadUrl || ''"
               :download="`map-snapshot-${Date.now()}.png`"
               class="flex-1 min-w-[120px] bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded text-center">
              下载图片
            </a>
            <button @click="saveMapToLocal"
                    class="flex-1 min-w-[120px] bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded">
              保存到本地
            </button>
            <button @click="closeImagePreview"
                    class="flex-1 min-w-[120px] bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded">
              关闭预览
            </button>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
interface Props {
  imageDownloadUrl: string | null;
  uploadedImageUrl: string | null;
  uploadedGameData: any;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirmUpload'): void;
  (e: 'saveToLocal'): void;
}>();

const closeImagePreview = () => {
  emit('close');
};

const confirmImageUpload = () => {
  emit('confirmUpload');
};

const saveMapToLocal = () => {
  emit('saveToLocal');
};
</script>