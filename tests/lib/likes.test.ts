import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createClient } from '@/utils/supabase/client';
import {
  getLikes,
  hasLiked,
  likeAnimal,
  unlikeAnimal,
} from '@/lib/likes';

/**
 * @author noravsk
 * @author bragesbr
 **/

// Mock Supabase client
vi.mock('@/utils/supabase/client');

describe('Likes', () => {
  let mockSupabase: any;

  // Helper function to create a chainable mock
  function createChainableMock() {
    const chain: any = {};
    chain.from = vi.fn().mockReturnValue(chain);
    chain.select = vi.fn().mockReturnValue(chain);
    chain.eq = vi.fn().mockReturnValue(chain);
    chain.insert = vi.fn().mockReturnValue(chain);
    chain.delete = vi.fn().mockReturnValue(chain);
    chain.single = vi.fn().mockReturnValue(chain);
    return chain;
  }

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  describe('getLikes', () => {
    it('should return the count of likes for an animal in a competition', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.select.mockReturnValue(mockSupabase);
      // First .eq() returns chain, second .eq() resolves with count
      mockSupabase.eq
        .mockReturnValueOnce(mockSupabase)
        .mockResolvedValueOnce({
          count: 5,
          error: null,
        });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await getLikes('animal-1', 'competition-1');

      // Assert
      expect(result).toBe(5);
      expect(mockSupabase.from).toHaveBeenCalledWith('likes');
      expect(mockSupabase.eq).toHaveBeenCalledWith('animal_id', 'animal-1');
    });

    it('should return 0 when no likes found', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.select.mockReturnValue(mockSupabase);
      // First .eq() returns chain, second .eq() resolves with count
      mockSupabase.eq
        .mockReturnValueOnce(mockSupabase)
        .mockResolvedValueOnce({
          count: 0,
          error: null,
        });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await getLikes('animal-1', 'competition-1');

      // Assert
      expect(result).toBe(0);
    });

    it('should return 0 on error', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.select.mockReturnValue(mockSupabase);
      // First .eq() returns chain, second .eq() resolves with error
      mockSupabase.eq
        .mockReturnValueOnce(mockSupabase)
        .mockResolvedValueOnce({
          count: null,
          error: { message: 'Database error' },
        });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await getLikes('animal-1', 'competition-1');

      // Assert
      expect(result).toBe(0);
    });
  });

  describe('hasLiked', () => {
    it('should return true when user has liked the animal', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.eq.mockReturnValue(mockSupabase);
      mockSupabase.single.mockResolvedValue({
        data: { user_id: 'user-1' },
        error: null,
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await hasLiked('user-1', 'animal-1', 'competition-1');

      // Assert
      expect(result).toBe(true);
      expect(mockSupabase.eq).toHaveBeenCalledWith('user_id', 'user-1');
      expect(mockSupabase.eq).toHaveBeenCalledWith('animal_id', 'animal-1');
    });

    it('should return false when user has not liked the animal', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.eq.mockReturnValue(mockSupabase);
      mockSupabase.single.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116' }, // no rows found
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await hasLiked('user-1', 'animal-1', 'competition-1');

      // Assert
      expect(result).toBe(false);
    });

    it('should throw on database error (not PGRST116)', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.eq.mockReturnValue(mockSupabase);
      mockSupabase.single.mockResolvedValue({
        data: null,
        error: { code: 'PGRST999', message: 'Database error' },
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act & Assert
      expect(async () => {
        await hasLiked('user-1', 'animal-1', 'competition-1');
      }).rejects.toThrow();
    });
  });

  describe('likeAnimal', () => {
    it('should like an animal in a competition', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.insert.mockResolvedValue({
        error: null,
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await likeAnimal('user-1', 'animal-1', 'competition-1');

      // Assert
      expect(result).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('likes');
      expect(mockSupabase.insert).toHaveBeenCalledWith([
        { user_id: 'user-1', animal_id: 'animal-1', competition_id: 'competition-1' },
      ]);
    });

    it('should throw when insert fails', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.insert.mockResolvedValue({
        error: { message: 'Insert failed' },
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act & Assert
      expect(async () => {
        await likeAnimal('user-1', 'animal-1', 'competition-1');
      }).rejects.toThrow();
    });
  });

  describe('unlikeAnimal', () => {
    it('should unlike an animal in a competition', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.delete.mockReturnValue(mockSupabase);
      // First two .eq() calls return chain, third .eq() resolves
      mockSupabase.eq
        .mockReturnValueOnce(mockSupabase)
        .mockReturnValueOnce(mockSupabase)
        .mockResolvedValueOnce({
          error: null,
        });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await unlikeAnimal('user-1', 'animal-1', 'competition-1');

      // Assert
      expect(result).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('likes');
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('user_id', 'user-1');
    });

    it('should throw when delete fails', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.delete.mockReturnValue(mockSupabase);
      // First two .eq() calls return chain, third .eq() resolves with error
      mockSupabase.eq
        .mockReturnValueOnce(mockSupabase)
        .mockReturnValueOnce(mockSupabase)
        .mockResolvedValueOnce({
          error: { message: 'Delete failed' },
        });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act & Assert
      expect(async () => {
        await unlikeAnimal('user-1', 'animal-1', 'competition-1');
      }).rejects.toThrow();
    });
  });
});
