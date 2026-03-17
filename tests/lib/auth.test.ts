import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createClient } from '@/utils/supabase/client';
import { login, register, isLoggedIn, getCurrentUser } from '@/lib/auth';
import User from '@/lib/models/User';

/**
 * @author noravsk
 * @author bragesbr
 **/

// Mock Supabase client and sessionStorage
vi.mock('@/utils/supabase/client');
global.sessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

const mockAuthUser = {
  id: 'user-uuid-123',
  email: 'test@example.com',
};

const mockPublicUser = {
  id: 'user-uuid-123',
  name: 'Test User',
  created_at: '2026-01-01',
  is_admin: false,
  bio: 'Test bio',
  image_url: 'https://example.com/image.jpg',
};

describe('Auth', () => {
  let mockSupabase: any;

  // Helper function to create a chainable mock
  function createChainableMock() {
    const chain: any = {};
    chain.schema = vi.fn().mockReturnValue(chain);
    chain.from = vi.fn().mockReturnValue(chain);
    chain.select = vi.fn().mockReturnValue(chain);
    chain.eq = vi.fn().mockReturnValue(chain);
    chain.insert = vi.fn().mockReturnValue(chain);
    chain.single = vi.fn().mockReturnValue(chain);
    return chain;
  }

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should login user successfully and return user object', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.auth = {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { user: mockAuthUser },
          error: null,
        }),
      };
      mockSupabase.single.mockResolvedValue({
        data: mockPublicUser,
        error: null,
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await login({ email: 'test@example.com', password: 'password123' });

      // Assert
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe('test@example.com');
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should return error when authentication fails', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.auth = {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { user: null },
          error: { message: 'Invalid credentials' },
        }),
      };
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await login({ email: 'test@example.com', password: 'wrongpassword' });

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });

    it('should return error when fetching user from database fails', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.auth = {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { user: mockAuthUser },
          error: null,
        }),
      };
      mockSupabase.single.mockResolvedValue({
        data: null,
        error: { message: 'User not found' },
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await login({ email: 'test@example.com', password: 'password123' });

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe("Fetching the user from the database wen't wrong");
    });
  });

  describe('register', () => {
    it('should register user successfully', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.auth = {
        signUp: vi.fn().mockResolvedValue({
          data: { user: mockAuthUser },
          error: null,
        }),
      };
      mockSupabase.insert.mockResolvedValue({
        error: null,
      });
      mockSupabase.single.mockResolvedValue({
        data: mockPublicUser,
        error: null,
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await register({ email: 'newuser@example.com', password: 'password123' });

      // Assert
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe('test@example.com');
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        password: 'password123',
      });
    });

    it('should return error when signup fails', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.auth = {
        signUp: vi.fn().mockResolvedValue({
          data: { user: null },
          error: { message: 'Email already in use' },
        }),
      };
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await register({ email: 'existing@example.com', password: 'password123' });

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Email already in use');
    });

    it('should return error when database insert fails', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.auth = {
        signUp: vi.fn().mockResolvedValue({
          data: { user: mockAuthUser },
          error: null,
        }),
      };
      mockSupabase.insert.mockResolvedValue({
        error: { message: 'Insert failed' },
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await register({ email: 'newuser@example.com', password: 'password123' });

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Database insert failed');
    });

    it('should return error when fetching user from database fails', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.auth = {
        signUp: vi.fn().mockResolvedValue({
          data: { user: mockAuthUser },
          error: null,
        }),
      };
      mockSupabase.insert.mockResolvedValue({
        error: null,
      });
      mockSupabase.single.mockResolvedValue({
        data: null,
        error: { message: 'User not found' },
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await register({ email: 'newuser@example.com', password: 'password123' });

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe("Fetching the user from the database wen't wrong");
    });
  });

  describe('isLoggedIn', () => {
    it('should return true when user is logged in', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.auth = {
        getUser: vi.fn().mockResolvedValue({
          data: { user: mockAuthUser },
        }),
      };
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await isLoggedIn();

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when user is not logged in', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.auth = {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
        }),
      };
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await isLoggedIn();

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user object', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.auth = {
        getUser: vi.fn().mockResolvedValue({
          data: { user: mockAuthUser },
        }),
      };
      mockSupabase.single.mockResolvedValue({
        data: mockPublicUser,
        error: null,
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await getCurrentUser();

      // Assert
      expect(result).toBeDefined();
      expect(result?.email).toBe('test@example.com');
      expect(result?.name).toBe('Test User');
    });

    it('should return null when no user is logged in', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.auth = {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
        }),
      };
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await getCurrentUser();

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when database fetch fails', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.auth = {
        getUser: vi.fn().mockResolvedValue({
          data: { user: mockAuthUser },
        }),
      };
      mockSupabase.single.mockResolvedValue({
        data: null,
        error: { message: 'User not found' },
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await getCurrentUser();

      // Assert
      expect(result).toBeNull();
    });
  });
});
