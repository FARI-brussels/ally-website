<template>
  <button
    :class="[
      'ally-btn',
      `ally-btn--${variant}`,
      { 'ally-btn--block': block, 'ally-btn--disabled': disabled }
    ]"
    :disabled="disabled"
  >
    <template v-if="!block && prependIcon">
      <img
        class="ally-btn__icon ally-btn__icon--prepend"
        :src="iconPath(prependIcon)"
        :alt="`${prependIcon} icon`"
        aria-hidden="true"
      >
    </template>
    <span class="ally-btn__content">
      {{ label }}
    </span>
    <template v-if="!block && appendIcon">
      <img
        class="ally-btn__icon ally-btn__icon--append"
        :src="iconPath(appendIcon)"
        :alt="`${appendIcon} icon`"
        aria-hidden="true"
      >
    </template>
  </button>
</template>

<script setup lang="ts">
// Import all icons in assets/icons
import ArrowRight from '~/assets/icons/arrow-right.svg';
import ArrowRightNew from '~/assets/icons/arrow-right-new.svg';
import ArrowRightPurple from '~/assets/icons/arrow-right-purple.svg';
import ChevronDown from '~/assets/icons/chevron-down.svg';
import ClockIcon from '~/assets/icons/clock-icon.svg';
import ClockIconBlack from '~/assets/icons/clock-icon-black.svg';
import CloseButton from '~/assets/icons/close-button.svg';
import LanguageIcon from '~/assets/icons/language-icon.svg';
import MoneyIcon from '~/assets/icons/money-icon.svg';
import MoneyIconBlack from '~/assets/icons/money-icon-black.svg';
import Search from '~/assets/icons/search.svg';
import ThunderIcon from '~/assets/icons/thunder-icon.svg';
import ThunderIconBlack from '~/assets/icons/thunder-icon-black.svg';
import CopyLink from '~/assets/icons/copy-link.svg';
import Check from '~/assets/icons/check.svg';

defineProps({
  prependIcon: {
    type: String as () => 'arrow-right' | 'search' | 'close' | 'chevron-down' | 'copy-link' | 'check' | string,
    default: ''
  },
  appendIcon: {
    type: String as () => 'arrow-right' | 'search' | 'close' | 'chevron-down' | 'copy-link' | 'check' | string,
    default: ''
  },
  block: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String as () => 'primary' | 'secondary' | 'gray',
    default: 'primary'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    required: true
  }
});

const iconMap: Record<string, string> = {
  'arrow-right': ArrowRight,
  'arrow-right-new': ArrowRightNew,
  'arrow-right-purple': ArrowRightPurple,
  'chevron-down': ChevronDown,
  'clock-icon': ClockIcon,
  'clock-icon-black': ClockIconBlack,
  'close': CloseButton,
  'close-button': CloseButton,
  'language-icon': LanguageIcon,
  'money-icon': MoneyIcon,
  'money-icon-black': MoneyIconBlack,
  'search': Search,
  'thunder-icon': ThunderIcon,
  'thunder-icon-black': ThunderIconBlack,
  'copy-link': CopyLink,
  'check': Check
};

function iconPath(name: string) {
  return iconMap[name] || '';
}

</script>

<style scoped lang="scss">
@use '/assets/scss/colors';
@use 'sass:map';

.ally-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1.5px solid map.get(colors.$colors, 'gray-light-mode-300');
  background: map.get(colors.$colors, 'base-white');
  color: map.get(colors.$colors, 'gray-light-mode-950');
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border 0.15s;
  outline: none;
  user-select: none;

  &__icon {
    width: 1.25em;
    height: 1.25em;
    display: inline-block;
    vertical-align: middle;
    &--prepend { margin-right: 0.5em; }
    &--append { margin-left: 0.5em; }
  }

  &--primary {
    background: map.get(colors.$colors, 'base-white');
    color: map.get(colors.$colors, 'gray-light-mode-950');
    border: 1.5px solid map.get(colors.$colors, 'gray-light-mode-300');
    &:hover:not(:disabled), &:active:not(:disabled) {
      background: map.get(colors.$colors, 'brand-300');
      color: map.get(colors.$colors, 'gray-light-mode-950');
      border-color: map.get(colors.$colors, 'brand-300');
    }
  }

  &--secondary {
    background: map.get(colors.$colors, 'brand-600');
    color: map.get(colors.$colors, 'base-white');
    border: 1.5px solid map.get(colors.$colors, 'brand-600');
    &:hover:not(:disabled), &:active:not(:disabled) {
      background: map.get(colors.$colors, 'brand-300');
      color: map.get(colors.$colors, 'base-white');
      border-color: map.get(colors.$colors, 'brand-300');
    }
  }

  &--gray {
    background: map.get(colors.$colors, 'gray-light-mode-100');
    color: map.get(colors.$colors, 'gray-light-mode-950');
    border: 1.5px solid map.get(colors.$colors, 'gray-light-mode-100');
    &:hover:not(:disabled), &:active:not(:disabled) {
      background: map.get(colors.$colors, 'brand-300');
      color: map.get(colors.$colors, 'base-white');
      border-color: map.get(colors.$colors, 'brand-300');
    }
  }

  &--block {
    display: flex;
    width: 100%;
    justify-content: center;
    .ally-btn__icon { display: none; }
  }

  &--disabled,
  &:disabled {
    cursor: not-allowed;
    opacity: 1;
  }
  &--primary:disabled,
  &--primary.ally-btn--disabled {
    background: map.get(colors.$colors, 'gray-light-mode-100');
    color: map.get(colors.$colors, 'gray-light-mode-500');
    border-color: map.get(colors.$colors, 'gray-light-mode-200');
  }
  &--secondary:disabled,
  &--secondary.ally-btn--disabled {
    background: map.get(colors.$colors, 'brand-100');
    color: map.get(colors.$colors, 'gray-light-mode-400');
    border-color: map.get(colors.$colors, 'gray-light-mode-200');
  }
}
</style> 