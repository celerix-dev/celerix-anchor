import type { RouteRecordRaw } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import Index from "@/views/Index.vue";
import ThemeView from "@/views/ThemeView.vue";

// Define the routes for the generic routes
export const basicRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
        children: [
            {
                path: '/',
                name: 'main-ide-index',
                component: Index
            },
            {
                path: '/theme',
                name: 'main-theme',
                component: ThemeView
            }
        ]
    }
];
