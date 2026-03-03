'use client';

import { Menu, Search } from 'lucide-react';

interface TopbarProps {
  toggleSidebar: () => void;
}

export default function Topbar({ toggleSidebar }: TopbarProps) {
  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-border bg-surface/90 backdrop-blur-md shrink-0 sticky top-0 z-10">
      
      {/* Esquerda: Botão Menu e Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-hover transition-colors text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label="Alternar menu lateral"
        >
          <Menu size={24} />
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center shadow-sm">
            <span className="text-primary-foreground font-bold text-lg leading-none">S</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground hidden sm:block">
            TasksApp
          </h1>
        </div>
      </div>

      {/* Direita: Avatar do Usuário */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-full bg-linear-to-tr from-primary to-blue-400 flex items-center justify-center text-primary-foreground font-bold shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
          U
        </div>
      </div>

    </header>
  );
}
