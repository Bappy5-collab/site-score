import api from './api';

export interface TeamMember {
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  role: 'admin' | 'member';
  joinedAt: string;
}

export interface Team {
  _id: string;
  name: string;
  ownerId: string;
  members: TeamMember[];
  invites: Array<{
    email: string;
    token: string;
    invitedBy: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export const teamService = {
  createTeam: async (name: string): Promise<Team> => {
    const response = await api.post('/team', { name });
    return response.data;
  },

  getTeam: async (): Promise<Team | null> => {
    const response = await api.get('/team');
    return response.data;
  },

  inviteMember: async (email: string): Promise<{ message: string; token: string; emailSent?: boolean; warning?: string }> => {
    const response = await api.post('/team/invite', { email });
    return response.data;
  },

  acceptInvite: async (token: string): Promise<Team> => {
    const response = await api.post('/team/accept-invite', { token });
    return response.data;
  },
};
