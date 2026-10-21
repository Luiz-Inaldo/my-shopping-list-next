'use client';

import { useCallback, useMemo, useState, useTransition } from 'react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { debounce } from '@/functions/debounce';
import { searchUsernamesByPrefix } from '@/services/usernames';
import { sharePurchaseWithUsers } from '@/services/purchasesListServices';
import { sendToastMessage } from '@/functions/sendToastMessage';
import { tryCatchRequest } from '@/functions/requests';
import { invalidateAllQueries } from '@/functions/invalidadeQueries';
import { QUERY_KEYS } from '@/constants/queryKeys';
import useGeneralUserStore from '@/store/generalUserStore';
import { defaultAvatarImgUrl } from '@/constants/avatarImgUrl';
import { SelectedShareUser } from '@/types/share';
import { cn } from '@/lib/utils';
import { queryClient } from '@/utils/queryClient';

interface ShareListModalProps {
  trigger: React.ReactNode;
  purchaseId: string;
  listName: string;
  sharedWith: string[];
}

interface ShareUserRowProps {
  user: SelectedShareUser;
  isSelected: boolean;
  isDisabled: boolean;
  onToggle: (userId: string) => void;
}

function ShareUserRow({ user, isSelected, isDisabled, onToggle }: ShareUserRowProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-sketch-notif border-2 border-sketch-border bg-sketch-white px-3 py-2 shadow-sketch-sm',
        isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      )}
      onClick={() => !isDisabled && onToggle(user.id)}
    >
      <Avatar className="h-8 w-8 shrink-0 border-2 border-sketch-border">
        <AvatarImage src={user.profile_img} />
        <AvatarFallback>
          <img src={defaultAvatarImgUrl} alt="no-profile-img" width={32} height={32} />
        </AvatarFallback>
      </Avatar>
      <span className="font-sketch text-sm text-title flex-1">{user.username}</span>
      <Checkbox
        checked={isSelected}
        disabled={isDisabled}
        onCheckedChange={() => !isDisabled && onToggle(user.id)}
      />
    </div>
  );
}

export function ShareListModal({ trigger, purchaseId, listName, sharedWith }: ShareListModalProps) {
  const loggedInUser = useGeneralUserStore((s) => s.userProfile);
  const loggedInUserId = loggedInUser?.uid;

  const [open, setOpen] = useState(false);
  const [isSharing, startShareTransition] = useTransition();
  const [usernameInput, setUsernameInput] = useState('');
  const [searchResults, setSearchResults] = useState<SelectedShareUser[]>([]);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [hasSearchError, setHasSearchError] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [selectedUsersData, setSelectedUsersData] = useState<Map<string, SelectedShareUser>>(new Map());

  const runSearch = useCallback(async (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) {
      setSearchResults([]);
      setIsLookingUp(false);
      setHasSearchError(false);
      return;
    }

    setIsLookingUp(true);
    setSearchResults([]);
    setHasSearchError(false);

    const [results, error] = await tryCatchRequest<SelectedShareUser[], Error>(
      searchUsernamesByPrefix(trimmed)
    );

    setIsLookingUp(false);

    if (error || !results) {
      console.error('Error searching users:', error);
      setHasSearchError(true);
      return;
    }

    setSearchResults(results);
  }, []);

  const debouncedSearch = useMemo(
    () => debounce((value: string) => { void runSearch(value); }, 1000),
    [runSearch]
  );

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setUsernameInput('');
      setSelectedUserIds(new Set());
      setSelectedUsersData(new Map());
      setSearchResults([]);
      setIsLookingUp(false);
      setHasSearchError(false);
    }
  }

  function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setUsernameInput(value);
    setHasSearchError(false);
    debouncedSearch(value);
  }

  function handleToggleUser(userId: string) {
    if (userId === loggedInUserId) return;

    if (selectedUserIds.has(userId)) {
      setSelectedUserIds((prev) => { const next = new Set(prev); next.delete(userId); return next; });
      setSelectedUsersData((prev) => { const next = new Map(prev); next.delete(userId); return next; });
    } else {
      const user = searchResults.find((u) => u.id === userId);
      if (!user) return;
      setSelectedUserIds((prev) => new Set([...prev, userId]));
      setSelectedUsersData((prev) => new Map([...prev, [userId, user]]));
    }
  }

  function handleRemoveUser(userId: string) {
    setSelectedUserIds((prev) => { const next = new Set(prev); next.delete(userId); return next; });
    setSelectedUsersData((prev) => { const next = new Map(prev); next.delete(userId); return next; });
  }

  function handleShare() {
    if (!purchaseId || selectedUserIds.size === 0) return;

    const userIds = Array.from(selectedUserIds);

    startShareTransition(async () => {
      const senderInfo = {
        id: loggedInUser?.uid ?? '',
        name: loggedInUser?.name ?? '',
        profile_img: loggedInUser?.profile_img ?? '',
      };

      const [, shareError] = await tryCatchRequest<void, Error>(
        sharePurchaseWithUsers(purchaseId, userIds, senderInfo, listName)
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

  const showNoResults =
    !isLookingUp && usernameInput.trim() && searchResults.length === 0 && !hasSearchError;

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
          <div className="space-y-4">
            <Label htmlFor="share-username" className="font-sketch text-title">
              nome do usuário
            </Label>
            <Input
              id="share-username"
              type="text"
              value={usernameInput}
              onChange={handleUsernameChange}
              className="h-10 border-2 border-sketch-border bg-sketch-white font-sketch text-sm text-title shadow-sketch-sm focus-visible:ring-2 focus-visible:ring-sketch-accent/25 focus-visible:ring-offset-0 rounded-sketch-notif"
            />

            {isLookingUp && (
              <p className="text-sm text-paragraph">buscando...</p>
            )}

            {showNoResults && (
              <p className="text-sm text-destructive">usuário não encontrado</p>
            )}

            {hasSearchError && (
              <p className="text-sm text-destructive">erro ao buscar usuários. Tente novamente.</p>
            )}

            {!isLookingUp && searchResults.length > 0 && (
              <div className="space-y-2.5 pt-1">
                {searchResults.map((user) => {
                  const isDisabled =
                    user.id === loggedInUserId || sharedWith.includes(user.id);
                  return (
                    <ShareUserRow
                      key={user.id}
                      user={user}
                      isSelected={selectedUserIds.has(user.id)}
                      isDisabled={isDisabled}
                      onToggle={handleToggleUser}
                    />
                  );
                })}
              </div>
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
            disabled={selectedUserIds.size === 0 || isSharing}
            onClick={handleShare}
          >
            compartilhar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
