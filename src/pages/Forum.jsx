import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Send, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const glassCard = 'bg-surface-raised/80 backdrop-blur-lg border border-border-bright/30 rounded-2xl shadow-lg shadow-shadow-noir/10';
const btnHolographic = 'bg-gradient-to-r from-accent-active/90 to-primary/90 text-white px-4 py-2 rounded-lg font-medium hover:from-accent-active/80 hover:to-primary/80 transition-all duration-200 shadow-lg shadow-accent-active/10 inline-flex items-center';

const Forum = () => {
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('Anonymous');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostAuthor, setNewPostAuthor] = useState('Anonymous');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchThreads();
  }, []);

  useEffect(() => {
    if (id) {
      fetchThread(id);
    } else {
      setSelectedThread(null);
    }
  }, [id]);

  const fetchThreads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/forum/threads');
      if (res.ok) {
        const data = await res.json();
        setThreads(data);
      }
    } catch (err) {
      console.error('Error fetching threads:', err);
    }
    setLoading(false);
  };

  const fetchThread = async (threadId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/forum/thread/${threadId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedThread(data);
      }
    } catch (err) {
      console.error('Error fetching thread:', err);
    }
    setLoading(false);
  };

  const createThread = async (e) => {
    e.preventDefault();
    if (!newThreadTitle.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/forum/thread', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newThreadTitle, author: newAuthor }),
      });
      if (res.ok) {
        const newThread = await res.json();
        setThreads([newThread, ...threads]);
        setNewThreadTitle('');
        setNewAuthor('Anonymous');
        navigate(`/forum/${newThread.id}`);
      }
    } catch (err) {
      console.error('Error creating thread:', err);
    }
    setLoading(false);
  };

  const createPost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/forum/thread/${id}/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newPostContent, author: newPostAuthor }),
      });
      if (res.ok) {
        const newPost = await res.json();
        if (selectedThread) {
          setSelectedThread({ ...selectedThread, posts: [...selectedThread.posts, newPost] });
        }
        setNewPostContent('');
        setNewPostAuthor('Anonymous');
      }
    } catch (err) {
      console.error('Error creating post:', err);
    }
    setLoading(false);
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  if (id && selectedThread) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={glassCard}
        >
          <button onClick={() => navigate('/forum')} className="mb-4 text-accent-active hover:underline">← Back to Forum</button>
          <h1 className="text-2xl font-bold mb-4">{selectedThread.title}</h1>
          <p className="text-sm text-text-secondary mb-4">By {selectedThread.author} on {new Date(selectedThread.created_at).toLocaleDateString()}</p>
          <div className="space-y-4 mb-6">
            {selectedThread.posts.map((post) => (
              <div key={post.id} className="p-4 bg-bg-secondary rounded-lg">
                <p className="text-sm text-text-secondary mb-1">By {post.author} on {new Date(post.created_at).toLocaleDateString()}</p>
                <p className="whitespace-pre-wrap">{post.content}</p>
              </div>
            ))}
          </div>
          <form onSubmit={createPost} className="space-y-2">
            <div>
              <input
                type="text"
                placeholder="Your name"
                value={newPostAuthor}
                onChange={(e) => setNewPostAuthor(e.target.value)}
                className="w-full p-2 border border-border rounded"
              />
            </div>
            <div>
              <textarea
                placeholder="Write your post..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full p-2 border border-border rounded"
                rows={4}
              />
            </div>
            <button type="submit" className={btnHolographic} disabled={loading}>
              <Send className="w-4 h-4 mr-2" /> Post Reply
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold mb-4 flex items-center">
          <MessageSquare className="w-8 h-8 mr-2 text-accent-active" /> Forum
        </h1>
        <p className="text-text-secondary mb-6">Discuss notarization, Bitcoin proofs, and the future of tamper-proof documents.</p>
        <form onSubmit={createThread} className={`p-4 ${glassCard} mb-6`}>
          <h2 className="text-xl font-semibold mb-3">Start a New Thread</h2>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Thread title"
              value={newThreadTitle}
              onChange={(e) => setNewThreadTitle(e.target.value)}
              className="w-full p-2 border border-border rounded"
            />
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Your name (optional)"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="flex-1 p-2 border border-border rounded"
              />
              <button type="submit" className={btnHolographic} disabled={loading || !newThreadTitle.trim()}>
                <Plus className="w-4 h-4 mr-2" /> Create
              </button>
            </div>
          </div>
        </form>
        <div className="space-y-4">
          {threads.length === 0 ? (
            <p className="text-center text-text-secondary py-8">No threads yet. Be the first to start a discussion!</p>
          ) : (
            threads.map((thread) => (
              <motion.div
                key={thread.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${glassCard} p-4 cursor-pointer hover:shadow-glow transition-all`}
                onClick={() => navigate(`/forum/${thread.id}`)}
              >
                <h2 className="text-xl font-semibold mb-1">{thread.title}</h2>
                <p className="text-sm text-text-secondary">By {thread.author} - {new Date(thread.created_at).toLocaleDateString()}</p>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Forum;