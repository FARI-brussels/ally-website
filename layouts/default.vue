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
        <FooterDesktop />
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
const { setLocale } = useGlobalStore();
const { locale } = storeToRefs(useGlobalStore());

const desiredOrder = ["/", "/building-blocks", "/cases", "/about"];

const routeLabels: Record<string, string> = {
  "/": "Home",
  "/building-blocks": "Building Blocks",
  "/cases": "Cases",
  "/about": "About"
};

const routes = useRouter()
  .getRoutes()
  .filter(({ path }) => !path.includes(":"));

const orderedRoutes = desiredOrder.map((path) => {
  const route = routes.find((route) => route.path === path);
  return route ? { ...route, label: routeLabels[route.path] || route.name } : null;
}).filter(Boolean);

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
  // flex: 1;
  background-color: #ffffff;
  // overflow-y: auto;
  padding: 0rem $desktop-padding;
  height: fit-content;
}

.footer {
  background-color: $deep-purple;
  padding: 1rem;
  margin-top: auto;
}
</style>
