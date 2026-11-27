import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebaseAdmin';
import {
  createAgentToken,
  listUserTokens,
  revokeAgentToken,
} from '@/lib/agentTokens';
import { CreateAgentTokenResponse, AgentTokenListItem } from '@/types/agentToken';

/**
 * Extrai e verifica o token Firebase do header Authorization
 */
async function verifyFirebaseToken(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * GET /api/agent-tokens - Lista todos os tokens do usuário
 */
export async function GET(request: NextRequest) {
  try {
    const uid = await verifyFirebaseToken(request);
    if (!uid) {
      return NextResponse.json(
        { error: 'Autenticação necessária' },
        { status: 401 }
      );
    }

    const tokens = await listUserTokens(uid);
    return NextResponse.json({ tokens });
  } catch (error) {
    console.error('Error listing tokens:', error);
    return NextResponse.json(
      { error: 'Erro ao listar tokens' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/agent-tokens - Cria um novo token
 */
export async function POST(request: NextRequest) {
  try {
    const uid = await verifyFirebaseToken(request);
    if (!uid) {
      return NextResponse.json(
        { error: 'Autenticação necessária' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { label } = body;

    if (!label || typeof label !== 'string' || label.trim().length === 0) {
      return NextResponse.json(
        { error: 'Label é obrigatório e deve ser uma string não vazia' },
        { status: 400 }
      );
    }

    if (label.length > 100) {
      return NextResponse.json(
        { error: 'Label não pode ter mais de 100 caracteres' },
        { status: 400 }
      );
    }

    const { token, tokenHash, expiresAt } = await createAgentToken(uid, label.trim());

    const response: CreateAgentTokenResponse = {
      token,
      token_hash: tokenHash,
      label: label.trim(),
      created_at: new Date(),
      expires_at: expiresAt,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating token:', error);
    
    if (error instanceof Error && error.message.includes('Limite de')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao criar token' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/agent-tokens - Revoga um token
 */
export async function DELETE(request: NextRequest) {
  try {
    const uid = await verifyFirebaseToken(request);
    if (!uid) {
      return NextResponse.json(
        { error: 'Autenticação necessária' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { token_hash } = body;

    if (!token_hash || typeof token_hash !== 'string') {
      return NextResponse.json(
        { error: 'token_hash é obrigatório' },
        { status: 400 }
      );
    }

    await revokeAgentToken(uid, token_hash);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error revoking token:', error);
    
    if (error instanceof Error && error.message === 'Token não encontrado') {
      return NextResponse.json(
        { error: 'Token não encontrado' },
        { status: 404 }
      );
    }

    if (error instanceof Error && error.message === 'Token não pertence ao usuário') {
      return NextResponse.json(
        { error: 'Token não pertence ao usuário' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao revogar token' },
      { status: 500 }
    );
  }
}
