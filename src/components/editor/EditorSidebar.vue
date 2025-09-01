<template>
  <div
      class="w-full lg:w-80 xl:w-96 flex-shrink-0 border-l border-gray-200 bg-white flex flex-col overflow-hidden">
    <div class="flex border-b border-gray-200">
      <button v-for="tab in tabs"
              :key="tab.id"
              @click="changeTab(tab.id)"
              class="flex-1 py-3 px-4 text-center text-sm font-medium"
              :class="activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'">
        {{ tab.name }}
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-4">
      <!-- 地图设计 -->
      <div v-show="activeTab === 'design'" class="h-full overflow-auto">
        <h2 class="text-lg font-medium text-gray-900 mb-4">地图设计</h2>
        <EditElementView/>
      </div>

      <!-- 地图数据 -->
      <div v-show="activeTab === 'data'" class="h-full overflow-auto">
        <h2 class="text-lg font-medium text-gray-900 mb-4">地图数据</h2>
        <MapDataDisplay/>
      </div>

      <!-- 操作指南 -->
      <div v-show="activeTab === 'guide'" class="h-full overflow-auto">
        <h2 class="text-lg font-medium text-gray-900 mb-4">操作指南</h2>
        <div class="text-sm text-gray-600 space-y-3">
          <div class="bg-blue-50 p-3 rounded-lg">
            <h3 class="font-medium text-blue-800 mb-1">基础操作</h3>
            <ul class="list-disc pl-5 space-y-1">
              <li>在左侧编辑区域点击放置元素</li>
              <li>双击元素可删除（玩家、箱子、目标点）</li>
              <li>拖动可移动墙壁、地板和空白元素</li>
            </ul>
          </div>

          <div class="bg-green-50 p-3 rounded-lg">
            <h3 class="font-medium text-green-800 mb-1">元素叠加</h3>
            <ul class="list-disc pl-5 space-y-1">
              <li>玩家和箱子可以放在目标点上</li>
              <li>系统会自动处理叠加元素的显示</li>
            </ul>
          </div>

          <div class="bg-purple-50 p-3 rounded-lg">
            <h3 class="font-medium text-purple-800 mb-1">数据管理</h3>
            <ul class="list-disc pl-5 space-y-1">
              <li>使用"地图数据"标签页导入/导出JSON</li>
              <li>使用顶部按钮导入/导出图片</li>
              <li>支持从已有地图图片导入</li>
            </ul>
          </div>

          <div class="bg-yellow-50 p-3 rounded-lg">
            <h3 class="font-medium text-yellow-800 mb-1">提示</h3>
            <ul class="list-disc pl-5 space-y-1">
              <li>请确保地图中至少有一个玩家</li>
              <li>箱子数量应与目标点数量相等</li>
              <li>保存地图前请预览确认</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import EditElementView from "@/components/editor/EditElementView.vue";
import MapDataDisplay from "@/components/editor/MapDataDisplay.vue";

interface Props {
  activeTab: 'design' | 'data' | 'guide';
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'changeTab', tab: 'design' | 'data' | 'guide'): void;
}>();

const tabs = reactive([
  {id: 'design' as const, name: '地图设计'},
  {id: 'data' as const, name: '地图数据'},
  {id: 'guide' as const, name: '操作指南'}
]);

const changeTab = (tab: 'design' | 'data' | 'guide') => {
  emit('changeTab', tab);
};
</script>