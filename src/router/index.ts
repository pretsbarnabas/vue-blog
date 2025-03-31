import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { 
      requiresGuest: true,
      layout: 'AuthLayout' 
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { 
      requiresGuest: true,
      layout: 'AuthLayout'
    },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { 
      requiresAuth: true,
      title: 'User Profile' 
    },
  },
  { 
    path: '/categories', 
    name: 'Categories', 
    component: () => import('@/views/CategoriesPage.vue'),
    meta: { title: 'Categories' }
  },
  { 
    path: '/categories/:category', 
    name: 'CategoryPosts', 
    component: () => import('@/views/CategoryPostsPage.vue'),
    props: true 
  },
  { 
    path: '/post/:id', 
    name: 'Post', 
    component: () => import('@/views/PostPage.vue'),
    props: true
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Home' }
  },
  { 
    path: '/new-post', 
    name: 'NewPost', 
    component: () => import('@/views/NewPost.vue'),
    meta: {
      requiresAuth: true,
      title: 'Create New Post'
    } 
  },
  { 
    path: '/posts', 
    name: 'AllPosts', 
    component: () => import('@/views/AllPosts.vue'),
    meta: { title: 'All Posts' }
  },
  { 
    path: '/edit-post/:id', 
    name: 'EditPost', 
    component: () => import('@/views/EditPost.vue'),
    meta: {
      requiresAuth: true,
      title: 'Edit Post'
    },
    props: true
  }
]

const router = createRouter({
  history: createWebHistory('/'), 
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/login'
  }

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return '/profile'
  }

  if (to.meta.title) {
    document.title = `${to.meta.title} | Blog`
  }
})

export default router