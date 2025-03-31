import { defineStore } from 'pinia'
import api from "@/main"
import type { Post } from '@/types'
import { reactive, computed, toRefs } from 'vue'

export const usePostsStore = defineStore('posts', () => {
  const state = reactive({
    posts: [] as Post[],
    loading: false,
    error: null as string | null
  })

  const latestPosts = computed(() => 
    [...state.posts].sort((a, b) => b.id - a.id).slice(0, 6))
  
  const uniqueCategories = computed(() => 
    Array.from(new Set(state.posts.map(post => post.category).filter(Boolean))))

  const filteredPosts = computed(() => (query: string) => 
    query.trim() 
      ? state.posts.filter(post => 
          post.title.toLowerCase().includes(query.toLowerCase()))
      : state.posts)

  const fetchPosts = async () => {
    state.loading = true
    try {
      const { data } = await api.get<Post[]>('/posts')
      state.posts = data
    } catch (error) {
      state.error = 'Failed to fetch posts'
    } finally {
      state.loading = false
    }
  }

  const postAction = async <T>(
    method: 'post' | 'put' | 'delete',
    url: string,
    data?: T
  ) => {
    state.loading = true
    try {
      const response = await api[method]<Post>(url, data)
      if (method === 'delete') {
        state.posts = state.posts.filter(p => p.id !== (data as any).id)
      } else {
        const index = state.posts.findIndex(p => p.id === response.data.id)
        index === -1 
          ? state.posts.push(response.data)
          : state.posts.splice(index, 1, response.data)
      }
      return response.data
    } catch (error) {
      state.error = `Failed to ${method} post`
      throw error
    } finally {
      state.loading = false
    }
  }

  return {
    ...toRefs(state),
    latestPosts,
    uniqueCategories,
    filteredPosts,
    fetchPosts,
    createPost: (newPost: Omit<Post, 'id'>) => 
      postAction('post', '/posts', newPost),
    updatePost: (id: number, updateData: Partial<Post>) => 
      postAction('put', `/posts/${id}`, updateData),
    deletePost: (id: number) => 
      postAction('delete', `/posts/${id}`)
  }
})