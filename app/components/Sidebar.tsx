'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  StickyNote, 
  CheckSquare, 
  Trash2, 
  Sun, 
  Moon 
} from 'lucide-react';
import { useTheme } from 'next-themes';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
  onNavigate: () => void;
}

export default function Sidebar({ isOpen, isMobile, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false); 

  const navItems = [
    { name: 'Notas', href: '/', icon: StickyNote },
    { name: 'Tarefas', href: '/tarefas', icon: CheckSquare },
    { name: 'Lixeira', href: '/lixeira', icon: Trash2 },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed top-0 left-0 h-screen w-[260px] bg-surface border-r border-border flex flex-col justify-between overflow-hidden z-50 shadow-xl"
          >
            <div>
              <nav className="mt-4 flex flex-col gap-2 px-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onNavigate}
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${
                        isActive 
                          ? 'bg-primary-muted text-primary' 
                          : 'text-muted-foreground hover:bg-hover'
                      }`}
                    >
                      <Icon size={24} className="shrink-0" />
                      <span className="font-medium whitespace-nowrap">
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="p-4 border-t border-border">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-muted-foreground hover:bg-hover transition-colors"
              >
                {mounted ? (
                  isDarkMode ? <Sun size={24} className="shrink-0" /> : <Moon size={24} className="shrink-0" />
                ) : (
                  <div className="w-6 h-6 shrink-0" />
                )}
                <span className="font-medium whitespace-nowrap">
                  {mounted ? (isDarkMode ? 'Modo Claro' : 'Modo Escuro') : 'Carregando...'}
                </span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    );
  }

  return (
    <motion.aside
      initial={{ width: isOpen ? 240 : 80 }}
      animate={{ width: isOpen ? 240 : 80 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen bg-surface border-r border-border flex flex-col justify-between overflow-hidden shrink-0"
    >
      <div>
        <nav className="mt-4 flex flex-col gap-2 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-primary-muted text-primary' 
                    : 'text-muted-foreground hover:bg-hover'
                }`}
              >
                <Icon size={24} className="shrink-0" />
                <motion.span 
                  animate={{ opacity: isOpen ? 1 : 0, display: isOpen ? 'block' : 'none' }}
                  transition={{ duration: 0.2 }}
                  className="font-medium whitespace-nowrap"
                >
                  {item.name}
                </motion.span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-muted-foreground hover:bg-hover transition-colors"
        >
          {mounted ? (
            isDarkMode ? <Sun size={24} className="shrink-0" /> : <Moon size={24} className="shrink-0" />
          ) : (
            <div className="w-6 h-6 shrink-0" />
          )}
          <motion.span
            animate={{ opacity: isOpen ? 1 : 0, display: isOpen ? 'block' : 'none' }}
            transition={{ duration: 0.2 }}
            className="font-medium whitespace-nowrap"
          >
            {mounted ? (isDarkMode ? 'Modo Claro' : 'Modo Escuro') : 'Carregando...'}
          </motion.span>
        </button>
      </div>
    </motion.aside>
  );
}
