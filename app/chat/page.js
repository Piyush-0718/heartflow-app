'use client'

import { useEffect, useRef, useState } from 'react'
import { Heart, Search, Send, Smile, Image, MoreVertical, ArrowLeft, Shield, AlertCircle, MessageCircle, Mic, CornerUpLeft, X } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { io } from 'socket.io-client'

export default function ChatPage() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  const socketBase = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'
  const valentineFeatureEnabled = process.env.NEXT_PUBLIC_VALENTINE_MODE !== 'false'

  const socketRef = useRef(null)
  const selectedChatRef = useRef(null)
  const fileInputRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const typingTimeoutRef = useRef(null)
  const messagesContainerRef = useRef(null)

  const [mounted, setMounted] = useState(false)
  const [token, setToken] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  const [loading, setLoading] = useState(true)
  const [chats, setChats] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [message, setMessage] = useState('')
  const [messagesByChat, setMessagesByChat] = useState({})
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showActionsMenu, setShowActionsMenu] = useState(false)
  const [showProfilePreview, setShowProfilePreview] = useState(false)
  const [showReportConfirm, setShowReportConfirm] = useState(false)
  const [showClearChatConfirm, setShowClearChatConfirm] = useState(false)
  const [conversationStatus, setConversationStatus] = useState({ blocked: false, iBlocked: false, blockedMe: false })
  const [isValentineMode, setIsValentineMode] = useState(false)
  const [hasSentValentine, setHasSentValentine] = useState(false)
  const [typingStateByUser, setTypingStateByUser] = useState({})
  const [pendingScrollTargetId, setPendingScrollTargetId] = useState(null)
  const [shouldScrollBottom, setShouldScrollBottom] = useState(false)
  const [replyingTo, setReplyingTo] = useState(null)

  const emojis = ['ðŸ˜€', 'ðŸ˜‚', 'ðŸ˜', 'ðŸ¥³', 'ðŸ‘', 'ðŸ™', 'â¤ï¸', 'ðŸ”¥', 'ðŸŽ‰', 'ðŸ˜Š']
  const valentineQuickNotes = [
    { label: 'Sweet', text: 'You made my day better just by being here.' },
    { label: 'Cute', text: 'Your smile is honestly my favorite distraction.' },
    { label: 'Flirty', text: 'I was trying to focus, then I thought of you.' },
    { label: 'Warm', text: 'Talking to you feels like home.' },
  ]

  const selectedChatMeta = chats.find((chat) => String(chat.userId) === String(selectedChat))
  const selectedChatMessages = messagesByChat[selectedChat] || []

  useEffect(() => {
    setMounted(true)
    const storedToken = localStorage.getItem('authToken')
    const rawUser = localStorage.getItem('currentUser')
    let parsedUser = null
    if (rawUser) {
      try {
        parsedUser = JSON.parse(rawUser)
      } catch (error) {
        parsedUser = null
      }
    }
    setToken(storedToken)
    setCurrentUser(parsedUser)
  }, [])

  useEffect(() => {
    selectedChatRef.current = selectedChat
    setShowActionsMenu(false)
    setReplyingTo(null)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }
  }, [selectedChat])

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (!currentUser?.id || !selectedChat) return
    const key = `valentine_once_${currentUser.id}_${selectedChat}`
    setHasSentValentine(localStorage.getItem(key) === '1')
  }, [currentUser?.id, selectedChat])

  const formatChatTime = (iso) => {
    if (!iso) return ''
    const d = new Date(iso)
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const getMessagePreview = (text, type) => {
    if (type === 'image') return 'ðŸ“· Photo'
    if (type === 'audio') return 'ðŸŽ¤ Voice note'
    const value = String(text || '')
    if (value.startsWith('data:image/')) return 'ðŸ“· Photo'
    if (value.startsWith('data:audio/')) return 'ðŸŽ¤ Voice note'
    if (value.startsWith('data:video/')) return 'ðŸŽ¬ Video'
    return value || 'Start conversation'
  }

  const getReplySnippet = (msg) => {
    if (!msg) return ''
    if (msg.type === 'image') return 'Photo'
    if (msg.type === 'audio') return 'Voice note'
    const value = String(msg.text || '')
    if (value.startsWith('data:image/')) return 'Photo'
    if (value.startsWith('data:audio/')) return 'Voice note'
    return value
  }

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  })

  const isNearBottom = () => {
    const container = messagesContainerRef.current
    if (!container) return false
    return container.scrollHeight - (container.scrollTop + container.clientHeight) < 120
  }

  const loadConversations = async () => {
    const response = await fetch(`${apiBase}/api/messages/conversations`, { headers: authHeaders() })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Failed to fetch conversations')
    setChats((data || []).map((chat) => ({ ...chat, userId: String(chat.userId) })))
  }

  const loadConversationMessages = async (otherUserId) => {
    const response = await fetch(`${apiBase}/api/messages/${otherUserId}`, { headers: authHeaders() })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Failed to fetch messages')
    setMessagesByChat((prev) => ({ ...prev, [otherUserId]: data }))
    return data
  }

  const loadConversationStatus = async (otherUserId) => {
    const response = await fetch(`${apiBase}/api/messages/status/${otherUserId}`, { headers: authHeaders() })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Failed to fetch status')
    setConversationStatus(data)
  }

  const markRead = async (otherUserId) => {
    await fetch(`${apiBase}/api/messages/${otherUserId}/read`, {
      method: 'PATCH',
      headers: authHeaders(),
    })
    setMessagesByChat((prev) => ({
      ...prev,
      [otherUserId]: (prev[otherUserId] || []).map((m) =>
        m.senderId === otherUserId ? { ...m, isRead: true } : m
      ),
    }))
    socketRef.current?.emit('mark_read', { otherUserId })
    setChats((prev) => prev.map((c) => (String(c.userId) === String(otherUserId) ? { ...c, unreadCount: 0 } : c)))
  }

  useEffect(() => {
    if (!token || !currentUser?.id) {
      setLoading(false)
      return
    }

    const bootstrap = async () => {
      try {
        await loadConversations()
      } catch (error) {
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }
    bootstrap()

    const socket = io(socketBase, { transports: ['websocket'], auth: { token } })
    socketRef.current = socket

    socket.on('connect_error', () => toast.error('Socket connection failed'))
    socket.on('message_blocked', ({ error }) => {
      toast.error(error || 'Message blocked')
    })
    socket.on('message_error', ({ error }) => {
      toast.error(error || 'Failed to send message')
    })
    socket.on('presence_update', ({ userId, online }) => {
      const normalizedUserId = String(userId)
      setChats((prev) =>
        prev.map((c) =>
          String(c.userId) === normalizedUserId
            ? { ...c, online: c.isBot ? true : !!online }
            : c
        )
      )
    })
    socket.on('user_typing', ({ userId, isTyping }) => {
      setTypingStateByUser((prev) => ({ ...prev, [userId]: !!isTyping }))
    })
    socket.on('messages_read', ({ readerId, otherUserId, readAt }) => {
      setMessagesByChat((prev) => {
        let peerId = null
        if (readerId === currentUser.id) peerId = otherUserId
        else if (otherUserId === currentUser.id) peerId = readerId
        if (!peerId) return prev

        return {
          ...prev,
          [peerId]: (prev[peerId] || []).map((m) =>
            m.senderId === otherUserId && m.receiverId === readerId
              ? { ...m, isRead: true, readAt: readAt || m.readAt }
              : m
          ),
        }
      })
    })
    socket.on('receive_message', (incoming) => {
      const otherId = incoming.senderId === currentUser.id ? incoming.receiverId : incoming.senderId
      const wasNearBottom = isNearBottom()
      if (incoming.senderId !== currentUser.id) {
        setTypingStateByUser((prev) => ({ ...prev, [incoming.senderId]: false }))
      }
      setMessagesByChat((prev) => ({
        ...prev,
        [otherId]: [...(prev[otherId] || []), { ...incoming, isMine: incoming.senderId === currentUser.id }],
      }))
      setChats((prev) =>
        prev
          .map((c) =>
            String(c.userId) === String(otherId)
              ? {
                  ...c,
                  lastMessage: getMessagePreview(incoming.text, incoming.type),
                  lastMessageAt: incoming.createdAt,
                  unreadCount:
                    selectedChatRef.current === otherId || incoming.senderId === currentUser.id
                      ? c.unreadCount
                      : (c.unreadCount || 0) + 1,
                }
              : c
          )
          .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt))
      )

      if (selectedChatRef.current === otherId && (incoming.senderId === currentUser.id || wasNearBottom)) {
        setShouldScrollBottom(true)
      }
    })

    return () => socket.disconnect()
  }, [token, currentUser?.id, socketBase])

  useEffect(() => {
    if (!selectedChat || !token) return
    const run = async () => {
      try {
        await loadConversationStatus(selectedChat)
        const loadedMessages = await loadConversationMessages(selectedChat)
        const firstUnread = loadedMessages.find((m) => !m.isMine && !m.isRead)
        if (firstUnread?.id) {
          setPendingScrollTargetId(String(firstUnread.id))
          setShouldScrollBottom(false)
        } else {
          // No unread messages: always resume at latest message.
          setPendingScrollTargetId(null)
          setShouldScrollBottom(true)
        }
        await markRead(selectedChat)
        socketRef.current?.emit('join_room', { otherUserId: selectedChat })
      } catch (error) {
        toast.error(error.message)
      }
    }
    run()
  }, [selectedChat, token])

  useEffect(() => {
    if (!selectedChat || !pendingScrollTargetId || !messagesContainerRef.current) return
    const container = messagesContainerRef.current
    const target = document.getElementById(`msg-${pendingScrollTargetId}`)
    if (!target) {
      // If target is not ready yet, prefer latest message instead of landing at top.
      setPendingScrollTargetId(null)
      setShouldScrollBottom(true)
      return
    }

    const top = Math.max(0, target.offsetTop - container.clientHeight * 0.25)
    container.scrollTo({ top, behavior: 'smooth' })
    setPendingScrollTargetId(null)
  }, [selectedChat, selectedChatMessages, pendingScrollTargetId])

  useEffect(() => {
    if (!selectedChat || !shouldScrollBottom || !messagesContainerRef.current) return
    const container = messagesContainerRef.current
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
    setShouldScrollBottom(false)
  }, [selectedChat, selectedChatMessages, shouldScrollBottom])

  const sendTextMessage = (text, replyTarget = null) => {
    if (!selectedChat || !text?.trim()) return
    if (conversationStatus.blocked) {
      toast.error('Messaging is disabled because this conversation is blocked.')
      return
    }
    socketRef.current?.emit('send_message', {
      receiverId: selectedChat,
      message: text.trim(),
      type: 'text',
      replyTo: replyTarget
        ? {
            id: replyTarget.id,
            text: getReplySnippet(replyTarget),
            type: replyTarget.type || 'text',
            senderId: replyTarget.senderId,
          }
        : undefined,
    })
  }

  const handleSendMessage = () => {
    if (!message.trim()) return
    sendTextMessage(message, replyingTo)
    setShouldScrollBottom(true)
    if (selectedChat) {
      socketRef.current?.emit('typing', { receiverId: selectedChat, isTyping: false })
    }
    setMessage('')
    setReplyingTo(null)
    setShowEmojiPicker(false)
  }

  const handleEmojiClick = (emoji) => setMessage((prev) => `${prev}${emoji}`)

  const handleSendValentineSpark = (text) => {
    if (!selectedChat || conversationStatus.blocked) return
    sendTextMessage(`__VAL_SPARK__ ${text}`)
  }

  const handleSendValentineMessage = () => {
    if (!currentUser?.id || !selectedChat || hasSentValentine) return
    sendTextMessage('__VALENTINE__ A little Valentine message just for you <3')
    const key = `valentine_once_${currentUser.id}_${selectedChat}`
    localStorage.setItem(key, '1')
    setHasSentValentine(true)
    toast.success('Valentine message sent!')
  }

  const handleImagePick = () => {
    if (conversationStatus.blocked) return toast.error('Messaging is blocked.')
    if (!selectedChat) return toast.error('Select a conversation first')
    fileInputRef.current?.click()
  }

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file || !selectedChat) return
    if (!file.type.startsWith('image/')) return toast.error('Please choose an image file')
    const reader = new FileReader()
    reader.onload = () => {
      setShouldScrollBottom(true)
      socketRef.current?.emit('send_message', {
        receiverId: selectedChat,
        message: String(reader.result),
        type: 'image',
        replyTo: replyingTo
          ? {
              id: replyingTo.id,
              text: getReplySnippet(replyingTo),
              type: replyingTo.type || 'text',
              senderId: replyingTo.senderId,
            }
          : undefined,
      })
      setReplyingTo(null)
    }
    reader.onerror = () => toast.error('Failed to read image')
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const handleToggleRecording = async () => {
    if (conversationStatus.blocked) return toast.error('Messaging is blocked.')
    if (!selectedChat) return toast.error('Select a conversation first')

    if (isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      audioChunksRef.current = []
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const reader = new FileReader()
        reader.onload = () => {
          setShouldScrollBottom(true)
          socketRef.current?.emit('send_message', {
            receiverId: selectedChat,
            message: String(reader.result),
            type: 'audio',
            replyTo: replyingTo
              ? {
                  id: replyingTo.id,
                  text: getReplySnippet(replyingTo),
                  type: replyingTo.type || 'text',
                  senderId: replyingTo.senderId,
                }
              : undefined,
          })
          setReplyingTo(null)
        }
        reader.onerror = () => toast.error('Failed to process voice note')
        reader.readAsDataURL(blob)
        stream.getTracks().forEach((t) => t.stop())
      }
      recorder.start()
      setIsRecording(true)
      toast.success('Recording started')
    } catch (error) {
      toast.error('Microphone permission denied or unavailable')
    }
  }

  const handleReport = async () => {
    if (!selectedChat) return
    try {
      const reportResponse = await fetch(`${apiBase}/api/reports`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          reportedUser: selectedChat,
          reportedContent: 'behavior',
          reason: 'harassment',
          description: 'Reported from chat conversation.',
        }),
      })
      const reportData = await reportResponse.json()
      if (!reportResponse.ok) return toast.error(reportData.error || 'Failed to report user')

      const blockResponse = await fetch(`${apiBase}/api/reports/block`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ userId: selectedChat }),
      })
      const blockData = await blockResponse.json()
      if (!blockResponse.ok) toast.error(blockData.error || 'User reported but block failed')
      else {
        setConversationStatus({ blocked: true, iBlocked: true, blockedMe: false })
        toast.success('User reported and blocked.')
      }
    } catch (error) {
      toast.error('Unable to report user right now')
    } finally {
      setShowReportConfirm(false)
      setShowActionsMenu(false)
    }
  }

  const handleBlock = async () => {
    if (!selectedChat) return
    try {
      const response = await fetch(`${apiBase}/api/reports/block`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ userId: selectedChat }),
      })
      const data = await response.json()
      if (!response.ok) return toast.error(data.error || 'Failed to block user')
      setConversationStatus({ blocked: true, iBlocked: true, blockedMe: false })
      toast.success('User blocked successfully.')
    } catch (error) {
      toast.error('Unable to block user right now')
    } finally {
      setShowActionsMenu(false)
    }
  }

  const handleUnblock = async () => {
    if (!selectedChat) return
    try {
      const response = await fetch(`${apiBase}/api/reports/unblock`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ userId: selectedChat }),
      })
      const data = await response.json()
      if (!response.ok) return toast.error(data.error || 'Failed to unblock user')
      setConversationStatus({ blocked: false, iBlocked: false, blockedMe: false })
      toast.success('User unblocked successfully.')
    } catch (error) {
      toast.error('Unable to unblock user right now')
    } finally {
      setShowActionsMenu(false)
    }
  }

  const handleOpenClearChat = () => {
    if (!selectedChat) return
    setShowClearChatConfirm(true)
    setShowActionsMenu(false)
  }

  const handleClearChat = async (scope) => {
    if (!selectedChat) return
    try {
      const response = await fetch(`${apiBase}/api/messages/${selectedChat}`, {
        method: 'DELETE',
        headers: authHeaders(),
        body: JSON.stringify({ scope }),
      })
      const data = await response.json()
      if (!response.ok) return toast.error(data.error || 'Failed to clear chat')

      setMessagesByChat((prev) => ({ ...prev, [selectedChat]: [] }))
      setChats((prev) =>
        prev.map((c) =>
          String(c.userId) === String(selectedChat)
            ? { ...c, lastMessage: '', lastMessageAt: null, unreadCount: 0 }
            : c
        )
      )
      await loadConversations()
      setSelectedChat(null)
      toast.success(scope === 'everyone' ? 'Chat cleared for everyone' : 'Chat cleared for you')
    } catch (error) {
      toast.error('Failed to clear chat')
    } finally {
      setShowClearChatConfirm(false)
    }
  }

  const iceBreakers = [
    "What's your favorite weekend activity?",
    'Coffee or tea?',
    "What's the best trip you've ever taken?",
    'What are you passionate about?',
  ]

  const handleInputChange = (value) => {
    setMessage(value)
    if (!selectedChat || conversationStatus.blocked) return
    if (!value) {
      socketRef.current?.emit('typing', { receiverId: selectedChat, isTyping: false })
      return
    }

    socketRef.current?.emit('typing', { receiverId: selectedChat, isTyping: true })

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit('typing', { receiverId: selectedChat, isTyping: false })
    }, 900)
  }

  if (!mounted) {
    return <div className="h-screen flex items-center justify-center bg-gray-50 p-6"><p className="text-gray-600">Loading chat...</p></div>
  }

  if (!token || !currentUser?.id) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-center max-w-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Login required for chat</h3>
          <p className="text-gray-600 mb-5">Go to login page to generate auth token and start real-time messaging.</p>
          <Link href="/auth/login" className="btn-primary">Go to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-white">
      <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-96 border-r border-gray-200`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Link href="/matches" className="flex items-center space-x-2">
              <Heart className="w-8 h-8 text-primary-500 fill-primary-500" />
              <span className="text-2xl font-display font-bold gradient-text">Messages</span>
            </Link>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search conversations..." className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all outline-none" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && <p className="p-4 text-sm text-gray-500">Loading conversations...</p>}
          {!loading && chats.length === 0 && <p className="p-4 text-sm text-gray-500">No conversations yet.</p>}
          {chats.map((chat) => (
            <button key={chat.userId} onClick={() => setSelectedChat(String(chat.userId))} className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${String(selectedChat) === String(chat.userId) ? 'bg-primary-50' : ''}`}>
              <div className="relative flex-shrink-0">
                {chat.avatarUrl ? <img src={chat.avatarUrl} alt={chat.name} className="w-14 h-14 rounded-full object-cover" /> : <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white text-xl font-bold">{chat.name?.[0] || '?'}</div>}
                {chat.online && <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>}
                {chat.verified && <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5"><Shield className="w-3 h-3 text-white" /></div>}
              </div>
              <div className="flex-1 text-left overflow-hidden">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                  <span className="text-xs text-gray-500">{formatChatTime(chat.lastMessageAt)}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{getMessagePreview(chat.lastMessage, chat.lastMessageType)}</p>
              </div>
              {chat.unreadCount > 0 && <div className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center font-bold">{chat.unreadCount}</div>}
            </button>
          ))}
        </div>
      </div>

      {selectedChat ? (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
            <div className="flex items-center space-x-3">
              <button onClick={() => setSelectedChat(null)} className="md:hidden mr-2"><ArrowLeft className="w-6 h-6 text-gray-700" /></button>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white text-lg font-bold">{selectedChatMeta?.name?.[0] || '?'}</div>
                {selectedChatMeta?.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{selectedChatMeta?.name}</h3>
                <p className="text-sm text-gray-600">
                  {typingStateByUser[selectedChat]
                    ? 'typing...'
                    : selectedChatMeta?.online
                      ? 'Online'
                      : 'Offline'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {valentineFeatureEnabled && (
                <button
                  type="button"
                  onClick={() => setIsValentineMode((prev) => !prev)}
                  className={`p-2 rounded-lg transition-colors ${isValentineMode ? 'bg-pink-100' : 'hover:bg-gray-100'}`}
                  title="Toggle Valentine Theme"
                >
                  <Heart className={`w-5 h-5 ${isValentineMode ? 'text-pink-600 fill-pink-600' : 'text-gray-600'}`} />
                </button>
              )}
              <button onClick={() => setShowReportConfirm(true)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Report User"><AlertCircle className="w-5 h-5 text-gray-600" /></button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setShowActionsMenu((prev) => !prev)}><MoreVertical className="w-5 h-5 text-gray-600" /></button>
              {showActionsMenu && (
                <div className="absolute right-4 top-16 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[190px]">
                  <button type="button" onClick={() => { setShowProfilePreview(true); setShowActionsMenu(false) }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">View Profile</button>
                  {!conversationStatus.iBlocked ? (
                    <button type="button" onClick={handleBlock} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Block User</button>
                  ) : (
                    <button type="button" onClick={handleUnblock} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Unblock User</button>
                  )}
                  <button type="button" onClick={handleOpenClearChat} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Clear Chat</button>
                </div>
              )}
            </div>
          </div>

          <div ref={messagesContainerRef} className={`flex-1 overflow-y-auto p-4 space-y-4 relative ${isValentineMode ? 'bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50' : 'bg-gray-50'}`}>
            {isValentineMode && (
              <div className="absolute inset-0 pointer-events-none opacity-40">
                <div className="absolute top-8 left-8 text-pink-300 text-xl">*</div>
                <div className="absolute top-20 right-16 text-rose-300 text-lg">*</div>
                <div className="absolute bottom-20 left-1/4 text-pink-200 text-2xl">*</div>
                <div className="absolute bottom-36 right-1/3 text-rose-200 text-xl">*</div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start space-x-2">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Stay Safe</p>
                <p>Never share personal information like phone numbers or addresses until you are comfortable.</p>
              </div>
            </div>

            {selectedChatMessages.length === 0 && (
              <div className="space-y-2">
                <p className="text-center text-sm text-gray-600 mb-3">Start the conversation with an ice-breaker:</p>
                {iceBreakers.map((iceBreaker, index) => (
                  <button key={index} onClick={() => setMessage(iceBreaker)} className="w-full text-left p-3 bg-white border-2 border-primary-200 rounded-xl hover:border-primary-400 hover:bg-primary-50 transition-all text-gray-700">{iceBreaker}</button>
                ))}
              </div>
            )}

            {selectedChatMessages.map((msg) => (
              <div id={`msg-${msg.id}`} key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                <div className="flex flex-col items-end gap-1">
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    msg.text?.startsWith('__VALENTINE__')
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg animate-pulse'
                      : msg.text?.startsWith('__VAL_SPARK__')
                        ? 'bg-gradient-to-r from-rose-100 to-pink-100 text-rose-900 border border-rose-200'
                        : msg.isMine
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                          : 'bg-white text-gray-900 shadow-sm'
                  }`}>
                    {msg.replyMeta?.text ? (
                      <div className={`mb-2 text-xs rounded-lg px-2 py-1 border ${
                        msg.isMine ? 'bg-white/20 border-white/30 text-white' : 'bg-gray-50 border-gray-200 text-gray-600'
                      }`}>
                        <span className="font-medium">{msg.replyMeta.senderId === currentUser?.id ? 'You' : selectedChatMeta?.name || 'User'}: </span>
                        <span>{msg.replyMeta.text}</span>
                      </div>
                    ) : null}
                    {msg.text?.startsWith('__VALENTINE__') ? (
                      <p className="text-sm font-semibold">{msg.text.replace('__VALENTINE__', '').trim()}</p>
                    ) : msg.text?.startsWith('__VAL_SPARK__') ? (
                      <p className="text-sm font-medium">{msg.text.replace('__VAL_SPARK__', '').trim()}</p>
                    ) : msg.type === 'image' ? (
                      <img src={msg.text} alt="Sent image" className="max-w-[220px] max-h-[220px] rounded-xl object-cover" />
                    ) : msg.type === 'audio' ? (
                      <audio controls className="max-w-[220px]" src={msg.text} />
                    ) : (
                      <p className="text-sm">{msg.text}</p>
                    )}
                    <p className={`text-xs mt-1 ${msg.isMine ? 'text-primary-100' : 'text-gray-500'}`}>
                      {formatChatTime(msg.createdAt)}
                      {msg.isMine ? (msg.isRead ? ' • Seen' : ' • Sent') : ''}
                    </p>
                  </div>
                  <button type="button" onClick={() => setReplyingTo(msg)} className="text-xs text-gray-500 hover:text-gray-700 inline-flex items-center gap-1">
                    <CornerUpLeft className="w-3.5 h-3.5" />
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200 bg-white">
            {replyingTo && (
              <div className="mb-3 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 flex items-start justify-between gap-3">
                <div className="text-xs text-gray-600">
                  <p className="font-medium text-gray-800">Replying to {replyingTo.senderId === currentUser?.id ? 'yourself' : (selectedChatMeta?.name || 'user')}</p>
                  <p className="truncate max-w-[280px]">{getReplySnippet(replyingTo)}</p>
                </div>
                <button type="button" onClick={() => setReplyingTo(null)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {valentineFeatureEnabled && isValentineMode && (
              <div className="mb-3 flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {valentineQuickNotes.map((note) => (
                    <button
                      key={note.label}
                      type="button"
                      onClick={() => handleSendValentineSpark(note.text)}
                      className="px-3 py-2 text-xs rounded-lg border border-pink-200 bg-pink-50 hover:bg-pink-100 text-rose-700 font-medium"
                      title={note.text}
                    >
                      {note.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const random = valentineQuickNotes[Math.floor(Math.random() * valentineQuickNotes.length)]
                      handleSendValentineSpark(random.text)
                    }}
                    className="px-3 py-2 text-xs rounded-lg border border-rose-300 bg-rose-100 hover:bg-rose-200 text-rose-700 font-semibold"
                  >
                    Surprise
                  </button>
                </div>
                {!hasSentValentine && (
                  <button type="button" onClick={handleSendValentineMessage} className="text-xs px-3 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700">
                    Send Valentine Note
                  </button>
                )}
              </div>
            )}

            {conversationStatus.blocked && (
              <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {conversationStatus.iBlocked ? 'You blocked this user. Unblock to send messages.' : 'You cannot message this user because they blocked you.'}
              </div>
            )}

            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={handleImagePick}><Image className="w-6 h-6 text-gray-600" /></button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setShowEmojiPicker((prev) => !prev)}><Smile className="w-6 h-6 text-gray-600" /></button>
              <button className={`p-2 rounded-lg transition-colors ${isRecording ? 'bg-red-100' : 'hover:bg-gray-100'}`} onClick={handleToggleRecording}>
                <Mic className={`w-6 h-6 ${isRecording ? 'text-red-600' : 'text-gray-600'}`} />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              <input
                type="text"
                value={message}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                disabled={conversationStatus.blocked}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all outline-none"
              />
              <button onClick={handleSendMessage} disabled={!message.trim() || conversationStatus.blocked} className="p-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <Send className="w-5 h-5" />
              </button>
            </div>

            {showEmojiPicker && (
              <div className="mt-3 p-2 border border-gray-200 rounded-xl bg-white flex flex-wrap gap-2">
                {emojis.map((emoji) => (
                  <button key={emoji} type="button" onClick={() => handleEmojiClick(emoji)} className="text-xl p-1 hover:bg-gray-100 rounded">{emoji}</button>
                ))}
              </div>
            )}

            <div className="flex items-center justify-center space-x-4 mt-3 text-xs text-gray-500">
              <button onClick={() => setShowReportConfirm(true)} className="hover:text-red-600 transition-colors">Report</button>
              <span>|</span>
              <button onClick={conversationStatus.iBlocked ? handleUnblock : handleBlock} className="hover:text-red-600 transition-colors">
                {conversationStatus.iBlocked ? 'Unblock' : 'Block'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h3>
            <p className="text-gray-600">Choose a chat from the sidebar to start messaging</p>
          </div>
        </div>
      )}

      {showReportConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-30 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Report this user?</h4>
            <p className="text-sm text-gray-600 mb-4">This will submit a moderation report and block this user for your account.</p>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowReportConfirm(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={handleReport} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">Yes, Report</button>
            </div>
          </div>
        </div>
      )}

      {showProfilePreview && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-30 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5">
            <div className="flex items-center gap-3 mb-4">
              {selectedChatMeta?.avatarUrl ? (
                <img src={selectedChatMeta.avatarUrl} alt={selectedChatMeta?.name || 'Profile'} className="w-14 h-14 rounded-full object-cover" />
              ) : (
                <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {selectedChatMeta?.name?.[0] || '?'}
                </div>
              )}
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{selectedChatMeta?.name || 'User'}</h4>
                <p className="text-sm text-gray-600">{selectedChatMeta?.online ? 'Online' : 'Offline'}</p>
              </div>
            </div>
            <div className="text-sm text-gray-700 space-y-1 mb-4">
              <p><span className="font-medium">Name:</span> {selectedChatMeta?.name || 'User'}</p>
              <p><span className="font-medium">Email verified:</span> {selectedChatMeta?.emailVerified ? 'Yes' : 'No'}</p>
              {selectedChatMeta?.bio ? <p><span className="font-medium">Bio:</span> {selectedChatMeta.bio}</p> : null}
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={() => setShowProfilePreview(false)} className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800">Close</button>
            </div>
          </div>
        </div>
      )}

      {showClearChatConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-30 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Clear chat</h4>
            <p className="text-sm text-gray-600 mb-4">Choose who should lose this conversation.</p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleClearChat('me')}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-left"
              >
                Clear for me
              </button>
              <button
                type="button"
                onClick={() => handleClearChat('everyone')}
                className="w-full px-4 py-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 text-left"
              >
                Clear for everyone
              </button>
            </div>
            <div className="flex justify-end mt-4">
              <button type="button" onClick={() => setShowClearChatConfirm(false)} className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

