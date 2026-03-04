import { getCards, toggleTaskCompletion, moveToTrash, restoreFromTrash, updateCard, togglePin } from '@/actions/cardActions';
import CreateForm from './components/CreateForm';
import Card from './components/Card';
import { Card as PrismaCard } from '@prisma/client';

export default async function Home() {
  // 1. READ: Busca os cards do banco
  const allCards = await getCards();

  const notes = allCards.filter(card => card.type === 'note');

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Formulário Inteligente (já sabe que vai criar uma 'note' pela URL) */}
      <CreateForm />
      
      {/* Container das Notas */}
      <section>
        {notes.length === 0 ? (
          <div className="text-center text-muted-foreground mt-12 flex flex-col items-center gap-2">
            <span className="text-4xl">📝</span>
            <p>Nenhuma nota criada ainda. Que tal criar uma?</p>
          </div>
        ) : (
          // Grid responsivo: 1 coluna no celular, 2 no tablet, 3-4 no desktop
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {notes.map((note: PrismaCard) => (
              <Card
                key={note.id}
                {...note}
                // Passando as Server Actions como props para o Client Component
                onToggleCompletion={toggleTaskCompletion}
                onMoveToTrash={moveToTrash}
                onRestore={restoreFromTrash}
                onUpdate={updateCard}
                onTogglePin={togglePin}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
