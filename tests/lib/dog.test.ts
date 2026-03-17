import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createClient } from '@/utils/supabase/client';
import {
  getUserAnimals,
  getUserDogs,
  getUserCats,
  addAnimal,
  deleteAnimal,
} from '@/lib/dog';

/**
 * @author noravsk
 * @author mahberg
 **/

// Mock Supabase client
vi.mock('@/utils/supabase/client');

const mockAnimal = {
  id: '1',
  user_id: 'user-123',
  name: 'Max',
  species: 'dog',
  breed: 'Golden Retriever',
  birth_date: '2020-01-01',
  image_url: null,
};

describe('Dog', () => {
  let mockSupabase: any;

  // Helper function to create a chainable mock
  function createChainableMock() {
    const chain: any = {};
    chain.from = vi.fn().mockReturnValue(chain);
    chain.select = vi.fn().mockReturnValue(chain);
    chain.eq = vi.fn().mockReturnValue(chain);
    chain.order = vi.fn().mockReturnValue(chain);
    chain.insert = vi.fn().mockReturnValue(chain);
    chain.delete = vi.fn().mockReturnValue(chain);
    chain.single = vi.fn().mockReturnValue(chain);
    return chain;
  }

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  describe('getUserAnimals', () => {
    it('should return all animals for a user', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.order.mockResolvedValue({
        data: [mockAnimal],
        error: null,
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await getUserAnimals('user-123');

      // Assert
      expect(result).toEqual([mockAnimal]);
      expect(mockSupabase.from).toHaveBeenCalledWith('Animal');
      expect(mockSupabase.eq).toHaveBeenCalledWith('user_id', 'user-123');
    });

    it('should return empty array on error', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.order.mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await getUserAnimals('user-123');

      // Assert
      expect(result).toEqual([]);
    });

    it('should order animals by created_at descending', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.order.mockResolvedValue({
        data: [mockAnimal],
        error: null,
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      await getUserAnimals('user-123');

      // Assert
      expect(mockSupabase.order).toHaveBeenCalledWith('created_at', {
        ascending: false,
      });
    });
  });

  describe('getUserDogs', () => {
    it('should return only dogs for a user', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.order.mockResolvedValue({
        data: [mockAnimal],
        error: null,
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await getUserDogs('user-123');

      // Assert
      expect(result).toEqual([mockAnimal]);
      expect(mockSupabase.eq).toHaveBeenCalledWith('species', 'dog');
    });

    it('should return empty array when no dogs found', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.order.mockResolvedValue({
        data: null,
        error: null,
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await getUserDogs('user-123');

      // Assert
      expect(result).toEqual([]);
    });

    it('should return empty array on error', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.order.mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await getUserDogs('user-123');

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('getUserCats', () => {
    it('should return only cats for a user', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      const mockCat = { ...mockAnimal, species: 'cat' };
      mockSupabase.order.mockResolvedValue({
        data: [mockCat],
        error: null,
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await getUserCats('user-123');

      // Assert
      expect(result).toEqual([mockCat]);
      expect(mockSupabase.eq).toHaveBeenCalledWith('species', 'cat');
    });

    it('should return empty array when no cats found', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.order.mockResolvedValue({
        data: null,
        error: null,
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await getUserCats('user-123');

      // Assert
      expect(result).toEqual([]);
    });

    it('should return empty array on error', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.order.mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await getUserCats('user-123');

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('addAnimal', () => {
    it('should add a new animal', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.single.mockResolvedValue({
        data: mockAnimal,
        error: null,
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      const newAnimal = {
        user_id: 'user-123',
        name: 'Max',
        species: 'dog',
        breed: 'Golden Retriever',
        birth_date: '2020-01-01',
        image_url: null,
      };

      // Act
      const result = await addAnimal(newAnimal);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockAnimal);
      expect(mockSupabase.insert).toHaveBeenCalledWith([newAnimal]);
    });

    it('should return error when insert fails', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      const errorMessage = 'Insert failed';
      mockSupabase.single.mockResolvedValue({
        data: null,
        error: { message: errorMessage },
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await addAnimal({
        user_id: 'user-123',
        name: 'Max',
        species: 'dog',
        breed: 'Golden Retriever',
        birth_date: '2020-01-01',
        image_url: null,
      });

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe(errorMessage);
    });
  });

  describe('deleteAnimal', () => {
    it('should delete an animal', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.eq.mockResolvedValue({
        error: null,
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await deleteAnimal('1');

      // Assert
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
    });

    it('should handle error when delete fails', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.eq.mockResolvedValue({
        error: { message: 'Delete failed' },
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await deleteAnimal('1');

      // Assert
      expect(result.error).toBeDefined();
    });
  });
});
