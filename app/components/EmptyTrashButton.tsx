'use client';

import { useTransition } from 'react';
import { Trash } from 'lucide-react';
import { emptyTrash } from '@/actions/cardActions';
import toast from 'react-hot-toast';

export default function EmptyTrashButton() {
  const [isPending, startTransition] = useTransition();

  const handleEmptyTrash = () => {
    const isConfirmed = window.confirm(
      "Tem certeza que deseja esvaziar a lixeira? Esta ação não pode ser desfeita."
    );

    if (!isConfirmed) return;

    startTransition(async () => {
      await toast.promise(
        emptyTrash(),
        {
          loading: 'Esvaziando a lixeira...',
          success: 'Lixeira esvaziada com sucesso!',
          error: 'Erro ao esvaziar a lixeira.',
        }
      );
    });
  };

  return (
    <button
      onClick={handleEmptyTrash}
      disabled={isPending}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 border-2 border-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
    >
      <Trash size={16} />
      {isPending ? 'Esvaziando...' : 'Esvaziar Lixeira'}
    </button>
  );
}
