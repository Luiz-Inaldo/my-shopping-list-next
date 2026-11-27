import {
  checkPurchaseAccess,
  updatePurchase,
  deleteHistoryPurchase,
  sharePurchaseWithUsers,
  unsharePurchase,
} from '@/lib/mcpHelpers';
import { adminDb } from '@/lib/firebaseAdmin';
import type { IPurchaseProps } from '@/types';

// Mock Firebase Admin
jest.mock('@/lib/firebaseAdmin', () => ({
  adminDb: {
    collection: jest.fn(),
  },
}));

describe('MCP Helpers - Ownership Checks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkPurchaseAccess', () => {
    it('deve identificar owner corretamente', async () => {
      const mockPurchase: Omit<IPurchaseProps, 'id'> = {
        title: 'Test List',
        user_id: 'owner123',
        shared_with: [],
        is_active: true,
        max_value: 100,
        total_price: 0,
        start_date: null,
        end_date: null,
        purchase_items: [],
      };

      const mockGet = jest.fn().mockResolvedValue({
        exists: true,
        id: 'purchase123',
        data: () => mockPurchase,
      });

      const mockDoc = jest.fn().mockReturnValue({
        get: mockGet,
      });

      const mockCollection = jest.fn().mockReturnValue({
        doc: mockDoc,
      });

      (adminDb.collection as jest.Mock) = mockCollection;

      const result = await checkPurchaseAccess('purchase123', 'owner123');
      expect(result.isOwner).toBe(true);
      expect(result.hasAccess).toBe(true);
      expect(result.purchase).toBeTruthy();
    });

    it('deve identificar shared user corretamente', async () => {
      const mockPurchase: Omit<IPurchaseProps, 'id'> = {
        title: 'Test List',
        user_id: 'owner123',
        shared_with: ['shared456'],
        is_active: true,
        max_value: 100,
        total_price: 0,
        start_date: null,
        end_date: null,
        purchase_items: [],
      };

      const mockGet = jest.fn().mockResolvedValue({
        exists: true,
        id: 'purchase123',
        data: () => mockPurchase,
      });

      const mockDoc = jest.fn().mockReturnValue({
        get: mockGet,
      });

      const mockCollection = jest.fn().mockReturnValue({
        doc: mockDoc,
      });

      (adminDb.collection as jest.Mock) = mockCollection;

      const result = await checkPurchaseAccess('purchase123', 'shared456');
      expect(result.isOwner).toBe(false);
      expect(result.hasAccess).toBe(true);
    });

    it('deve negar acesso a usuário sem permissão', async () => {
      const mockPurchase: Omit<IPurchaseProps, 'id'> = {
        title: 'Test List',
        user_id: 'owner123',
        shared_with: [],
        is_active: true,
        max_value: 100,
        total_price: 0,
        start_date: null,
        end_date: null,
        purchase_items: [],
      };

      const mockGet = jest.fn().mockResolvedValue({
        exists: true,
        id: 'purchase123',
        data: () => mockPurchase,
      });

      const mockDoc = jest.fn().mockReturnValue({
        get: mockGet,
      });

      const mockCollection = jest.fn().mockReturnValue({
        doc: mockDoc,
      });

      (adminDb.collection as jest.Mock) = mockCollection;

      const result = await checkPurchaseAccess('purchase123', 'stranger789');
      expect(result.isOwner).toBe(false);
      expect(result.hasAccess).toBe(false);
    });
  });

  describe('updatePurchase', () => {
    it('deve permitir update para owner', async () => {
      const mockPurchase: Omit<IPurchaseProps, 'id'> = {
        title: 'Test List',
        user_id: 'owner123',
        shared_with: [],
        is_active: true,
        max_value: 100,
        total_price: 0,
        start_date: null,
        end_date: null,
        purchase_items: [],
      };

      const mockUpdate = jest.fn().mockResolvedValue({});
      const mockGet = jest.fn().mockResolvedValue({
        exists: true,
        id: 'purchase123',
        data: () => mockPurchase,
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

      await updatePurchase('purchase123', 'owner123', { title: 'New Title' });
      expect(mockUpdate).toHaveBeenCalledWith({ title: 'New Title' });
    });

    it('deve permitir update para shared user', async () => {
      const mockPurchase: Omit<IPurchaseProps, 'id'> = {
        title: 'Test List',
        user_id: 'owner123',
        shared_with: ['shared456'],
        is_active: true,
        max_value: 100,
        total_price: 0,
        start_date: null,
        end_date: null,
        purchase_items: [],
      };

      const mockUpdate = jest.fn().mockResolvedValue({});
      const mockGet = jest.fn().mockResolvedValue({
        exists: true,
        id: 'purchase123',
        data: () => mockPurchase,
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

      await updatePurchase('purchase123', 'shared456', { title: 'New Title' });
      expect(mockUpdate).toHaveBeenCalledWith({ title: 'New Title' });
    });

    it('deve rejeitar update para usuário sem acesso', async () => {
      const mockPurchase: Omit<IPurchaseProps, 'id'> = {
        title: 'Test List',
        user_id: 'owner123',
        shared_with: [],
        is_active: true,
        max_value: 100,
        total_price: 0,
        start_date: null,
        end_date: null,
        purchase_items: [],
      };

      const mockGet = jest.fn().mockResolvedValue({
        exists: true,
        id: 'purchase123',
        data: () => mockPurchase,
      });

      const mockDoc = jest.fn().mockReturnValue({
        get: mockGet,
      });

      const mockCollection = jest.fn().mockReturnValue({
        doc: mockDoc,
      });

      (adminDb.collection as jest.Mock) = mockCollection;

      await expect(
        updatePurchase('purchase123', 'stranger789', { title: 'New Title' })
      ).rejects.toThrow('Acesso negado');
    });
  });

  describe('deleteHistoryPurchase', () => {
    it('deve permitir delete apenas para owner', async () => {
      const mockPurchase: Omit<IPurchaseProps, 'id'> = {
        title: 'Test List',
        user_id: 'owner123',
        shared_with: ['shared456'],
        is_active: false,
        max_value: 100,
        total_price: 50,
        start_date: null,
        end_date: null,
        purchase_items: [],
      };

      const mockDelete = jest.fn().mockResolvedValue({});
      const mockGet = jest.fn().mockResolvedValue({
        exists: true,
        id: 'purchase123',
        data: () => mockPurchase,
      });

      const mockDocRef = {
        get: mockGet,
        delete: mockDelete,
      };

      const mockDoc = jest.fn().mockReturnValue(mockDocRef);
      const mockCollection = jest.fn().mockReturnValue({
        doc: mockDoc,
      });

      (adminDb.collection as jest.Mock) = mockCollection;

      await deleteHistoryPurchase('purchase123', 'owner123');
      expect(mockDelete).toHaveBeenCalled();
    });

    it('deve rejeitar delete para shared user', async () => {
      const mockPurchase: Omit<IPurchaseProps, 'id'> = {
        title: 'Test List',
        user_id: 'owner123',
        shared_with: ['shared456'],
        is_active: false,
        max_value: 100,
        total_price: 50,
        start_date: null,
        end_date: null,
        purchase_items: [],
      };

      const mockGet = jest.fn().mockResolvedValue({
        exists: true,
        id: 'purchase123',
        data: () => mockPurchase,
      });

      const mockDoc = jest.fn().mockReturnValue({
        get: mockGet,
      });

      const mockCollection = jest.fn().mockReturnValue({
        doc: mockDoc,
      });

      (adminDb.collection as jest.Mock) = mockCollection;

      await expect(
        deleteHistoryPurchase('purchase123', 'shared456')
      ).rejects.toThrow('Acesso negado');
    });

    it('deve rejeitar delete para purchase ativa', async () => {
      const mockPurchase: Omit<IPurchaseProps, 'id'> = {
        title: 'Test List',
        user_id: 'owner123',
        shared_with: [],
        is_active: true,
        max_value: 100,
        total_price: 0,
        start_date: null,
        end_date: null,
        purchase_items: [],
      };

      const mockGet = jest.fn().mockResolvedValue({
        exists: true,
        id: 'purchase123',
        data: () => mockPurchase,
      });

      const mockDoc = jest.fn().mockReturnValue({
        get: mockGet,
      });

      const mockCollection = jest.fn().mockReturnValue({
        doc: mockDoc,
      });

      (adminDb.collection as jest.Mock) = mockCollection;

      await expect(
        deleteHistoryPurchase('purchase123', 'owner123')
      ).rejects.toThrow('Não é possível deletar uma purchase ativa');
    });
  });
});
