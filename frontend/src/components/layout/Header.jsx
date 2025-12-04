import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Activity, Shield } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Inicio' },
    { path: '/modelo', label: 'Modelo' },
    { path: '/proceso', label: 'Analizar' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img
              src="/uploads/logo.png"
              alt="RetinaVision AI Logo"
              className="h-10 w-10 object-contain"
            />
            <div className="flex flex-col">
              <span className="font-bold text-base text-gray-900 leading-none">
                RetinaVision AI
              </span>
              <span className="text-[10px] text-gray-500 leading-none">
                Detección Inteligente
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  size="sm"
                  className={isActive(item.path) ? "shadow-md" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          <Link to="/admin">
            <Button variant="outline" size="sm" className="gap-1.5 shadow-sm hover:shadow-md transition-shadow">
              <Shield className="h-3.5 w-3.5" />
              Admin
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
