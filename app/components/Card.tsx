'use client';

import { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2, RotateCcw, Trash } from 'lucide-react';

export interface CardProps {
  id: string;
  title: string;
  description?: string | null;
  type: string;
  is_active: boolean;
  is_completed: boolean;
  createdAt: Date;
  onToggleCompletion?: (id: string, currentStatus: boolean) => Promise<any>;
  onMoveToTrash?: (id: string) => Promise<any>;
  onRestore?: (id: string) => Promise<any>;
  onHardDelete?: (id: string) => Promise<any>;
}

export default function Card({
  id,
  title,
  description,
  type,
  is_active,
  is_completed,
  createdAt,
  onToggleCompletion,
  onMoveToTrash,
  onRestore,
  onHardDelete,
}: CardProps) {
  const [isPending, startTransition] = useTransition();
  
  // Estado otimista local para o checkbox da tarefa
  const [optimisticCompleted, setOptimisticCompleted] = useState(is_completed);

  // Manipulador do Checkbox (Optimistic UI)
  const handleToggle = () => {
    if (!onToggleCompletion) return;
    
    // 1. Atualiza a UI imediatamente (Otimista)
    setOptimisticCompleted(!optimisticCompleted);
    
    // 2. Dispara a Server Action em background
    startTransition(async () => {
      try {
        await onToggleCompletion(id, optimisticCompleted);
      } catch (error) {
        // Se der erro no banco, revertemos a UI para o estado real
        console.error("Erro ao atualizar tarefa", error);
        setOptimisticCompleted(optimisticCompleted);
      }
    });
  };

  // Manipuladores de Deleção/Restauração
  const handleTrash = () => {
    if (onMoveToTrash) startTransition(() => onMoveToTrash(id));
  };

  const handleRestore = () => {
    if (onRestore) startTransition(() => onRestore(id));
  };

  const handleHardDelete = () => {
    if (onHardDelete) startTransition(() => onHardDelete(id));
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={`group relative flex flex-col p-4 rounded-xl border transition-all ${
        optimisticCompleted && type === 'task'
          ? 'bg-surface/50 border-border opacity-70'
          : 'bg-background border-border hover:border-primary/30 hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3">
        
        {/* VARIANTE: TASK (Renderiza o Checkbox) */}
        {type === 'task' && is_active && (
          <button
            onClick={handleToggle}
            disabled={isPending}
            className={`mt-1 shrink-0 w-5 h-5 rounded flex items-center justify-center border transition-colors ${
              optimisticCompleted
                ? 'bg-primary border-primary text-primary-foreground'
                : 'border-muted-foreground hover:border-primary'
            }`}
          >
            {optimisticCompleted && <Check size={14} strokeWidth={3} />}
          </button>
        )}

        {/* CONTEÚDO (Título e Descrição) */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-base mb-1 truncate transition-all ${
            optimisticCompleted && type === 'task' ? 'line-through text-muted-foreground' : 'text-foreground'
          }`}>
            {title}
          </h3>
          
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* RODAPÉ E AÇÕES (Aparecem no Hover em Desktop) */}
      <div className="mt-4 flex items-center justify-between pt-2 border-t border-transparent group-hover:border-border transition-colors">
        <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
          {type === 'note' ? 'Nota' : 'Tarefa'} • {new Date(createdAt).toLocaleDateString('pt-BR')}
        </span>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Ações se estiver Ativo (Workspace) */}
          {is_active ? (
            <button
              onClick={handleTrash}
              disabled={isPending}
              className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"
              title="Mover para lixeira"
            >
              <Trash2 size={16} />
            </button>
          ) : (
            /* Ações se estiver na Lixeira */
            <>
              <button
                onClick={handleRestore}
                disabled={isPending}
                className="p-1.5 text-muted-foreground hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-950/30 rounded-md transition-colors"
                title="Restaurar"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={handleHardDelete}
                disabled={isPending}
                className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"
                title="Excluir Permanentemente"
              >
                <Trash size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
