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
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(139, 92, 246, 0.1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
              width: 40,
              height: 40,
            }}
          >
            <SmartToyIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#F1F5F9' }}>
              AI Assistant
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.75rem' }}>
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
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(139, 92, 246, 0.3)',
            borderRadius: '4px',
            '&:hover': {
              background: 'rgba(139, 92, 246, 0.5)',
            },
          },
        }}
      >
        {loading && messages.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <CircularProgress sx={{ color: '#8B5CF6' }} />
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
                          background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                          width: 32,
                          height: 32,
                          mt: 0.5,
                          boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
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
                        whileHover={{ scale: 1.02 }}
                        sx={{
                          p: 2,
                          borderRadius: '16px',
                          background:
                            msg.role === 'user'
                              ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)'
                              : 'rgba(255, 255, 255, 0.05)',
                          border:
                            msg.role === 'user'
                              ? '1px solid rgba(139, 92, 246, 0.3)'
                              : '1px solid rgba(255, 255, 255, 0.08)',
                          backdropFilter: 'blur(10px)',
                          boxShadow:
                            msg.role === 'user'
                              ? '0 4px 12px rgba(139, 92, 246, 0.2)'
                              : '0 2px 8px rgba(0, 0, 0, 0.1)',
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
                                  borderRight: '8px solid rgba(255, 255, 255, 0.05)',
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
                                  borderLeft: '8px solid rgba(139, 92, 246, 0.2)',
                                },
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            color: '#F1F5F9',
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
                          color: '#94A3B8',
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
                          background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
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
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
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
                      borderRadius: '16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      gap: 1,
                      alignItems: 'center',
                    }}
                  >
                    <CircularProgress size={16} sx={{ color: '#8B5CF6' }} />
                    <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.75rem' }}>
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
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(15, 23, 42, 0.5)',
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
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                color: '#F1F5F9',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'rgba(139, 92, 246, 0.3)',
                  background: 'rgba(255, 255, 255, 0.05)',
                },
                '&.Mui-focused': {
                  borderColor: '#8B5CF6',
                  boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                },
                '& fieldset': {
                  border: 'none',
                },
              },
              '& .MuiInputBase-input': {
                color: '#F1F5F9',
                fontSize: '0.875rem',
                '&::placeholder': {
                  color: '#94A3B8',
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
                ? 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)'
                : 'rgba(255, 255, 255, 0.05)',
              color: message.trim() ? '#FFFFFF' : '#94A3B8',
              width: 48,
              height: 48,
              border: '1px solid rgba(255, 255, 255, 0.08)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: message.trim()
                  ? 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)'
                  : 'rgba(255, 255, 255, 0.08)',
                boxShadow: message.trim() ? '0 4px 20px rgba(139, 92, 246, 0.4)' : 'none',
                transform: 'translateY(-2px)',
              },
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#94A3B8',
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
