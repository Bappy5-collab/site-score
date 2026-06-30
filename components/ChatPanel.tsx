'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { chatService, ChatMessage } from '@/services/chatService';

interface ChatPanelProps {
  /** Use 'general' when no scan is selected (chat available for all). */
  scanId: string | null;
  onClose?: () => void;
}

const getDefaultMessage = (isGeneral: boolean): ChatMessage => ({
  role: 'assistant',
  content: isGeneral
    ? "Hi! I'm your SiteScore AI assistant. Ask me about SEO, performance, or security — or run a scan to get advice for your website."
    : "Hi! I'm your SiteScore AI assistant. Ask me about improving your website SEO, performance, or security.",
  timestamp: new Date().toISOString(),
});

const defaultContents = [
  getDefaultMessage(true).content.trim(),
  getDefaultMessage(false).content.trim(),
];
const isDefaultMessage = (content: string): boolean =>
  defaultContents.some((d) => content.trim() === d);

const ChatPanel: React.FC<ChatPanelProps> = ({ scanId, onClose }) => {
  const effectiveScanId = scanId ?? 'general';
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [hasShownDefault, setHasShownDefault] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChat();
  }, [effectiveScanId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChat = async () => {
    try {
      setLoading(true);
      const chatData = await chatService.getChat(effectiveScanId);
      const defaultMsg = getDefaultMessage(effectiveScanId === 'general');

      if (chatData.messages && chatData.messages.length > 0) {
        const hasDefault = chatData.messages.some((msg) => isDefaultMessage(msg.content));
        if (!hasDefault && !hasShownDefault) {
          setMessages([defaultMsg, ...chatData.messages]);
          setHasShownDefault(true);
        } else {
          setMessages(chatData.messages);
          setHasShownDefault(true);
        }
      } else {
        if (!hasShownDefault) {
          setMessages([defaultMsg]);
          setHasShownDefault(true);
        }
      }
    } catch (error) {
      console.error('Error loading chat:', error);
      if (!hasShownDefault) {
        setMessages([getDefaultMessage(effectiveScanId === 'general')]);
        setHasShownDefault(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || sending || loading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: trimmedMessage,
      timestamp: new Date().toISOString(),
    };

    // Optimistically add user message
    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setSending(true);

    try {
      // Call backend API
      const updatedChat = await chatService.sendMessage(effectiveScanId, trimmedMessage);

      if (updatedChat.messages && updatedChat.messages.length > 0) {
        // Backend returns full history; use it as single source of truth to avoid duplicate user messages
        const filteredMessages = updatedChat.messages.filter((msg) => {
          if (hasShownDefault && isDefaultMessage(msg.content)) return false;
          return true;
        });
        // Normalize timestamps (backend may send Date or ISO string)
        const normalized = filteredMessages.map((msg) => ({
          ...msg,
          timestamp: typeof msg.timestamp === 'string' ? msg.timestamp : new Date(msg.timestamp).toISOString(),
        }));
        setMessages(normalized);
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      // On error, remove the optimistic user message
      setMessages((prev) => {
        const filtered = prev.filter((msg, idx) => {
          // Remove the last user message if it matches what we just sent
          if (idx === prev.length - 1 && msg.role === 'user' && msg.content === trimmedMessage) {
            return false;
          }
          return true;
        });
        return filtered;
      });
      setMessage(trimmedMessage); // Restore message on error
      
      // Show error message
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Paper
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-surface)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid var(--border)',
          background: 'rgba(252, 82, 63, 0.1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              background: '#E13E2C',
              width: 40,
              height: 40,
            }}
          >
            <SmartToyIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              AI Assistant
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              {effectiveScanId === 'general' ? 'Ask about SEO, performance, or security' : 'Ask me anything about your scan'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Messages Container */}
      <Box
        ref={chatContainerRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'var(--overlay-04)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(252, 82, 63, 0.3)',
            borderRadius: '4px',
            '&:hover': {
              background: 'rgba(252, 82, 63, 0.5)',
            },
          },
        }}
      >
        {loading && messages.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <CircularProgress sx={{ color: '#FC523F' }} />
          </Box>
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              {messages.map((msg, index) => (
                <motion.div
                  key={`${msg.timestamp}-${index}-${msg.content.substring(0, 20)}`}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: msg.role === 'user' ? -20 : 20 }}
                  transition={{ duration: 0.3, delay: index === messages.length - 1 ? 0.1 : 0 }}
                  layout
                >
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1.5,
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      alignItems: 'flex-start',
                    }}
                  >
                    {msg.role === 'assistant' && (
                      <Avatar
                        sx={{
                          background: '#E13E2C',
                          width: 32,
                          height: 32,
                          mt: 0.5,
                          boxShadow: 'none',
                        }}
                      >
                        <SmartToyIcon sx={{ fontSize: 18 }} />
                      </Avatar>
                    )}

                    <Box
                      sx={{
                        maxWidth: { xs: '85%', sm: '75%', md: '70%' },
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                      }}
                    >
                      <Box
                        component={motion.div}
                        whileHover={{ y: -2 }}
                        sx={{
                          p: 2,
                          borderRadius: '10px',
                          background:
                            msg.role === 'user'
                              ? 'linear-gradient(135deg, rgba(252, 82, 63, 0.2) 0%, rgba(252, 82, 63, 0.2) 100%)'
                              : 'var(--overlay-04)',
                          border:
                            msg.role === 'user'
                              ? '1px solid rgba(252, 82, 63, 0.3)'
                              : '1px solid var(--border)',
                          backdropFilter: 'blur(10px)',
                          boxShadow:
                            msg.role === 'user'
                              ? '0 4px 12px rgba(252, 82, 63, 0.2)'
                              : 'var(--shadow-md)',
                          position: 'relative',
                          '&::before':
                            msg.role === 'assistant'
                              ? {
                                  content: '""',
                                  position: 'absolute',
                                  left: -8,
                                  top: 12,
                                  width: 0,
                                  height: 0,
                                  borderTop: '8px solid transparent',
                                  borderBottom: '8px solid transparent',
                                  borderRight: '8px solid var(--overlay-04)',
                                }
                              : {
                                  content: '""',
                                  position: 'absolute',
                                  right: -8,
                                  top: 12,
                                  width: 0,
                                  height: 0,
                                  borderTop: '8px solid transparent',
                                  borderBottom: '8px solid transparent',
                                  borderLeft: '8px solid rgba(252, 82, 63, 0.2)',
                                },
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            color: 'var(--text-primary)',
                            fontSize: '0.875rem',
                            lineHeight: 1.6,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                          }}
                        >
                          {msg.content}
                        </Typography>
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'var(--text-muted)',
                          fontSize: '0.7rem',
                          px: 1,
                          alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        }}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Typography>
                    </Box>

                    {msg.role === 'user' && (
                      <Avatar
                        sx={{
                          background: 'linear-gradient(135deg, #06B6D4 0%, #FD7565 100%)',
                          width: 32,
                          height: 32,
                          mt: 0.5,
                          boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)',
                        }}
                      >
                        <PersonIcon sx={{ fontSize: 18 }} />
                      </Avatar>
                    )}
                  </Box>
                </motion.div>
              ))}
            </AnimatePresence>

            {sending && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1.5,
                    alignItems: 'flex-start',
                  }}
                >
                  <Avatar
                    sx={{
                      background: '#E13E2C',
                      width: 32,
                      height: 32,
                      mt: 0.5,
                    }}
                  >
                    <SmartToyIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '10px',
                      background: 'var(--overlay-04)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      gap: 1,
                      alignItems: 'center',
                    }}
                  >
                    <CircularProgress size={16} sx={{ color: '#FC523F' }} />
                    <Typography variant="body2" sx={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      Thinking...
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid var(--border)',
          background: 'var(--bg-base)',
        }}
      >
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{
            display: 'flex',
            gap: 1.5,
            alignItems: 'flex-end',
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder={effectiveScanId === 'general' ? 'Ask about SEO, performance, or security...' : 'Ask about your scan results...'}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending || loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'rgba(252, 82, 63, 0.3)',
                  background: 'var(--overlay-04)',
                },
                '&.Mui-focused': {
                  borderColor: '#FC523F',
                  boxShadow: '0 0 0 3px rgba(252, 82, 63, 0.1)',
                  background: 'var(--overlay-04)',
                },
                '& fieldset': {
                  border: 'none',
                },
              },
              '& .MuiInputBase-input': {
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                '&::placeholder': {
                  color: 'var(--text-muted)',
                  opacity: 1,
                },
              },
            }}
          />
          <IconButton
            component={motion.button}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!message.trim() || sending || loading}
            sx={{
              background: message.trim()
                ? '#FC523F'
                : 'var(--overlay-04)',
              color: message.trim() ? '#FFFFFF' : 'var(--text-muted)',
              width: 48,
              height: 48,
              border: '1px solid var(--border)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: message.trim()
                  ? 'linear-gradient(135deg, #E13E2C 0%, #E13E2C 100%)'
                  : 'var(--overlay-08)',
                boxShadow: message.trim() ? 'none' : 'none',
                transform: 'translateY(-2px)',
              },
              '&:disabled': {
                background: 'var(--overlay-04)',
                color: 'var(--text-muted)',
                cursor: 'not-allowed',
              },
            }}
          >
            {sending ? (
              <CircularProgress size={20} sx={{ color: '#FFFFFF' }} />
            ) : (
              <SendIcon />
            )}
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default ChatPanel;
