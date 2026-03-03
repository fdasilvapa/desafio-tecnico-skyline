'use server';

import { prisma } from '../utils/prisma';
import { revalidatePath } from 'next/cache';

// 1. CREATE (Criar nova nota ou tarefa)
export async function createCard(data: { title: string; description?: string; type: string }) {
  if (!data.title) {
    throw new Error('O título é obrigatório.');
  }

  const newCard = await prisma.card.create({
    data: {
      title: data.title,
      description: data.description,
      type: data.type || 'note',
    },
  });

  // Força o Next.js a limpar o cache e atualizar a interface na página inicial
  revalidatePath('/'); 
  
  return newCard;
}

// 2. READ (Buscar todos os cards ativos)
export async function getCards() {
  const cards = await prisma.card.findMany({
    where: {
      is_active: true, // Traz apenas os itens que não estão na lixeira
    },
    orderBy: {
      createdAt: 'desc', // Ordena dos mais recentes para os mais antigos
    },
  });

  return cards;
}

// 3. UPDATE (Atualizar status de conclusão de uma tarefa)
export async function toggleTaskCompletion(id: string, currentStatus: boolean) {
  const updatedCard = await prisma.card.update({
    where: { id },
    data: { is_completed: !currentStatus },
  });

  revalidatePath('/');
  return updatedCard;
}

// 4. DELETE (Soft Delete - Enviar para a lixeira)
export async function moveToTrash(id: string) {
  const trashedCard = await prisma.card.update({
    where: { id },
    data: { is_active: false },
  });

  revalidatePath('/');
  return trashedCard;
}
