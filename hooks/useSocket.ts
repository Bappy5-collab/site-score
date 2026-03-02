import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export const useSocket = (teamId: string | null) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!teamId) return;

    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    const socket = socketRef.current;

    // Join team room
    socket.emit('join-team', teamId);

    // Cleanup on unmount
    return () => {
      socket.emit('leave-team', teamId);
      socket.disconnect();
    };
  }, [teamId]);

  return socketRef.current;
};
