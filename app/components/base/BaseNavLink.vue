<script setup lang="ts">
import type { Component } from 'vue'
import { cn } from '~/utils/common/cn'

const props = defineProps<{
  to: string
  label: string
  icon: Component
  active?: boolean
  class?: string
}>()
</script>

<template>
  <NuxtLink
    :to="to"
    :aria-current="active ? 'page' : undefined"
    :class="cn('blog-nav-link group/nav-link', active && 'is-active', props.class)"
  >
    <span
      class="nav-bar-menu-link__glow pointer-events-none absolute inset-0 rounded-lg"
      aria-hidden="true"
    />
    <span
      class="nav-bar-menu-link__shine pointer-events-none absolute inset-0 rounded-lg"
      aria-hidden="true"
    />

    <span class="relative z-10 flex items-center gap-2">
      <component
        :is="icon"
        class="nav-bar-menu-link__icon size-4 shrink-0"
        aria-hidden="true"
      />
      <span class="nav-bar-menu-link__label">
        {{ label }}
      </span>
    </span>

    <span
      class="nav-bar-menu-link__indicator pointer-events-none absolute inset-x-3 bottom-1"
      :class="{ 'is-active': active }"
      aria-hidden="true"
    >
      <span class="nav-bar-menu-link__line" />
      <span class="nav-bar-menu-link__dot" />
    </span>
  </NuxtLink>
</template>

<style scoped>
.blog-nav-link {
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  overflow: hidden;
  border-radius: 0.5rem;
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--blog-nav-muted);
  outline: none;
  transition: color 0.25s ease;
}

.blog-nav-link.is-active {
  color: var(--blog-nav-fg);
}

.nav-bar-menu-link__glow {
  background: radial-gradient(
    120% 80% at 50% 100%,
    color-mix(in srgb, var(--blog-accent) 18%, transparent),
    transparent 65%
  );
  opacity: 0;
  transform: scale(0.88);
  transition:
    opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.45s cubic-bezier(0.34, 1.4, 0.64, 1);
}

.nav-bar-menu-link__shine {
  background: linear-gradient(
    105deg,
    transparent 38%,
    color-mix(in srgb, var(--blog-nav-fg) 7%, transparent) 50%,
    transparent 62%
  );
  opacity: 0;
  transform: translateX(-120%);
  transition:
    opacity 0.35s ease,
    transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
}

.nav-bar-menu-link__icon {
  color: currentColor;
  transition:
    color 0.3s ease,
    transform 0.45s cubic-bezier(0.34, 1.4, 0.64, 1),
    filter 0.3s ease;
}

.nav-bar-menu-link__label {
  transition:
    color 0.3s ease,
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    letter-spacing 0.35s ease;
}

.nav-bar-menu-link__indicator {
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-bar-menu-link__line {
  display: block;
  width: 100%;
  height: 1px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    transparent,
    color-mix(in srgb, var(--blog-accent) 75%, transparent) 20%,
    color-mix(in srgb, var(--blog-accent) 75%, transparent) 80%,
    transparent
  );
  transform: scaleX(0);
  opacity: 0;
  transition:
    transform 0.4s cubic-bezier(0.34, 1.2, 0.64, 1),
    opacity 0.3s ease;
}

.nav-bar-menu-link__dot {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: var(--blog-accent);
  box-shadow: 0 0 10px color-mix(in srgb, var(--blog-accent) 65%, transparent);
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  transition:
    transform 0.45s cubic-bezier(0.34, 1.5, 0.64, 1),
    opacity 0.3s ease;
}

.blog-nav-link:hover .nav-bar-menu-link__glow,
.blog-nav-link:focus-visible .nav-bar-menu-link__glow {
  opacity: 1;
  transform: scale(1);
}

.blog-nav-link:hover .nav-bar-menu-link__shine,
.blog-nav-link:focus-visible .nav-bar-menu-link__shine {
  opacity: 1;
  transform: translateX(120%);
}

.blog-nav-link:hover .nav-bar-menu-link__icon,
.blog-nav-link:focus-visible .nav-bar-menu-link__icon {
  color: var(--blog-accent);
  transform: translateY(-2px) scale(1.1);
  filter: drop-shadow(0 0 6px color-mix(in srgb, var(--blog-accent) 45%, transparent));
}

.blog-nav-link:hover .nav-bar-menu-link__label,
.blog-nav-link:focus-visible .nav-bar-menu-link__label {
  color: var(--blog-nav-fg);
  transform: translateY(-1px);
  letter-spacing: 0.02em;
}

.blog-nav-link:hover .nav-bar-menu-link__line,
.blog-nav-link:focus-visible .nav-bar-menu-link__line {
  transform: scaleX(1);
  opacity: 1;
}

.blog-nav-link:hover .nav-bar-menu-link__indicator:not(.is-active) .nav-bar-menu-link__dot,
.blog-nav-link:focus-visible .nav-bar-menu-link__indicator:not(.is-active) .nav-bar-menu-link__dot {
  transform: translate(-50%, -50%) scale(0.65);
  opacity: 0.85;
}

.blog-nav-link.is-active .nav-bar-menu-link__glow {
  opacity: 1;
  transform: scale(1);
}

.blog-nav-link.is-active .nav-bar-menu-link__icon {
  color: var(--blog-accent);
  filter: drop-shadow(0 0 8px color-mix(in srgb, var(--blog-accent) 50%, transparent));
}

.blog-nav-link.is-active .nav-bar-menu-link__label {
  color: var(--blog-nav-fg);
}

.nav-bar-menu-link__indicator.is-active .nav-bar-menu-link__line {
  transform: scaleX(1);
  opacity: 1;
}

.nav-bar-menu-link__indicator.is-active .nav-bar-menu-link__dot {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .nav-bar-menu-link__glow,
  .nav-bar-menu-link__shine,
  .nav-bar-menu-link__icon,
  .nav-bar-menu-link__label,
  .nav-bar-menu-link__line,
  .nav-bar-menu-link__dot {
    transition: none;
  }

  .blog-nav-link:hover .nav-bar-menu-link__shine,
  .blog-nav-link:focus-visible .nav-bar-menu-link__shine {
    transform: none;
    opacity: 0;
  }
}
</style>
