'use server';

import { prisma } from '../utils/prisma';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

type Card = Prisma.CardGetPayload<{}>;

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
export async function getCards(): Promise<Card[]> {
  const cards = await prisma.card.findMany({
    where: {
      is_active: true, // Traz apenas os itens que não estão na lixeira
    },
    orderBy: [
      {is_pinned: 'desc'},
      {createdAt: 'desc'}, // Ordena dos mais recentes para os mais antigos
    ],
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

// 5. READ TRASH (Buscar todos os cards na lixeira)
export async function getTrashedCards(): Promise<Card[]> {
  const cards = await prisma.card.findMany({
    where: {
      is_active: false, // Traz apenas os itens deletados
    },
    orderBy: {
      updatedAt: 'desc', // Ordena pelos que foram deletados mais recentemente
    },
  });

  return cards;
}

// 6. RESTORE (Tirar da lixeira e voltar para ativo)
export async function restoreFromTrash(id: string) {
  const restoredCard = await prisma.card.update({
    where: { id },
    data: { is_active: true },
  });

  // Revalida todas as rotas para garantir que a interface atualize instantaneamente
  revalidatePath('/lixeira');
  revalidatePath('/');
  revalidatePath('/tarefas');
  
  return restoredCard;
}

// 7. HARD DELETE (Excluir permanentemente do banco)
export async function deletePermanently(id: string) {
  const deletedCard = await prisma.card.delete({
    where: { id },
  });

  revalidatePath('/lixeira');
  return deletedCard;
}

// 8. EMPTY TRASH (Excluir todos os itens da lixeira permanentemente)
export async function emptyTrash() {
  const result = await prisma.card.deleteMany({
    where: { is_active: false },
  });

  revalidatePath('/lixeira');
  return result;
}

export async function updateCard(id: string, data: { title: string; description?: string }) {
  const updatedCard = await prisma.card.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
    },
  });

  revalidatePath('/');
  revalidatePath('/tarefas');
  return updatedCard;
}

export async function togglePin(id: string, currentStatus: boolean) {
  const updatedCard = await prisma.card.update({
    where: { id },
    data: { is_pinned: !currentStatus },
  });

  revalidatePath('/');
  revalidatePath('/tarefas');
  return updatedCard;
}
