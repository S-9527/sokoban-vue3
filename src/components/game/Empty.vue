<template>
  <div class="w-[32px] h-[32px]"></div>
  <img :src="empty" alt="empty" v-if="false">
</template>

<script setup lang="ts">
import empty from '../../assets/empty.png'
</script>

<style scoped></style>