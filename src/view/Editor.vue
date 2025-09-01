<template>
  <div class="h-screen bg-gray-100 flex flex-col overflow-hidden">
    <!-- 图片预览模态框 -->
    <ImagePreviewModal 
      :image-download-url="imageDownloadUrl"
      :uploaded-image-url="uploadedImageUrl"
      :uploaded-game-data="uploadedGameData"
      @close="closeImagePreview"
      @confirm-upload="confirmImageUpload"
      @save-to-local="saveMapToLocal"
    />

    <!-- 顶部导航栏 -->
    <EditorHeader
      ref="headerRef"
      @export-image="exportImageSnapshot"
      @import-image="() => triggerImageInput(headerRef?.imageInputRef || null)"
      @image-upload="handleImageUpload"
    />

    <!-- 主体内容 -->
    <main class="flex-1 overflow-hidden">
      <div class="h-full flex flex-col lg:flex-row overflow-hidden">
        <!-- 左侧编辑区域 -->
        <MapEditorArea 
          :map="map"
          :cargos="cargos"
          :targets="targets"
          :player="player"
        />

        <!-- 右侧工具面板 -->
        <EditorSidebar 
          :active-tab="activeTab"
          @change-tab="activeTab = $event"
        />
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import ImagePreviewModal from "@/components/editor/ImagePreviewModal.vue";
import EditorHeader from "@/components/editor/EditorHeader.vue";
import MapEditorArea from "@/components/editor/MapEditorArea.vue";
import EditorSidebar from "@/components/editor/EditorSidebar.vue";
import { useEditCargoStore } from "@/store/editor/editCargo.ts";
import { useEditTargetStore } from "@/store/editor/editTarget.ts";
import { useEditPlayerStore } from "@/store/editor/editPlayer.ts";
import { useMapEditorStore } from "@/store/editor/mapEditor.ts";
import { useImageHandler } from "@/composables/useImageHandler";

const { player } = useEditPlayerStore();
const { cargos } = useEditCargoStore();
const { targets } = useEditTargetStore();
const { map } = useMapEditorStore();

// 使用图片处理逻辑
const {
  imageDownloadUrl,
  uploadedImageUrl,
  uploadedGameData,
  exportImageSnapshot,
  handleImageUpload,
  closeImagePreview,
  triggerImageInput,
  confirmImageUpload,
  saveMapToLocal
} = useImageHandler();

const headerRef = ref<InstanceType<typeof EditorHeader> | null>(null);

// 标签页状态
const activeTab = ref<'design' | 'data' | 'guide'>('design');
</script>