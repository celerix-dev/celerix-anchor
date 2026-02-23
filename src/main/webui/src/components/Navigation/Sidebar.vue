<script setup lang="ts">
import logo from '@/assets/logo.svg'
</script>

<template>
    <aside class="surface sidebar stack g-3" style="padding: var(--s-3);">
        <header class="cluster">
            <img class="logo" :src="logo" width="48" alt="logo" />
            <span class="text-bold text-uppercase">Link</span>
        </header>

        <nav class="stack" style="--gap: var(--s-2);">
            <small class="text-muted text-uppercase text-bold">Items</small>
            <RouterLink class="nav-link" to="/">Dashboard</RouterLink>
            <a href="#" class="nav-link">Settings</a>
        </nav>
    </aside>
</template>

<style scoped>
.sidebar {
    height: 100vh;
    position: sticky;
    top: 0;
    overflow-y: auto;
    overflow-x: hidden;
    border-right: 1px solid var(--separator);
}
</style>
