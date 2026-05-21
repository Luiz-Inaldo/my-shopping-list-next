'use client';

import { useCallback, useMemo, useState, useTransition } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { debounce } from '@/functions/debounce';
import { lookupUsername } from '@/services/usernames';
import { sharePurchaseWithUsers } from '@/services/purchasesListServices';
import { sendToastMessage } from '@/functions/sendToastMessage';
import { tryCatchRequest } from '@/functions/requests';
import { invalidateAllQueries } from '@/functions/invalidadeQueries';
import { QUERY_KEYS } from '@/constants/queryKeys';
import useGeneralUserStore from '@/store/generalUserStore';
import { SelectedShareUser } from '@/types/share';
import { cn } from '@/lib/utils';

interface ShareListModalProps {
  trigger: React.ReactNode;
  purchaseId: string;
}

type LookupError = 'not_found' | 'self' | null;

const LOOKUP_ERROR_MESSAGES: Record<Exclude<LookupError, null>, string> = {
  not_found: 'usuário não encontrado',
  self: 'não pode compartilhar a lista consigo mesmo',
};

function resetLookupState(
  setResolvedUser: (user: SelectedShareUser | null) => void,
  setLookupError: (value: LookupError) => void,
  setIsLookingUp: (value: boolean) => void
) {
  setResolvedUser(null);
  setLookupError(null);
  setIsLookingUp(false);
}

export function ShareListModal({ trigger, purchaseId }: ShareListModalProps) {
  const queryClient = useQueryClient();
  const loggedInUserId = useGeneralUserStore((s) => s.userProfile?.uid);

  const [open, setOpen] = useState(false);
  const [isSharing, startShareTransition] = useTransition();
  const [usernameInput, setUsernameInput] = useState('');
  const [resolvedUser, setResolvedUser] = useState<SelectedShareUser | null>(
    null
  );
  const [lookupError, setLookupError] = useState<LookupError>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<SelectedShareUser[]>([]);

  const runUsernameLookup = useCallback(
    async (value: string) => {
      const trimmed = value.trim();

      if (!trimmed) {
        setResolvedUser(null);
        setLookupError(null);
        setIsLookingUp(false);
        return;
      }

      setIsLookingUp(true);
      setResolvedUser(null);
      setLookupError(null);

      const [user, lookupRequestError] = await tryCatchRequest<
        SelectedShareUser | null,
        Error
      >(lookupUsername(trimmed));

      setIsLookingUp(false);

      if (lookupRequestError) {
        console.error('Error looking up username:', lookupRequestError);
        setResolvedUser(null);
        setLookupError('not_found');
        return;
      }

      if (!user) {
        setResolvedUser(null);
        setLookupError('not_found');
        return;
      }

      if (loggedInUserId && user.id === loggedInUserId) {
        setResolvedUser(null);
        setLookupError('self');
        return;
      }

      setResolvedUser(user);
      setLookupError(null);
    },
    [loggedInUserId]
  );

  const debouncedLookup = useMemo(
    () =>
      debounce((value: string) => {
        void runUsernameLookup(value);
      }, 1000),
    [runUsernameLookup]
  );

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setUsernameInput('');
      setSelectedUsers([]);
      resetLookupState(setResolvedUser, setLookupError, setIsLookingUp);
    }
  }

  function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setUsernameInput(value);
    setLookupError(null);
    setResolvedUser(null);
    debouncedLookup(value);
  }

  function handleSelectUser() {
    if (!resolvedUser || resolvedUser.id === loggedInUserId) return;

    setSelectedUsers((prev) => {
      if (prev.some((user) => user.username === resolvedUser.username)) {
        return prev;
      }
      return [...prev, resolvedUser];
    });

    setUsernameInput('');
    resetLookupState(setResolvedUser, setLookupError, setIsLookingUp);
  }

  function handleRemoveUser(username: string) {
    setSelectedUsers((prev) =>
      prev.filter((user) => user.username !== username)
    );
  }

  function handleShare() {
    if (!purchaseId || selectedUsers.length === 0) return;

    const userIds = selectedUsers.map((user) => user.id);

    startShareTransition(async () => {
      const [, shareError] = await tryCatchRequest<void, Error>(
        sharePurchaseWithUsers(purchaseId, userIds)
      );

      if (shareError) {
        console.error('Error sharing purchase:', shareError);
        sendToastMessage({
          title: 'Erro ao compartilhar a lista. Tente novamente.',
          type: 'error',
        });
        return;
      }

      sendToastMessage({
        title: 'Lista compartilhada com sucesso!',
        type: 'success',
      });

      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.productsList, purchaseId],
      });

      if (loggedInUserId) {
        invalidateAllQueries([[QUERY_KEYS.purchases, loggedInUserId]]);
      }

      handleOpenChange(false);
    });
  }

  const isUserAlreadySelected =
    !!resolvedUser &&
    selectedUsers.some((user) => user.username === resolvedUser.username);

  const canSelectUser =
    !!resolvedUser &&
    !isUserAlreadySelected &&
    !isLookingUp &&
    lookupError !== 'self';

  const showLookupError =
    lookupError && usernameInput.trim() && !isLookingUp;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md gap-4">
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="font-sketchHeading text-title">
            Compartilhar com
          </DialogTitle>
          <DialogDescription>
            selecione os usuários com quem deseja compartilhar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="share-username" className="font-sketch text-title">
              nome do usuário
            </Label>
            <div className="flex items-end gap-2">
              <Input
                id="share-username"
                type="text"
                value={usernameInput}
                onChange={handleUsernameChange}
                className="h-10 flex-1 border-2 border-sketch-border bg-sketch-white font-sketch text-sm text-title shadow-sketch-sm focus-visible:ring-2 focus-visible:ring-sketch-accent/25 focus-visible:ring-offset-0 rounded-sketch-notif"
              />
              <Button
                type="button"
                disabled={!canSelectUser}
                onClick={handleSelectUser}
                className={cn(
                  'shrink-0 bg-sketch-success text-white hover:bg-sketch-success-dk',
                  'border-sketch-success hover:border-sketch-success-dk'
                )}
              >
                selecionar usuário
              </Button>
            </div>
            {showLookupError && (
              <p className="text-sm text-destructive">
                {LOOKUP_ERROR_MESSAGES[lookupError]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            {selectedUsers.length === 0 ? (
              <p className="text-sm text-center text-paragraph">
                nenhum usuário selecionado
              </p>
            ) : (
              <ul className="space-y-2 px-2 py-3 border border-dashed border-paragraph rounded-sketch-notif">
                <p className="text-sm text-subtitle">usuários selecionados</p>
                {selectedUsers.map((user) => (
                  <li
                    key={user.username}
                    className="flex items-center justify-between gap-2 rounded-sketch-notif border-2 border-sketch-border bg-sketch-white px-3 py-1 shadow-sketch-sm"
                  >
                    <span className="font-sketch text-sm text-title">
                      {user.username}
                    </span>
                    <button
                      type="button"
                      aria-label={`Remover ${user.username}`}
                      onClick={() => handleRemoveUser(user.username)}
                      className="flex items-center justify-center h-6 w-6 shrink-0"
                    >
                      <X size={16} strokeWidth={2.5} className="text-sketch-danger" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <DialogFooter className="mt-5 flex !flex-row gap-2 sm:justify-end">
          <Button
            className="w-full"
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            cancelar
          </Button>
          <Button
            className="w-full"
            type="button"
            disabled={selectedUsers.length === 0 || isSharing}
            onClick={handleShare}
          >
            compartilhar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
