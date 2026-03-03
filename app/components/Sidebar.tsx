'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  StickyNote, 
  CheckSquare, 
  Trash2, 
  Sun, 
  Moon, 
  Menu 
} from 'lucide-react';
import { useTheme } from 'next-themes';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
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

  return (
    <motion.aside
      initial={{ width: isOpen ? 240 : 80 }}
      animate={{ width: isOpen ? 240 : 80 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen bg-surface border-r border-border flex flex-col justify-between overflow-hidden shrink-0"
    >
      <div>
        <div className="h-16 flex items-center px-4">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-hover transition-colors text-muted-foreground"
          >
            <Menu size={24} />
          </button>
        </div>

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
          {isDarkMode ? <Sun size={24} className="shrink-0" /> : <Moon size={24} className="shrink-0" />}
          <motion.span
            animate={{ opacity: isOpen ? 1 : 0, display: isOpen ? 'block' : 'none' }}
            transition={{ duration: 0.2 }}
            className="font-medium whitespace-nowrap"
          >
            {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
          </motion.span>
        </button>
      </div>
    </motion.aside>
  );
}
