'use client';

import { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2, RotateCcw, Trash, Pin, PinOff, Edit2, X, Save } from 'lucide-react';

export interface CardProps {
  id: string;
  title: string;
  description?: string | null;
  type: string;
  is_active: boolean;
  is_completed: boolean;
  is_pinned: boolean;
  createdAt: Date;
  onToggleCompletion?: (id: string, currentStatus: boolean) => Promise<any>;
  onMoveToTrash?: (id: string) => Promise<any>;
  onRestore?: (id: string) => Promise<any>;
  onHardDelete?: (id: string) => Promise<any>;
  onUpdate?: (id: string, data: { title: string; description?: string }) => Promise<any>;
  onTogglePin?: (id: string, currentStatus: boolean) => Promise<any>;
}

export default function Card({
  id,
  title,
  description,
  type,
  is_active,
  is_completed,
  is_pinned,
  createdAt,
  onToggleCompletion,
  onMoveToTrash,
  onRestore,
  onHardDelete,
  onUpdate,
  onTogglePin,
}: CardProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticCompleted, setOptimisticCompleted] = useState(is_completed);
  const [optimisticPinned, setOptimisticPinned] = useState(is_pinned);

  // Estados de Edição
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description || '');

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

  const handlePin = () => {
    if (!onTogglePin) return;
    setOptimisticPinned(!optimisticPinned);
    startTransition(() => onTogglePin(id, optimisticPinned));
  };

  const handleSaveEdit = () => {
    if (!onUpdate || !editTitle.trim()) return;
    setIsEditing(false);
    startTransition(() => onUpdate(id, { title: editTitle, description: editDescription }));
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditTitle(title);
    setEditDescription(description || '');
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
      {/* Botão de Fixar (Aparece no hover ou se estiver fixado) */}
      {is_active && !isEditing && (
        <button
          onClick={handlePin}
          disabled={isPending}
          className={`absolute top-3 right-3 p-1.5 rounded-full transition-all ${
            optimisticPinned ? 'opacity-100 text-primary bg-primary-muted' : 'opacity-0 group-hover:opacity-100 text-muted-foreground hover:bg-hover'
          }`}
          title={optimisticPinned ? "Desafixar" : "Fixar nota"}
        >
          {optimisticPinned ? <Pin size={16} className="fill-current" /> : <Pin size={16} />}
        </button>
      )}

      <div className="flex items-start gap-3">
        {type === 'task' && is_active && !isEditing && (
          <button
            onClick={handleToggle}
            disabled={isPending}
            className={`mt-1 shrink-0 w-5 h-5 rounded flex items-center justify-center border transition-colors ${
              optimisticCompleted ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground hover:border-primary'
            }`}
          >
            {optimisticCompleted && <Check size={14} strokeWidth={3} />}
          </button>
        )}

        <div className="flex-1 min-w-0 pr-6">
          {isEditing ? (
            /* MODO DE EDIÇÃO */
            <div className="flex flex-col gap-2 w-full">
              <input
                autoFocus
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full text-base font-semibold bg-surface border border-border rounded-md px-2 py-1 focus:outline-none focus:border-primary"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                className="w-full text-sm resize-none bg-surface border border-border rounded-md px-2 py-1 focus:outline-none focus:border-primary"
              />
              <div className="flex items-center gap-2 mt-2">
                <button onClick={handleSaveEdit} className="p-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                  <Save size={16} />
                </button>
                <button onClick={cancelEdit} className="p-1.5 bg-surface border border-border text-muted-foreground rounded-md hover:bg-hover">
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            /* MODO VISUALIZAÇÃO */
            <>
              <h3 className={`font-semibold text-base mb-1 break-words transition-all ${
                optimisticCompleted && type === 'task' ? 'line-through text-muted-foreground' : 'text-foreground'
              }`}>
                {title}
              </h3>
              {description && (
                <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap break-words">
                  {description}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {!isEditing && (
        <div className="mt-4 flex items-center justify-between pt-2 border-t border-transparent group-hover:border-border transition-colors">
          <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
            {type === 'note' ? 'Nota' : 'Tarefa'}
          </span>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {is_active ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary-muted rounded-md transition-colors"
                  title="Editar"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onMoveToTrash && startTransition(() => onMoveToTrash(id))}
                  disabled={isPending}
                  className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"
                  title="Mover para lixeira"
                >
                  <Trash2 size={16} />
                </button>
              </>
            ) : (
              <>
                <button onClick={() => onRestore && startTransition(() => onRestore(id))} className="p-1.5 text-muted-foreground hover:text-green-500 rounded-md">
                  <RotateCcw size={16} />
                </button>
                <button onClick={() => onHardDelete && startTransition(() => onHardDelete(id))} className="p-1.5 text-muted-foreground hover:text-red-500 rounded-md">
                  <Trash size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
