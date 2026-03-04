'use client';

import { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2, RotateCcw, Trash, Pin, Edit2, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export interface CardProps {
  id: string;
  title: string;
  description?: string | null;
  type: string;
  is_active: boolean;
  is_completed: boolean;
  is_pinned: boolean;
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

  const handleToggle = () => {
    if (!onToggleCompletion) return;
    
    setOptimisticCompleted(!optimisticCompleted);
    
    startTransition(async () => {
      try {
        await onToggleCompletion(id, optimisticCompleted);
      } catch (error) {
        toast.error("Erro ao atualizar tarefa");
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
    toast.success(`${type === 'note' ? 'Nota' : 'Tarefa'} atualizada com sucesso!`);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditTitle(title);
    setEditDescription(description || '');
  };

  const handleTrash = () => {
    if (!onMoveToTrash) return;

    startTransition(async () => {
      try {
        await onMoveToTrash(id);
        
        if (onRestore) {
          // Toast com opção de desfazer
          toast((t) => (
            <div className="flex items-center justify-between gap-4 w-full">
              <span className="text-sm font-medium text-black">
                {type === 'note' ? 'Nota' : 'Tarefa'} movida para a lixeira.
              </span>
              <button
                onClick={async () => {
                  toast.dismiss(t.id);
                  startTransition(async () => {
                    await onRestore(id);
                    toast.success("Ação desfeita com sucesso!");
                  });
                }}
                className="text-sm font-bold text-primary hover:text-primary/80 transition-colors"
              >
                Desfazer
              </button>
            </div>
          ), { duration: 5000 });
        } else {
          toast.success(`${type === 'note' ? 'Nota' : 'Tarefa'} movida para a lixeira.`);
        }
        
      } catch (error) {
        console.error("Erro ao mover para lixeira:", error);
        toast.error("Erro ao excluir o item.");
      }
    });
  };

  const handleRestore = () => {
    if (!onRestore) return;
    startTransition(async () => {
      try {
        await onRestore(id);
        toast.success(`${type === 'note' ? 'Nota' : 'Tarefa'} restaurada com sucesso!`);
      } catch (error) {
        toast.error("Erro ao restaurar o item.");
      }
    });
  };

  const handleHardDelete = () => {
    if (!onHardDelete) return;
    const isConfirmed = window.confirm(
      "Tem certeza que deseja excluir permanentemente este item? Esta ação não pode ser desfeita."
    );

    if (!isConfirmed) return;

    startTransition(async () => {
      try {
        await onHardDelete(id);
        toast.success("Item excluído permanentemente.");
      } catch (error) {
        toast.error("Erro ao excluir o item.");
      }
    });
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
      {/* Botão de Fixar */}
      {is_active && !isEditing && (
        <button
          onClick={handlePin}
          disabled={isPending}
          className={`absolute top-3 right-3 p-1.5 rounded-full transition-all ${
            optimisticPinned ? 'text-primary bg-primary-muted' : 'text-muted-foreground hover:bg-hover'
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
              <h3 className={`font-semibold text-base mb-1 wrap-break-word transition-all ${
                optimisticCompleted && type === 'task' ? 'line-through text-muted-foreground' : 'text-foreground'
              }`}>
                {title}
              </h3>
              {description && (
                <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap wrap-break-word">
                  {description}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {!isEditing && (
        <div className="mt-4 flex items-center justify-between pt-2 border-t border-border transition-colors">
          <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider">
            {type === 'note' ? 'Nota' : 'Tarefa'}
          </span>

          <div className="flex items-center gap-2">
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
                  onClick={handleTrash}
                  disabled={isPending}
                  className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"
                  title="Mover para lixeira"
                >
                  <Trash2 size={16} />
                </button>
              </>
            ) : (
              <>
                <button onClick={handleRestore} className="p-1.5 text-muted-foreground hover:text-green-500 rounded-md">
                  <RotateCcw size={16} />
                </button>
                <button onClick={handleHardDelete} className="p-1.5 text-muted-foreground hover:text-red-500 rounded-md">
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
