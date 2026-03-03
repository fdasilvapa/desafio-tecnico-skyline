import { createCard, getCards } from '@/actions/cardActions';

export default async function Home() {
  // 1. READ: Busca os cards do banco toda vez que a página carrega
  const cards = await getCards();

  // 2. CREATE: Action que será disparada pelo formulário
  async function handleCreate(formData: FormData) {
    'use server'; // Garante que roda no servidor
    
    const title = formData.get('title') as string;
    
    // Chama a função que criamos no arquivo actions/card.ts
    await createCard({ 
      title, 
      description: 'Descrição de teste gerada pelo form', 
      type: 'note' 
    });
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Teste do Banco de Dados - Skyline</h1>
      
      {/* Formulário de Teste */}
      <form action={handleCreate} style={{ margin: '2rem 0' }}>
        <input 
          type="text" 
          name="title" 
          placeholder="Digite o título do card..." 
          required 
          style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button 
          type="submit" 
          style={{ marginLeft: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
        >
          Salvar no MongoDB
        </button>
      </form>

      <hr />

      {/* Lista de Teste */}
      <h2>Cards no Banco ({cards.length}):</h2>
      <ul>
        {cards.map((card) => (
          <li key={card.id} style={{ marginBottom: '1rem' }}>
            <strong>{card.title}</strong> <br/>
            <small>ID: {card.id}</small> <br/>
            <small>Criado em: {card.createdAt.toLocaleDateString()}</small>
          </li>
        ))}
      </ul>
    </main>
  );
}
