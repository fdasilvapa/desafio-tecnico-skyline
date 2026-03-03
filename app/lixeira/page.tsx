import { getTrashedCards, restoreFromTrash, deletePermanently } from '@/actions/cardActions';
import Card from '../components/Card';
import { Trash2 } from 'lucide-react';
import EmptyTrashButton from '../components/EmptyTrashButton';

export default async function LixeiraPage() {
  // 1. Busca apenas os cards que estão com is_active: false
  const trashedCards = await getTrashedCards();

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex items-center justify-between">
        {/* Cabeçalho da Lixeira */}
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <Trash2 className="text-muted-foreground" size={28} />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Lixeira</h1>
            <p className="text-sm text-muted-foreground mt-1">
            Itens aqui podem ser restaurados ou excluídos permanentemente.
          </p>
        </div>

      </div>
      {/* Botão de esvaziar lixeira, aparece apenas se houver itens */}
      {trashedCards.length > 0 && <EmptyTrashButton />}
      </div>

      {/* Container dos Cards Deletados */}
      <section>
        {trashedCards.length === 0 ? (
          <div className="text-center text-muted-foreground mt-12 flex flex-col items-center gap-2">
            <span className="text-4xl">🍃</span>
            <p>Sua lixeira está vazia.</p>
          </div>
        ) : (
          /* Adicionamos uma opacidade e filtro de escala de cinza para reforçar a ideia de "lixeira" */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 opacity-80 grayscale-20 hover:grayscale-0 transition-all duration-500">
            {trashedCards.map((card) => (
              <Card
                key={card.id}
                {...card}
                // Passamos as novas actions específicas da lixeira
                onRestore={restoreFromTrash}
                onHardDelete={deletePermanently}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
