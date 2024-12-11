<template>
  <div class="layout">
    <header class="header">
      <!-- <HeaderMobile :items="routes" :locale="locale" @change:locale="setLocale" /> -->
    </header>

    <div class="content-wrapper">
      <div class="content">
        <slot name="content" />
      </div>

      <footer class="footer">
        <FooterDesktop />
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { inject } from 'vue'

// const { routes, locale, setLocale } = inject('navigation-data') as {
//   routes: any
//   locale: any
//   setLocale: (locale: any) => void
// }
</script>

<style scoped lang="scss">
// @use "/assets/colors" as *;
// @use "/assets/spacing" as *;

.layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.header {
  padding: 0rem 2rem;
  border-bottom: 1px solid $border-color;
}

.content {
  flex: 1;
  background-color: #ffffff;
  overflow-y: auto;
  padding: 1rem $tablet-padding;
}

.footer {
  background-color: $deep-purple;
  padding: 1rem;
}
</style>
