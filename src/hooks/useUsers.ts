import { useState, useEffect } from 'react';
import { getUsers, createUser as apiCreateUser, updateUser as apiUpdateUser, deleteUser as apiDeleteUser, type User as APIUser } from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'author' | 'contributor';
  status: 'active' | 'inactive' | 'suspended';
  avatar?: string;
  phone?: string;
  articlesCount: number;
  joinedDate: string;
  lastActive: string;
  totalRoyalty?: number;
  paidRoyalty?: number;
  pendingRoyalty?: number;
  royaltyConfig?: string;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getUsers();
      
      // Convert API users to component format
      const formattedUsers: User[] = data.map((user: APIUser) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: (user.role.toLowerCase() as 'admin' | 'editor' | 'author' | 'contributor') || 'author',
        status: 'active' as const,
        avatar: user.avatar,
        articlesCount: 0,
        joinedDate: '2024-01-01',
        lastActive: new Date().toISOString(),
      }));
      
      setUsers(formattedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: Omit<User, 'id'>) => {
    try {
      const result = await apiCreateUser({
        name: userData.name,
        email: userData.email,
        role: userData.role,
        department: userData.phone,
        avatar: userData.avatar,
      });
      
      await fetchUsers(); // Refresh list
      return result;
    } catch (err) {
      console.error('Error creating user:', err);
      throw err;
    }
  };

  const updateUser = async (id: number, userData: Partial<User>) => {
    try {
      const result = await apiUpdateUser(id, {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        avatar: userData.avatar,
      });
      
      await fetchUsers(); // Refresh list
      return result;
    } catch (err) {
      console.error('Error updating user:', err);
      throw err;
    }
  };

  const deleteUser = async (id: number) => {
    try {
      const success = await apiDeleteUser(id);
      
      if (success) {
        await fetchUsers(); // Refresh list
        return true;
      }
      throw new Error('Failed to delete user');
    } catch (err) {
      console.error('Error deleting user:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}
