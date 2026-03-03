'use client';

import { useTransition } from 'react';
import { Trash } from 'lucide-react';
import { emptyTrash } from '@/actions/cardActions';

export default function EmptyTrashButton() {
  const [isPending, startTransition] = useTransition();

  const handleEmptyTrash = () => {
    // Confirmação simples para evitar exclusão acidental
    const confirm = window.confirm('Tem certeza que deseja esvaziar a lixeira? Esta ação não pode ser desfeita.');
    if (!confirm) return;

    startTransition(async () => {
      try {
        await emptyTrash();
      } catch (error) {
        console.error("Erro ao esvaziar a lixeira:", error);
      }
    });
  };

  return (
    <button
      onClick={handleEmptyTrash}
      disabled={isPending}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
    >
      <Trash size={16} />
      {isPending ? 'Esvaziando...' : 'Esvaziar Lixeira'}
    </button>
  );
}
