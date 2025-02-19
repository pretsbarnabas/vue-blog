import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '@/views/HomeView.vue'
import PostPage from "@/views/PostPage.vue"
import CategoriesPage from "@/views/CategoriesPage.vue"
import CategoryPostsPage from "@/views/CategoryPostsPage.vue"
import NewPostPage from "@/views/NewPost.vue"
import AllPosts from '@/views/AllPosts.vue'
import EditPost from "@/views/EditPost.vue"

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/ProfileView.vue'),
    meta: { requiresAuth: true },
  },
  { path: '/categories', name: 'Categories', component: CategoriesPage },
  { path: '/categories/:category', name: 'CategoryPosts', component: CategoryPostsPage },
  { path: '/post/:id', name: 'Post', component: PostPage },
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  { path: '/new-post', name: 'NewPost', component: NewPostPage, meta: {requiresAuth:true} },
  { path: '/posts', name: 'AllPosts', component: AllPosts },
  { path: '/edit-post/:id', name: 'EditPost', component: EditPost, meta: {requiresAuth:true} }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Védett útvonal kezelése
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }

  // Vendég útvonal kezelése (pl. login oldal)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/profile')
    return
  }

  next()
})

export default router
