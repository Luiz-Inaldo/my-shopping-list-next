import {
  generateToken,
  hashToken,
  createAgentToken,
  countActiveTokens,
  validateAgentToken,
  revokeAgentToken,
} from '@/lib/agentTokens';
import { adminDb } from '@/lib/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';

// Mock Firebase Admin
jest.mock('@/lib/firebaseAdmin', () => ({
  adminDb: {
    collection: jest.fn(),
  },
}));

describe('Agent Tokens', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    it('deve gerar um token de 64 caracteres hexadecimais', () => {
      const token = generateToken();
      expect(token).toHaveLength(64);
      expect(token).toMatch(/^[0-9a-f]+$/);
    });

    it('deve gerar tokens diferentes a cada chamada', () => {
      const token1 = generateToken();
      const token2 = generateToken();
      expect(token1).not.toBe(token2);
    });
  });

  describe('hashToken', () => {
    it('deve gerar hash SHA-256 consistente', () => {
      const token = 'test-token-123';
      const hash1 = hashToken(token);
      const hash2 = hashToken(token);
      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64);
    });

    it('deve gerar hashes diferentes para tokens diferentes', () => {
      const hash1 = hashToken('token1');
      const hash2 = hashToken('token2');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('countActiveTokens', () => {
    it('deve contar apenas tokens não expirados e não revogados', async () => {
      const now = Timestamp.now();
      const future = Timestamp.fromMillis(now.toMillis() + 24 * 60 * 60 * 1000);
      const past = Timestamp.fromMillis(now.toMillis() - 24 * 60 * 60 * 1000);

      const mockDocs = [
        { data: () => ({ expires_at: future, revoked: false }) }, // válido
        { data: () => ({ expires_at: past, revoked: false }) },   // expirado
        { data: () => ({ expires_at: future, revoked: true }) },  // revogado
      ];

      const mockSnapshot = {
        docs: mockDocs,
      };

      const mockGet = jest.fn().mockResolvedValue(mockSnapshot);
      const mockWhere = jest.fn().mockReturnThis();
      const mockCollection = jest.fn().mockReturnValue({
        where: mockWhere,
        get: mockGet,
      });

      (adminDb.collection as jest.Mock) = mockCollection;

      const count = await countActiveTokens('user123');
      expect(count).toBe(1);
      expect(mockCollection).toHaveBeenCalledWith('agent_tokens');
      expect(mockWhere).toHaveBeenCalledWith('uid', '==', 'user123');
      expect(mockWhere).toHaveBeenCalledWith('revoked', '==', false);
    });
  });

  describe('createAgentToken', () => {
    it('deve rejeitar quando usuário atingiu limite de tokens', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        docs: [
          { data: () => ({ expires_at: Timestamp.fromMillis(Date.now() + 1000000), revoked: false }) },
          { data: () => ({ expires_at: Timestamp.fromMillis(Date.now() + 1000000), revoked: false }) },
          { data: () => ({ expires_at: Timestamp.fromMillis(Date.now() + 1000000), revoked: false }) },
        ],
      });

      const mockWhere = jest.fn().mockReturnThis();
      const mockCollection = jest.fn().mockReturnValue({
        where: mockWhere,
        get: mockGet,
      });

      (adminDb.collection as jest.Mock) = mockCollection;

      await expect(createAgentToken('user123', 'Test Token')).rejects.toThrow(
        'Limite de 3 tokens ativos atingido'
      );
    });
  });

  describe('validateAgentToken', () => {
    it('deve retornar null para token inexistente', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        exists: false,
      });

      const mockDoc = jest.fn().mockReturnValue({
        get: mockGet,
      });

      const mockCollection = jest.fn().mockReturnValue({
        doc: mockDoc,
      });

      (adminDb.collection as jest.Mock) = mockCollection;

      const uid = await validateAgentToken('invalid-token');
      expect(uid).toBeNull();
    });

    it('deve retornar null para token revogado', async () => {
      const mockData = {
        uid: 'user123',
        revoked: true,
        expires_at: Timestamp.fromMillis(Date.now() + 1000000),
      };

      const mockGet = jest.fn().mockResolvedValue({
        exists: true,
        data: () => mockData,
      });

      const mockDoc = jest.fn().mockReturnValue({
        get: mockGet,
      });

      const mockCollection = jest.fn().mockReturnValue({
        doc: mockDoc,
      });

      (adminDb.collection as jest.Mock) = mockCollection;

      const uid = await validateAgentToken('revoked-token');
      expect(uid).toBeNull();
    });

    it('deve retornar null para token expirado', async () => {
      const mockData = {
        uid: 'user123',
        revoked: false,
        expires_at: Timestamp.fromMillis(Date.now() - 1000),
      };

      const mockGet = jest.fn().mockResolvedValue({
        exists: true,
        data: () => mockData,
      });

      const mockDoc = jest.fn().mockReturnValue({
        get: mockGet,
      });

      const mockCollection = jest.fn().mockReturnValue({
        doc: mockDoc,
      });

      (adminDb.collection as jest.Mock) = mockCollection;

      const uid = await validateAgentToken('expired-token');
      expect(uid).toBeNull();
    });

    it('deve retornar uid para token válido', async () => {
      const mockData = {
        uid: 'user123',
        revoked: false,
        expires_at: Timestamp.fromMillis(Date.now() + 1000000),
      };

      const mockUpdate = jest.fn().mockResolvedValue({});
      const mockGet = jest.fn().mockResolvedValue({
        exists: true,
        data: () => mockData,
      });

      const mockDocRef = {
        get: mockGet,
        update: mockUpdate,
      };

      const mockDoc = jest.fn().mockReturnValue(mockDocRef);

      const mockCollection = jest.fn().mockReturnValue({
        doc: mockDoc,
      });

      (adminDb.collection as jest.Mock) = mockCollection;

      const uid = await validateAgentToken('valid-token');
      expect(uid).toBe('user123');
    });
  });

  describe('revokeAgentToken', () => {
    it('deve rejeitar token inexistente', async () => {
      const mockGet = jest.fn().mockResolvedValue({
        exists: false,
      });

      const mockDoc = jest.fn().mockReturnValue({
        get: mockGet,
      });

      const mockCollection = jest.fn().mockReturnValue({
        doc: mockDoc,
      });

      (adminDb.collection as jest.Mock) = mockCollection;

      await expect(revokeAgentToken('user123', 'token-hash')).rejects.toThrow(
        'Token não encontrado'
      );
    });

    it('deve rejeitar token que não pertence ao usuário', async () => {
      const mockData = {
        uid: 'user456',
      };

      const mockGet = jest.fn().mockResolvedValue({
        exists: true,
        data: () => mockData,
      });

      const mockDoc = jest.fn().mockReturnValue({
        get: mockGet,
      });

      const mockCollection = jest.fn().mockReturnValue({
        doc: mockDoc,
      });

      (adminDb.collection as jest.Mock) = mockCollection;

      await expect(revokeAgentToken('user123', 'token-hash')).rejects.toThrow(
        'Token não pertence ao usuário'
      );
    });
  });
});
