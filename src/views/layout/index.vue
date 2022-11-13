<template>
  <div class="d-flex width height">
    <div style="width: 70px; height: 100%;">
      <Menu></Menu>
    </div>
    <div style="width: calc(100% - 70px); height: 100%;">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Menu from '../menu/index.vue'

</script>