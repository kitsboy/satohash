import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, Send, MessageSquare, RefreshCw, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useI18n } from '../i18n'
import EmptyState from '../components/EmptyState'
import usePageMeta from '../hooks/usePageMeta'
import { getApiUrl } from '../config/constants'

const API_URL = getApiUrl()

const glassCard = 'rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] shadow-lg'
const btnHolographic =
  'bg-[var(--accent-active)] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all duration-200 shadow-lg inline-flex items-center'

function getForumNpub() {
  return localStorage.getItem('satohash_npub') || sessionStorage.getItem('satohash_npub')
}

function forumHeaders() {
  const headers = { 'Content-Type': 'application/json' }
  const npub = getForumNpub()
  if (npub) headers['x-npub'] = npub
  return headers
}

const Forum = () => {
  usePageMeta({ page: 'forum' })
  const { t } = useI18n()

  const requireForumNpub = () => {
    if (!getForumNpub()) {
      toast.error(t('forum', 'npubRequired'))
      return false
    }
    return true
  }
  const [threads, setThreads] = useState([])
  const [selectedThread, setSelectedThread] = useState(null)
  const [newThreadTitle, setNewThreadTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('Anonymous')
  const [newPostContent, setNewPostContent] = useState('')
  const [newPostAuthor, setNewPostAuthor] = useState('Anonymous')
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState(null)
  const navigate = useNavigate()
  const { id } = useParams()

  const fetchThreads = useCallback(async () => {
    setLoading(true)
    setFetchError(null)
    try {
      const res = await fetch(`${API_URL}/api/forum/threads`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setThreads(data.threads ?? [])
    } catch (err) {
      console.error('Error fetching threads:', err)
      setFetchError(t('errors', 'loadFailed') || 'Failed to load forum threads')
      toast.error(t('errors', 'loadFailed') || 'Failed to load forum threads.')
    } finally {
      setLoading(false)
    }
  }, [t])

  const fetchThread = useCallback(
    async (threadId) => {
      setLoading(true)
      setFetchError(null)
      try {
        const res = await fetch(`${API_URL}/api/forum/threads/${threadId}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setSelectedThread({ ...data.thread, posts: data.posts ?? [] })
      } catch (err) {
        console.error('Error fetching thread:', err)
        setFetchError(t('errors', 'loadFailed') || 'Failed to load thread')
        toast.error(t('errors', 'loadFailed') || 'Failed to load thread.')
      } finally {
        setLoading(false)
      }
    },
    [t]
  )

  useEffect(() => {
    fetchThreads()
  }, [fetchThreads])

  useEffect(() => {
    if (id) {
      fetchThread(id)
    } else {
      setSelectedThread(null)
    }
  }, [id, fetchThread])

  const createThread = async (e) => {
    e.preventDefault()
    if (!newThreadTitle.trim()) return
    if (!requireForumNpub()) return
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/forum/threads`, {
        method: 'POST',
        headers: forumHeaders(),
        body: JSON.stringify({ title: newThreadTitle, author: newAuthor })
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const thread = data.thread ?? data
      setThreads((prev) => [thread, ...prev])
      setNewThreadTitle('')
      setNewAuthor('Anonymous')
      navigate(`/forum/${thread.id}`)
    } catch (err) {
      console.error('Error creating thread:', err)
      toast.error(t('errors', 'generic') || 'Failed to create thread.')
    } finally {
      setLoading(false)
    }
  }

  const createPost = async (e) => {
    e.preventDefault()
    if (!newPostContent.trim() || !id) return
    if (!requireForumNpub()) return
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/forum/threads/${id}/posts`, {
        method: 'POST',
        headers: forumHeaders(),
        body: JSON.stringify({ content: newPostContent, author: newPostAuthor })
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const post = data.post ?? data
      if (selectedThread) {
        setSelectedThread({ ...selectedThread, posts: [...(selectedThread.posts ?? []), post] })
      }
      setNewPostContent('')
      setNewPostAuthor('Anonymous')
    } catch (err) {
      console.error('Error creating post:', err)
      toast.error(t('errors', 'generic') || 'Failed to submit reply.')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !selectedThread && threads.length === 0)
    return (
      <div
        className="flex h-64 items-center justify-center"
        style={{ color: 'var(--text-secondary)' }}
        role="status"
        aria-live="polite"
      >
        {t('common', 'loading')}
      </div>
    )

  if (id && selectedThread) {
    return (
      <div className="mx-auto max-w-4xl p-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${glassCard} p-6`}
        >
          <button
            type="button"
            onClick={() => navigate('/forum')}
            className="mb-4 hover:underline"
            style={{ color: 'var(--accent-active)' }}
          >
            {t('forum', 'backToForum')}
          </button>
          <h1 className="mb-4 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {selectedThread.title}
          </h1>
          <p className="mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
            By {selectedThread.author} on {new Date(selectedThread.created_at).toLocaleDateString()}
          </p>
          <div className="mb-6 space-y-4">
            {(selectedThread.posts ?? []).map((post) => (
              <div
                key={post.id}
                className="rounded-lg p-4"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
              >
                <p className="mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  By {post.author} on {new Date(post.created_at).toLocaleDateString()}
                </p>
                <p className="whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>
                  {post.content}
                </p>
              </div>
            ))}
          </div>
          <form onSubmit={createPost} className="space-y-2">
            <div>
              <input
                type="text"
                placeholder={t('forum', 'yourName')}
                value={newPostAuthor}
                onChange={(e) => setNewPostAuthor(e.target.value)}
                className="w-full rounded p-2"
                style={{
                  background: 'var(--surface-raised)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
            <div>
              <textarea
                aria-label={t('forum', 'writePost')}
                placeholder={t('forum', 'writePost')}
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full rounded p-2"
                style={{
                  background: 'var(--surface-raised)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)'
                }}
                rows={4}
              />
            </div>
            <button type="submit" className={btnHolographic} disabled={loading}>
              <Send className="mr-2 h-4 w-4" /> {t('forum', 'postReply')}
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl p-4 pb-20">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <h1
          className="mb-4 flex items-center text-3xl font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          <MessageSquare className="mr-2 h-8 w-8" style={{ color: 'var(--accent-active)' }} />{' '}
          {t('forum', 'pageTitle')}
        </h1>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
          {t('forum', 'subtitle')}
        </p>

        {fetchError && (
          <div
            role="alert"
            className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-[var(--accent-danger)]/30 bg-[var(--accent-danger)]/10 px-4 py-3"
          >
            <div className="flex items-center gap-2 text-sm text-[var(--accent-danger)]">
              <AlertCircle size={16} />
              {fetchError}
            </div>
            <button
              type="button"
              onClick={() => (id ? fetchThread(id) : fetchThreads())}
              className="flex items-center gap-2 text-xs font-bold uppercase"
            >
              <RefreshCw size={14} />
              {t('common', 'retry')}
            </button>
          </div>
        )}

        <form onSubmit={createThread} className={`p-4 ${glassCard} mb-6`}>
          <h2 className="mb-3 text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            {t('forum', 'newThread')}
          </h2>
          <div className="space-y-2">
            <input
              type="text"
              aria-label={t('forum', 'threadTitle')}
              placeholder={t('forum', 'threadTitle')}
              value={newThreadTitle}
              onChange={(e) => setNewThreadTitle(e.target.value)}
              className="w-full rounded p-2"
              style={{
                background: 'var(--surface-raised)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)'
              }}
            />
            <div className="flex space-x-2">
              <input
                type="text"
                aria-label={t('forum', 'yourName')}
                placeholder={t('forum', 'yourName')}
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="flex-1 rounded p-2"
                style={{
                  background: 'var(--surface-raised)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)'
                }}
              />
              <button
                type="submit"
                className={btnHolographic}
                disabled={loading || !newThreadTitle.trim()}
              >
                <Plus className="mr-2 h-4 w-4" /> {t('forum', 'createThread')}
              </button>
            </div>
          </div>
        </form>
        <div className="space-y-4">
          {threads.length === 0 ? (
            <EmptyState
              icon="💬"
              title={t('forum', 'noDiscussions')}
              description="Be the first to start a conversation about Bitcoin timestamping, use cases, or the protocol."
            />
          ) : (
            threads.map((thread) => (
              <motion.div
                key={thread.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    navigate(`/forum/${thread.id}`)
                  }
                }}
                className={`${glassCard} hover:shadow-glow cursor-pointer p-4 transition-all`}
                onClick={() => navigate(`/forum/${thread.id}`)}
              >
                <h2 className="mb-1 text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {thread.title}
                </h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  By {thread.author} - {new Date(thread.created_at).toLocaleDateString()}
                </p>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default Forum
