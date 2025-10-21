import { ref, onMounted, onUnmounted } from "vue";

const isMobile = ref(false);

function checkMobile() {
  isMobile.value = window.innerWidth <= 900;
}

export function useIsMobile() {
  onMounted(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile);
  });
  onUnmounted(() => {
    window.removeEventListener("resize", checkMobile);
  });
  return { isMobile: isMobile as Ref<boolean> };
}
