import { getCards, toggleTaskCompletion, moveToTrash } from '@/actions/cardActions';
import CreateForm from '../components/CreateForm';
import Card from '../components/Card';

export default async function TarefasPage() {
  // 1. Busca os cards ativos no banco
  const allCards = await getCards();
  
  // 2. Filtra apenas as tarefas
  const tasks = allCards.filter(card => card.type === 'task');

  // Separar tarefas pendentes e concluídas para melhor UX
  const pendingTasks = tasks.filter(task => !task.is_completed);
  const completedTasks = tasks.filter(task => task.is_completed);

  return (
    <div className="flex flex-col gap-8 w-full">
      <CreateForm />
      
      <section>
        {tasks.length === 0 ? (
          <div className="text-center text-muted-foreground mt-12 flex flex-col items-center gap-2">
            <span className="text-4xl">✅</span>
            <p>Nenhuma tarefa na lista. Comece a planejar seu dia!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            
            {/* Grid de Tarefas Pendentes */}
            {pendingTasks.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {pendingTasks.map((task) => (
                  <Card
                    key={task.id}
                    {...task}
                    onToggleCompletion={toggleTaskCompletion}
                    onMoveToTrash={moveToTrash}
                  />
                ))}
              </div>
            )}

            {/* Grid de Tarefas Concluídas (Visualmente separadas) */}
            {completedTasks.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 border-b border-border pb-2">
                  Concluídas ({completedTasks.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 opacity-70">
                  {completedTasks.map((task) => (
                    <Card
                      key={task.id}
                      {...task}
                      onToggleCompletion={toggleTaskCompletion}
                      onMoveToTrash={moveToTrash}
                    />
                  ))}
                </div>
              </div>
            )}
            
          </div>
        )}
      </section>
    </div>
  );
}
