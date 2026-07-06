import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, Send, MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useI18n } from '../i18n'
import EmptyState from '../components/EmptyState'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const glassCard = 'rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] shadow-lg'
const btnHolographic =
  'bg-[var(--accent-active)] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all duration-200 shadow-lg inline-flex items-center'

const Forum = () => {
  const [threads, setThreads] = useState([])
  const [selectedThread, setSelectedThread] = useState(null)
  const [newThreadTitle, setNewThreadTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('Anonymous')
  const [newPostContent, setNewPostContent] = useState('')
  const [newPostAuthor, setNewPostAuthor] = useState('Anonymous')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()
  const { t } = useI18n()

  const fetchThreads = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/forum/threads`)
      if (res.ok) {
        const data = await res.json()
        setThreads(data)
      }
    } catch (err) {
      console.error('Error fetching threads:', err)
      toast.error('Failed to load forum threads.')
    }
    setLoading(false)
  }

  const fetchThread = async (threadId) => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/forum/thread/${threadId}`)
      if (res.ok) {
        const data = await res.json()
        setSelectedThread(data)
      }
    } catch (err) {
      console.error('Error fetching thread:', err)
      toast.error('Failed to load thread.')
    }
    setLoading(false)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchThreads()
  }, [])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (id) {
      fetchThread(id)
    } else {
      setSelectedThread(null)
    }
  }, [id])

  const createThread = async (e) => {
    e.preventDefault()
    if (!newThreadTitle.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/forum/thread`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newThreadTitle, author: newAuthor })
      })
      if (res.ok) {
        const newThread = await res.json()
        setThreads([newThread, ...threads])
        setNewThreadTitle('')
        setNewAuthor('Anonymous')
        navigate(`/forum/${newThread.id}`)
      }
    } catch (err) {
      console.error('Error creating thread:', err)
      toast.error('Failed to create thread.')
    }
    setLoading(false)
  }

  const createPost = async (e) => {
    e.preventDefault()
    if (!newPostContent.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/forum/thread/${id}/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newPostContent, author: newPostAuthor })
      })
      if (res.ok) {
        const newPost = await res.json()
        if (selectedThread) {
          setSelectedThread({ ...selectedThread, posts: [...selectedThread.posts, newPost] })
        }
        setNewPostContent('')
        setNewPostAuthor('Anonymous')
      }
    } catch (err) {
      console.error('Error creating post:', err)
      toast.error('Failed to submit reply.')
    }
    setLoading(false)
  }

  if (loading)
    return (
      <div
        className="flex h-64 items-center justify-center"
        style={{ color: 'var(--text-secondary)' }}
      >
        Loading...
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
            {selectedThread.posts.map((post) => (
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
        <form onSubmit={createThread} className={`p-4 ${glassCard} mb-6`}>
          <h2 className="mb-3 text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            {t('forum', 'newThread')}
          </h2>
          <div className="space-y-2">
            <input
              type="text"
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
