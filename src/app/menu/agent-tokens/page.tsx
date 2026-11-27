"use client";

import Header from "@/components/Header";
import { AppLoader } from "@/components/Loader/app-loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendToastMessage } from "@/functions/sendToastMessage";
import {
  useAgentTokensQuery,
  useCreateAgentToken,
  useRevokeAgentToken,
} from "@/hooks/queries/agent-tokens";
import { APP_ROUTES } from "@/routes/app-routes";
import { ChevronLeft, Copy, Plus, Trash2, AlertCircle, Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { CreateAgentTokenResponse } from "@/types/agentToken";

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function isExpired(expiresAt: Date | string): boolean {
  const d = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
  return d.getTime() < Date.now();
}

export default function AgentTokensPage() {
  const { data: tokens = [], isLoading: loading, isError } = useAgentTokensQuery();
  const createMutation = useCreateAgentToken();
  const revokeMutation = useRevokeAgentToken();
  const creating = createMutation.isPending;

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTokenLabel, setNewTokenLabel] = useState("");
  const [generatedToken, setGeneratedToken] = useState<CreateAgentTokenResponse | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isError) sendToastMessage({ title: "Erro ao carregar tokens", type: "error" });
  }, [isError]);

  function handleCreateToken() {
    if (!newTokenLabel.trim()) {
      sendToastMessage({ title: "Informe um nome para o token", type: "error" });
      return;
    }

    createMutation.mutate(newTokenLabel.trim(), {
      onSuccess: (data) => {
        setGeneratedToken(data);
        setNewTokenLabel("");
        setShowCreateForm(false);
        sendToastMessage({ title: "Token criado com sucesso!", type: "success" });
      },
      onError: (error) => {
        sendToastMessage({ title: error.message || "Erro ao criar token", type: "error" });
      },
    });
  }

  function handleRevokeToken(tokenHash: string) {
    revokeMutation.mutate(tokenHash, {
      onSuccess: () =>
        sendToastMessage({ title: "Token revogado com sucesso", type: "success" }),
      onError: () => sendToastMessage({ title: "Erro ao revogar token", type: "error" }),
    });
  }

  function handleCopyToken(token: string) {
    navigator.clipboard.writeText(token);
    setCopied(true);
    sendToastMessage({ title: "Token copiado!", type: "success" });
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="sketch-shell min-h-screen flex flex-col">
      <Header className="text-2xl font-sketchHeading">
        <Link href={APP_ROUTES.private.menu.name} className="flex items-center gap-1 text-sketch-fg">
          <ChevronLeft size={24} strokeWidth={2.5} />
        </Link>
        <span>Tokens de Agentes</span>
      </Header>

      <main className="font-sketch flex-1 px-5 pb-24 pt-8 flex flex-col gap-6 max-w-2xl mx-auto w-full">
        {/* Info Card */}
        <div className="bg-blue-50 border-[3px] border-blue-200 rounded-sketch-card p-4 -rotate-1">
          <div className="flex gap-3">
            <AlertCircle className="text-blue-600 mt-1 flex-shrink-0" size={20} />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Tokens de acesso para agentes AI</p>
              <p>Use estes tokens para conectar agentes como Grok ao EzShop. Cada token é válido por 30 dias e você pode ter até 3 tokens ativos.</p>
            </div>
          </div>
        </div>

        {/* Generated Token Display */}
        {generatedToken && (
          <div className="bg-green-50 border-[3px] border-green-300 rounded-sketch-card p-5 rotate-1">
            <p className="font-sketchHeading text-lg text-green-900 font-semibold mb-2">✅ Token criado com sucesso!</p>
            <p className="text-sm text-green-800 mb-3">
              Copie e guarde este token agora. Ele não será exibido novamente.
            </p>
            <div className="bg-white border-2 border-green-200 rounded-lg p-3 font-mono text-sm break-all">
              {generatedToken.token}
            </div>
            <div className="flex gap-2 mt-3">
              <Button
                onClick={() => handleCopyToken(generatedToken.token)}
                className="flex-1"
                variant="outline"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copiado!" : "Copiar Token"}
              </Button>
              <Button
                onClick={() => setGeneratedToken(null)}
                variant="default"
              >
                Fechar
              </Button>
            </div>
          </div>
        )}

        {/* Create Token Form */}
        {showCreateForm && (
          <div className="bg-sketch-white border-[3px] border-sketch-border rounded-sketch-card p-5 -rotate-1">
            <h3 className="font-sketchHeading text-lg mb-3">Criar Novo Token</h3>
            <div className="flex flex-col gap-3">
              <Input
                placeholder="Nome do token (ex: Meu Agente Grok)"
                value={newTokenLabel}
                onChange={(e) => setNewTokenLabel(e.target.value)}
                maxLength={100}
                disabled={creating}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleCreateToken}
                  disabled={creating || !newTokenLabel.trim()}
                  className="flex-1"
                >
                  {creating ? <AppLoader size={16} /> : <Plus size={16} />}
                  Criar
                </Button>
                <Button
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewTokenLabel("");
                  }}
                  variant="outline"
                  disabled={creating}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Create Button */}
        {!showCreateForm && tokens?.length < 3 && (
          <Button
            onClick={() => setShowCreateForm(true)}
            className="w-full"
            variant="default"
          >
            <Plus size={18} />
            Criar Novo Token
          </Button>
        )}

        {/* Tokens List */}
        {loading ? (
          <div className="flex justify-center py-10">
            <AppLoader size={32} />
          </div>
        ) : tokens?.length === 0 ? (
          <div className="text-center py-10 text-sketch-fg/60">
            <p className="font-sketchHeading text-lg">Nenhum token criado ainda</p>
            <p className="text-sm mt-2">Crie um token para conectar seu agente</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {tokens?.map((token) => {
              const expired = isExpired(token.expires_at);
              const revoked = token.revoked;
              
              return (
                <div
                  key={token.token_hash}
                  className={`bg-sketch-white border-[3px] rounded-sketch-card p-4 ${
                    expired || revoked ? "border-gray-300 opacity-60" : "border-sketch-border"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-sketchHeading font-semibold text-lg">{token.label}</h4>
                      {revoked && (
                        <span className="text-xs text-red-600 font-semibold">REVOGADO</span>
                      )}
                      {expired && !revoked && (
                        <span className="text-xs text-orange-600 font-semibold">EXPIRADO</span>
                      )}
                    </div>
                    {!revoked && (
                      <Button
                        onClick={() => handleRevokeToken(token.token_hash)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                  
                  <div className="text-sm text-sketch-fg/70 space-y-1">
                    <p>
                      <span className="font-medium">Criado:</span> {formatDate(token.created_at)}
                    </p>
                    <p>
                      <span className="font-medium">Expira:</span> {formatDate(token.expires_at)}
                    </p>
                    {token.last_used_at && (
                      <p>
                        <span className="font-medium">Último uso:</span> {formatDate(token.last_used_at)}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-dashed border-sketch-fg/10">
                    <p className="text-xs text-sketch-fg/50 font-mono break-all">
                      {token.token_hash.substring(0, 16)}...
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
