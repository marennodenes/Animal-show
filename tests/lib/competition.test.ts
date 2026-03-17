import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createClient } from '@/utils/supabase/client';
import {
  getAllCompetitions,
  getCompetitionById,
  getCompetitionByUser,
  createCompetition,
  participateCompetition,
  userInCompetition,
} from '@/lib/competition';

/**
 * @author noravsk
 * @author mahberg
 **/

// Mock Supabase client
vi.mock('@/utils/supabase/client');

const mockCompetition = {
  id: '1',
  name: 'Hundekonkurranse 2026',
  start_date: '2026-03-01',
  end_date: '2026-03-31',
  image_url: 'https://example.com/image.jpg',
  description: 'En spennende hundekonkurranse',
  species: 'dog',
};

describe('Competition', () => {
  let mockSupabase: any;

  // Helper function to create a chainable mock
  function createChainableMock() {
    const chain: any = {};
    chain.schema = vi.fn().mockReturnValue(chain);
    chain.from = vi.fn().mockReturnValue(chain);
    chain.select = vi.fn().mockReturnValue(chain);
    chain.order = vi.fn().mockReturnValue(chain);
    chain.eq = vi.fn().mockReturnValue(chain);
    chain.insert = vi.fn().mockReturnValue(chain);
    chain.maybeSingle = vi.fn().mockReturnValue(chain);
    chain.single = vi.fn().mockReturnValue(chain);
    return chain;
  }

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  describe('getAllCompetitions', () => {
    it('should return success with competitions data', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.order.mockResolvedValue({
        data: [mockCompetition],
        error: null,
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await getAllCompetitions();

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual([mockCompetition]);
      expect(mockSupabase.schema).toHaveBeenCalledWith('public');
      expect(mockSupabase.from).toHaveBeenCalledWith('Competition');
    });

    it('should return error when database fails', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      const errorMessage = 'Database connection failed';
      mockSupabase.order.mockResolvedValue({
        data: null,
        error: { message: errorMessage },
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await getAllCompetitions();

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe(errorMessage);
    });

    it('should order competitions by end_date ascending', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.order.mockResolvedValue({
        data: [mockCompetition],
        error: null,
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      await getAllCompetitions();

      // Assert
      expect(mockSupabase.order).toHaveBeenCalledWith('end_date', {
        ascending: true,
      });
    });
  });

  describe('getCompetitionById', () => {
    it('should return a single competition by id', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.single.mockResolvedValue({
        data: mockCompetition,
        error: null,
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await getCompetitionById('550e8400-e29b-41d4-a716-000000000001');

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCompetition);
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '550e8400-e29b-41d4-a716-000000000001');
    });

    it('should return error when competition not found', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      const errorMessage = 'Not found';
      mockSupabase.single.mockResolvedValue({
        data: null,
        error: { message: errorMessage },
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await getCompetitionById('550e8400-e29b-41d4-a716-446655440000');

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe(errorMessage);
    });
  });

  describe('getCompetitionByUser', () => {
    it('should return all competitions for a user', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      const userCompetitions = {
        UserID: 'user-123',
        CompID: '1',
        Competition: mockCompetition,
      };
      
      mockSupabase.eq.mockResolvedValue({
        data: [userCompetitions],
        error: null,
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await getCompetitionByUser('user-123');

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual([userCompetitions]);
      expect(mockSupabase.eq).toHaveBeenCalledWith('UserID', 'user-123');
    });

    it('should return error on database failure', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      const errorMessage = 'Query failed';
      mockSupabase.eq.mockResolvedValue({
        data: null,
        error: { message: errorMessage },
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await getCompetitionByUser('user-123');

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe(errorMessage);
    });
  });

  describe('createCompetition', () => {
    it('should create a new competition', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.insert.mockResolvedValue({
        data: [mockCompetition],
        error: null,
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      const newCompetition = {
        name: 'Ny konkurranse',
        start_date: '2026-04-01',
        end_date: '2026-04-30',
        description: 'Beskrivelse',
        species: 'dog',
        image_url: null,
      };

      // Act
      const result = await createCompetition(newCompetition);

      // Assert
      expect(result.success).toBe(true);
      expect(mockSupabase.insert).toHaveBeenCalledWith([newCompetition]);
    });

    it('should return error when creation fails', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      const errorMessage = 'Insert failed';
      mockSupabase.insert.mockResolvedValue({
        data: null,
        error: { message: errorMessage },
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await createCompetition({
        name: 'Test',
        start_date: '2026-04-01',
        end_date: '2026-04-30',
        description: 'Test',
        image_url: null,
      });

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe(errorMessage);
    });
  });

  describe('userInCompetition', () => {
    it('should return true when user is in competition', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.maybeSingle.mockResolvedValue({
        data: { UserID: 'user-123', CompID: '1' },
        error: null,
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await userInCompetition('user-123', '1');

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when user is not in competition', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.maybeSingle.mockResolvedValue({
        data: null,
        error: null,
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await userInCompetition('user-123', '999');

      // Assert
      expect(result).toBe(false);
    });

    it('should return false on database error', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.maybeSingle.mockResolvedValue({
        data: null,
        error: { message: 'Query error' },
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await userInCompetition('user-123', '1');

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('participateCompetition', () => {
    it('should add user to competition', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      mockSupabase.insert.mockResolvedValue({
        data: [{ UserID: 'user-123', CompID: '1' }],
        error: null,
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await participateCompetition({
        userID: 'user-123',
        competitionID: '1',
      });

      // Assert
      expect(result.success).toBe(true);
      expect(mockSupabase.insert).toHaveBeenCalledWith([
        { UserID: 'user-123', CompID: '1' },
      ]);
    });

    it('should return error when participation fails', async () => {
      // Arrange
      mockSupabase = createChainableMock();
      const errorMessage = 'Duplicate entry';
      mockSupabase.insert.mockResolvedValue({
        data: null,
        error: { message: errorMessage },
      });
      vi.mocked(createClient).mockReturnValue(mockSupabase);

      // Act
      const result = await participateCompetition({
        userID: 'user-123',
        competitionID: '1',
      });

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe(errorMessage);
    });
  });
});


