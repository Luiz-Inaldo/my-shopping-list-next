import { NextRequest, NextResponse } from 'next/server';
import { ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { validateAgentToken } from '@/lib/agentTokens';
import {
  listActivePurchases,
  listHistoryPurchases,
  checkPurchaseAccess,
  createPurchase,
  updatePurchase,
  addPurchaseItems,
  updatePurchaseItem,
  removePurchaseItem,
  toggleItemCheck,
  finishPurchase,
  deleteHistoryPurchase,
  sharePurchaseWithUsers,
  unsharePurchase,
} from '@/lib/mcpHelpers';
import { ItemCategories } from '@/enums/categories';
import { UnitTypes } from '@/enums/unitTypes';

const SERVER_VERSION = '1.0.0';
const SERVER_NAME = 'EzShopList MCP Server';

/**
 * Extrai e valida o Bearer token do header Authorization
 */
async function authenticateRequest(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  
  try {
    return await validateAgentToken(token);
  } catch (error) {
    // Se falhar validação (ex: Firebase credentials inválidas), retorna null
    // Isso permite que o endpoint responda 401 ao invés de 500
    console.error('Token validation error:', error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * Retorna erro de autenticação com WWW-Authenticate header
 */
function unauthorized(id: any = null) {
  return NextResponse.json(
    {
      jsonrpc: '2.0',
      error: {
        code: ErrorCode.InvalidRequest,
        message: 'Token inválido ou expirado',
      },
      id,
    },
    { 
      status: 401,
      headers: {
        'WWW-Authenticate': 'Bearer realm="EzShopList MCP", error="invalid_token"',
      },
    }
  );
}

/**
 * Handler MCP - processa requests JSON-RPC 2.0 conforme especificação MCP
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { method, params, id } = body;

    // Initialize - handshake MCP (não requer autenticação)
    if (method === 'initialize') {
      const clientProtocolVersion = params?.protocolVersion || '2024-11-05';
      
      // Suporta versões do protocolo MCP
      const supportedVersions = ['2024-11-05', '2025-03-26', '2025-06-18'];
      const negotiatedVersion = supportedVersions.includes(clientProtocolVersion)
        ? clientProtocolVersion
        : supportedVersions[supportedVersions.length - 1];

      return NextResponse.json({
        jsonrpc: '2.0',
        result: {
          protocolVersion: negotiatedVersion,
          capabilities: {
            tools: {},
          },
          serverInfo: {
            name: SERVER_NAME,
            version: SERVER_VERSION,
          },
        },
        id,
      });
    }

    // notifications/initialized - confirma inicialização (retorna 202 sem body)
    if (method === 'notifications/initialized') {
      return new NextResponse(null, { status: 202 });
    }

    // Demais métodos requerem autenticação
    const uid = await authenticateRequest(request);
    if (!uid) {
      return unauthorized(id);
    }

    // ListTools
    if (method === 'tools/list') {
      return NextResponse.json({
        jsonrpc: '2.0',
        result: {
          tools: [
            {
              name: 'list_active_lists',
              description: 'Lista todas as listas de compras ativas do usuário (próprias + compartilhadas)',
              inputSchema: {
                type: 'object',
                properties: {},
              },
            },
            {
              name: 'list_history',
              description: 'Lista o histórico de compras finalizadas (is_active=false)',
              inputSchema: {
                type: 'object',
                properties: {},
              },
            },
            {
              name: 'get_list',
              description: 'Obtém detalhes de uma lista específica',
              inputSchema: {
                type: 'object',
                properties: {
                  purchase_id: { type: 'string', description: 'ID da lista' },
                },
                required: ['purchase_id'],
              },
            },
            {
              name: 'create_list',
              description: 'Cria uma nova lista de compras',
              inputSchema: {
                type: 'object',
                properties: {
                  title: { type: 'string', description: 'Título da lista' },
                  max_value: { type: 'number', description: 'Valor máximo da lista' },
                },
                required: ['title', 'max_value'],
              },
            },
            {
              name: 'update_list',
              description: 'Atualiza título e/ou valor máximo de uma lista',
              inputSchema: {
                type: 'object',
                properties: {
                  purchase_id: { type: 'string', description: 'ID da lista' },
                  title: { type: 'string', description: 'Novo título (opcional)' },
                  max_value: { type: 'number', description: 'Novo valor máximo (opcional)' },
                },
                required: ['purchase_id'],
              },
            },
            {
              name: 'add_items',
              description: 'Adiciona itens em batch a uma lista',
              inputSchema: {
                type: 'object',
                properties: {
                  purchase_id: { type: 'string', description: 'ID da lista' },
                  items: {
                    type: 'array',
                    description: 'Array de itens a adicionar',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' },
                        category: {
                          type: 'string',
                          enum: Object.values(ItemCategories),
                        },
                        unit_type: {
                          type: 'string',
                          enum: Object.values(UnitTypes),
                        },
                        quantity: { type: 'number' },
                        value: { type: 'number' },
                        checked: { type: 'boolean', default: false },
                      },
                      required: ['name', 'category', 'unit_type', 'quantity', 'value'],
                    },
                  },
                },
                required: ['purchase_id', 'items'],
              },
            },
            {
              name: 'update_item',
              description: 'Atualiza um item existente',
              inputSchema: {
                type: 'object',
                properties: {
                  purchase_id: { type: 'string' },
                  item_id: { type: 'string' },
                  name: { type: 'string' },
                  category: { type: 'string', enum: Object.values(ItemCategories) },
                  unit_type: { type: 'string', enum: Object.values(UnitTypes) },
                  quantity: { type: 'number' },
                  value: { type: 'number' },
                },
                required: ['purchase_id', 'item_id'],
              },
            },
            {
              name: 'remove_item',
              description: 'Remove um item de uma lista',
              inputSchema: {
                type: 'object',
                properties: {
                  purchase_id: { type: 'string' },
                  item_id: { type: 'string' },
                },
                required: ['purchase_id', 'item_id'],
              },
            },
            {
              name: 'check_item',
              description: 'Marca um item como comprado',
              inputSchema: {
                type: 'object',
                properties: {
                  purchase_id: { type: 'string' },
                  item_id: { type: 'string' },
                },
                required: ['purchase_id', 'item_id'],
              },
            },
            {
              name: 'uncheck_item',
              description: 'Desmarca um item como comprado',
              inputSchema: {
                type: 'object',
                properties: {
                  purchase_id: { type: 'string' },
                  item_id: { type: 'string' },
                },
                required: ['purchase_id', 'item_id'],
              },
            },
            {
              name: 'finish_purchase',
              description: 'Finaliza uma compra (is_active=false, calcula total_price)',
              inputSchema: {
                type: 'object',
                properties: {
                  purchase_id: { type: 'string' },
                },
                required: ['purchase_id'],
              },
            },
            {
              name: 'delete_history_purchase',
              description: 'Deleta uma compra do histórico (apenas owner)',
              inputSchema: {
                type: 'object',
                properties: {
                  purchase_id: { type: 'string' },
                },
                required: ['purchase_id'],
              },
            },
            {
              name: 'share_list',
              description: 'Compartilha uma lista com outros usuários (apenas owner, por username)',
              inputSchema: {
                type: 'object',
                properties: {
                  purchase_id: { type: 'string' },
                  usernames: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Array de usernames',
                  },
                },
                required: ['purchase_id', 'usernames'],
              },
            },
            {
              name: 'unshare_list',
              description: 'Remove usuários do compartilhamento (apenas owner)',
              inputSchema: {
                type: 'object',
                properties: {
                  purchase_id: { type: 'string' },
                  usernames: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Array de usernames',
                  },
                },
                required: ['purchase_id', 'usernames'],
              },
            },
          ],
        },
        id,
      });
    }

    // CallTool
    if (method === 'tools/call') {
      const { name, arguments: args } = params;

      try {
        let result: any;

        switch (name) {
          case 'list_active_lists':
            result = await listActivePurchases(uid);
            break;

          case 'list_history':
            result = await listHistoryPurchases(uid);
            break;

          case 'get_list': {
            const { purchase_id } = args;
            const { hasAccess, purchase } = await checkPurchaseAccess(purchase_id, uid);
            if (!hasAccess || !purchase) {
              throw new Error('Lista não encontrada ou acesso negado');
            }
            result = purchase;
            break;
          }

          case 'create_list': {
            const { title, max_value } = args;
            result = await createPurchase(uid, title, max_value);
            break;
          }

          case 'update_list': {
            const { purchase_id, title, max_value } = args;
            const updates: any = {};
            if (title !== undefined) updates.title = title;
            if (max_value !== undefined) updates.max_value = max_value;
            await updatePurchase(purchase_id, uid, updates);
            result = { success: true };
            break;
          }

          case 'add_items': {
            const { purchase_id, items } = args;
            await addPurchaseItems(purchase_id, uid, items);
            result = { success: true, items_added: items.length };
            break;
          }

          case 'update_item': {
            const { purchase_id, item_id, ...updates } = args;
            await updatePurchaseItem(purchase_id, uid, item_id, updates);
            result = { success: true };
            break;
          }

          case 'remove_item': {
            const { purchase_id, item_id } = args;
            await removePurchaseItem(purchase_id, uid, item_id);
            result = { success: true };
            break;
          }

          case 'check_item': {
            const { purchase_id, item_id } = args;
            await toggleItemCheck(purchase_id, uid, item_id, true);
            result = { success: true };
            break;
          }

          case 'uncheck_item': {
            const { purchase_id, item_id } = args;
            await toggleItemCheck(purchase_id, uid, item_id, false);
            result = { success: true };
            break;
          }

          case 'finish_purchase': {
            const { purchase_id } = args;
            await finishPurchase(purchase_id, uid);
            result = { success: true };
            break;
          }

          case 'delete_history_purchase': {
            const { purchase_id } = args;
            await deleteHistoryPurchase(purchase_id, uid);
            result = { success: true };
            break;
          }

          case 'share_list': {
            const { purchase_id, usernames } = args;
            result = await sharePurchaseWithUsers(purchase_id, uid, usernames);
            break;
          }

          case 'unshare_list': {
            const { purchase_id, usernames } = args;
            result = await unsharePurchase(purchase_id, uid, usernames);
            break;
          }

          default:
            throw new Error(`Tool desconhecido: ${name}`);
        }

        return NextResponse.json({
          jsonrpc: '2.0',
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          },
          id,
        });
      } catch (error) {
        console.error('Tool execution error:', error);
        return NextResponse.json({
          jsonrpc: '2.0',
          error: {
            code: ErrorCode.InternalError,
            message: error instanceof Error ? error.message : 'Erro desconhecido',
          },
          id,
        });
      }
    }

    // Método não suportado
    return NextResponse.json({
      jsonrpc: '2.0',
      error: {
        code: ErrorCode.MethodNotFound,
        message: `Método não suportado: ${method}`,
      },
      id,
    });
  } catch (error) {
    console.error('MCP endpoint error:', error);
    return NextResponse.json(
      {
        jsonrpc: '2.0',
        error: {
          code: ErrorCode.InternalError,
          message: 'Erro interno do servidor',
        },
        id: null,
      },
      { status: 500 }
    );
  }
}

/**
 * GET não é suportado - MCP sobre HTTP usa apenas POST para JSON-RPC
 * (GET seria usado para SSE, mas não implementado aqui)
 */
export async function GET() {
  return NextResponse.json(
    {
      error: 'Method Not Allowed',
      message: 'This MCP endpoint only supports POST requests (JSON-RPC 2.0)',
    },
    { 
      status: 405,
      headers: {
        'Allow': 'POST, OPTIONS',
      },
    }
  );
}

/**
 * OPTIONS - CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Allow': 'POST, OPTIONS',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
