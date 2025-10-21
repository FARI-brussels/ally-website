<template>
  <div class="layout">
    <header class="header">
      <HeaderDesktop
        :items="orderedRoutes"
        :locale="locale"
        @change:locale="setLocale"
      />
    </header>
    <div class="content-wrapper">
      <div class="content">
        <NuxtPage />
      </div>

      <footer class="footer">
        <FooterMobile v-if="isMobile" :items="orderedRoutes" />
        <FooterDesktop v-else :items="orderedRoutes" />
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { provide } from "vue";
import { useIsMobile } from "~/composables/useIsMobile";

const { setLocale } = useGlobalStore();
const { locale } = storeToRefs(useGlobalStore());

const desiredOrder = ["/", "/building-blocks", "/cases", "/about"];

const routes = useRouter()
  .getRoutes()
  .filter(({ path }) => !path.includes(":"));

const orderedRoutes = desiredOrder.map((path) =>
  routes.find((route) => route.path === path),
);

const { isMobile } = useIsMobile();
provide("isMobile", isMobile);
</script>

<style scoped lang="scss">
@use "/assets/scss/colors" as *;
@use "/assets/scss/spacing" as *;

.layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.header {
  padding: 0rem $desktop-padding;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 4;
}

.content-wrapper {
  min-height: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
}

.content {
  background-color: #ffffff;
  padding: 0rem $desktop-padding;
  height: fit-content;

  @media (max-width: 600px) {
    padding: $mobile-padding;
  }
}

.footer {
  background-color: $deep-purple;
  padding: 1rem;
  margin-top: auto;
}
</style>
