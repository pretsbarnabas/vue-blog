// src/stores/posts.ts
import { defineStore } from 'pinia'
import axios from 'axios'
import { Post } from '@/types'

export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: [] as Post[],
  }),
  actions: {
    async fetchPosts() {
      try {
        const { data } = await axios.get<Post[]>('http://localhost:3000/posts')
        this.posts = data
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    },
    async createPost(newPostData: Omit<Post, 'id' | 'author' | 'authorId' | 'authorEmail'>) {
      const token = localStorage.getItem('token')
      try {
        const { data } = await axios.post<Post>(
          'http://localhost:3000/posts',
          newPostData,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        this.posts.push(data)
        return data
      } catch (error) {
        console.error('Error creating post:', error)
        throw error
      }
    },
    async updatePost(postId: number, updateData: Partial<Post>) {
      const token = localStorage.getItem('token')
      try {
        const { data } = await axios.put<Post>(
          `http://localhost:3000/posts/${postId}`,
          updateData,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const index = this.posts.findIndex(p => p.id === postId)
        if (index !== -1) {
          this.posts.splice(index, 1, data)
        }
        return data
      } catch (error) {
        console.error('Error updating post:', error)
        throw error
      }
    },
    async deletePost(postId: number) {
      const token = localStorage.getItem('token')
      try {
        await axios.delete(`http://localhost:3000/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.posts = this.posts.filter(p => p.id !== postId)
      } catch (error) {
        console.error('Error deleting post:', error)
        throw error
      }
    },
  },
  getters: {
    latestPosts: state =>
      [...state.posts].sort((a, b) => b.id - a.id).slice(0, 6),
    uniqueCategories: state => {
      const cats = state.posts.map(post => post.category).filter(c => c)
      return Array.from(new Set(cats))
    },
    // New getter: returns a function that filters posts by title
    filteredPosts: (state) => {
      return (query: string) => {
        if (!query.trim()) return state.posts
        return state.posts.filter(post =>
          post.title.toLowerCase().includes(query.toLowerCase())
        )
      }
    },
  },
})
