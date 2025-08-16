import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, CheckSquare } from 'lucide-react';
import styles from './DesktopHeader.module.scss';

const DesktopHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <img 
            src="/assets/img/LogoTodo.png" 
            alt="PetalStack Logo" 
            className={styles.logoLight}
            width={32}
            height={32}
          />
          <img 
            src="/assets/img/LogoTodo.png" 
            alt="PetalStack Logo" 
            className={styles.logoDark}
            width={32}
            height={32}
          />
          <span>Todo App</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          <Link 
            to="/" 
            className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/todos" 
            className={`${styles.navLink} ${isActive('/todos') ? styles.active : ''} ${styles.todoLink}`}
          >
            <CheckSquare size={16} />
            Todo App
          </Link>

        </nav>

        {/* Mobile Menu Button */}
        <button 
          className={styles.mobileMenuButton}
          onClick={toggleMenu}
          aria-label="Toggle mobile menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation */}
        <div className={`${styles.mobileNav} ${isMenuOpen ? styles.open : ''}`}>
          <div className={styles.mobileNavContent}>
            <Link 
              to="/" 
              className={`${styles.mobileNavLink} ${isActive('/') ? styles.active : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/todos" 
              className={`${styles.mobileNavLink} ${isActive('/todos') ? styles.active : ''} ${styles.todoLink}`}
            >
              <CheckSquare size={16} />
              Todo App
            </Link>

          </div>
        </div>
      </div>
    </header>
  );
};

export { DesktopHeader };
