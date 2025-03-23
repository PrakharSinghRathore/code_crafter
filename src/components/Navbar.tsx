import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code, Home, Clock, Brain, BookOpen, Menu, X, Settings, LogIn, LogOut, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ThemeSwitcher from './ThemeSwitcher';

const Navbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, generationsRemaining } = useAuth();

  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="w-4 h-4 mr-2" /> },
    { name: 'Complexity Analysis', path: '/complexity-analysis', icon: <Clock className="w-4 h-4 mr-2" /> },
    { name: 'Code Generation', path: '/code-generation', icon: <Code className="w-4 h-4 mr-2" /> },
    { name: 'Component Generator', path: '/component-generator', icon: <Code className="w-4 h-4 mr-2" /> },
    { name: 'Problem Solving', path: '/problem-solving', icon: <Brain className="w-4 h-4 mr-2" /> },
    { name: 'Practice', path: '/practice', icon: <BookOpen className="w-4 h-4 mr-2" /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/">
              <div className="flex items-center space-x-2">
                <Code className="h-8 w-8 text-primary" />
                <span className="font-semibold text-lg">CodeCatalyst</span>
              </div>
            </Link>
          </div>

          {!isMobile && (
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
              
              <ThemeSwitcher />
              
              {user && generationsRemaining !== Infinity && (
                <div className="px-3 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200 rounded-full text-xs font-medium">
                  {generationsRemaining} generations left
                </div>
              )}
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                        <AvatarFallback>
                          {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      {user.displayName || user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="flex items-center text-red-600 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild variant="default" size="sm">
                  <Link to="/login" className="flex items-center">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </Button>
              )}
            </div>
          )}

          <div className="md:hidden flex items-center space-x-2">
            <ThemeSwitcher />
            
            {user ? (
              <Button variant="ghost" size="icon" className="rounded-full mr-2" asChild>
                <Link to="/settings">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                    <AvatarFallback>
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </Button>
            ) : (
              <Button asChild variant="default" size="sm" className="mr-2">
                <Link to="/login">
                  <LogIn className="h-4 w-4" />
                </Link>
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {isMobile && (
        <motion.div
          className={`md:hidden overflow-hidden ${isMenuOpen ? 'block' : 'hidden'}`}
          initial={{ height: 0, opacity: 0 }}
          animate={isMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            
            {user && (
              <>
                <Link
                  to="/settings"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
                
                <button
                  onClick={logout}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 w-full text-left"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
