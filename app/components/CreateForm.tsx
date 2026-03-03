'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createCard } from '@/actions/cardActions';
import { Loader2, Plus } from 'lucide-react';

export default function CreateForm() {
  const pathname = usePathname();
  const formRef = useRef<HTMLFormElement | null>(null);
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPending, startTransition] = useTransition();

  // 1. Inferência de Rota: Decide o tipo automaticamente
  const cardType = pathname === '/tarefas' ? 'task' : 'note';

  // 2. UX: Fechar o formulário ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  // 3. Oculta o formulário na Lixeira 
  if (pathname === '/lixeira') {
    return null;
  }

  // 4. Submissão do Formulário
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;

    startTransition(async () => {
      try {
        await createCard({
          title: title.trim(),
          description: description.trim(),
          type: cardType,
        });
        
        // Reseta o formulário após sucesso
        setTitle('');
        setDescription('');
        setIsExpanded(false);
      } catch (error) {
        console.error("Erro ao criar card:", error);
      }
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 relative z-10">
      <AnimatePresence initial={false} mode="wait">
        {!isExpanded ? (
          /* ESTADO CONTRAÍDO */
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsExpanded(true)}
            className="w-full p-4 rounded-xl border border-border bg-surface shadow-sm hover:shadow-md cursor-text flex items-center gap-3 transition-shadow"
          >
            <Plus className="text-muted-foreground" size={20} />
            <span className="text-muted-foreground font-medium">
              Criar {cardType === 'task' ? 'nova tarefa' : 'nova nota'}...
            </span>
          </motion.div>
        ) : (
          /* ESTADO EXPANDIDO */
          <motion.form
            key="expanded"
            ref={formRef}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full rounded-xl border border-border bg-surface shadow-lg overflow-hidden flex flex-col"
          >
            <input
              autoFocus
              type="text"
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-4 text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground text-foreground"
            />
            
            <textarea
              placeholder={cardType === 'task' ? 'Detalhes da tarefa...' : 'Escreva sua nota aqui...'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 pb-4 resize-none bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground text-foreground text-sm"
            />

            <div className="flex items-center justify-between p-3 bg-background/50 border-t border-border">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide px-2">
                {cardType === 'task' ? 'Tarefa' : 'Nota'}
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-hover rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending || !title.trim()}
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Salvando
                    </>
                  ) : (
                    'Adicionar'
                  )}
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
