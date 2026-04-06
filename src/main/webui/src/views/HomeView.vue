<script setup lang="ts">
import Sidebar from "@/components/Navigation/Sidebar.vue";
</script>

<template>
    <div class="cx-layout-350-60">
        <aside>
            <Sidebar />
        </aside>

        <header class="sticky-header">
            <div class="cluster p-2" style="width:100%; --justify: space-between;">
                <button class="cx-button outlined" style="padding-top:4px;"><i class="ti ti-baseline-density-medium"></i></button>
                <div class="" style="display:flex; align-items: center; gap:10px;">
                    <RouterLink to="/theme"><div class="app-theme">Theme</div></RouterLink>
                    <RouterLink to="/profile"><div class="user-profile">Profile</div></RouterLink>
                </div>
            </div>
        </header>

        <main class="p-4">
            <RouterView/>
        </main>

    </div>
</template>
