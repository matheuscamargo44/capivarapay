import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';

export function Header({ activeTab, onSelectTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = useCallback((tab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  }, [onSelectTab]);

  // Tecla Escape fecha o drawer móvel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header role="banner">
      <nav className="floating-nav" aria-label="Navegação principal">
        <a
          href="#"
          className="logo"
          onClick={(e) => { e.preventDefault(); handleNavClick('playground'); }}
          aria-label="Capivara Pay - Página Inicial"
        >
          <span>Capivara<span style={{ color: 'var(--accent-amber)' }}>Pay</span></span>
        </a>

        {/* Desktop Navigation Links - Centered */}
        <ul className="nav-links desktop-only" role="menubar">
          <li role="none">
            <a
              href="#playground"
              role="menuitem"
              aria-current={activeTab === 'playground' ? 'page' : undefined}
              className={activeTab === 'playground' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); handleNavClick('playground'); }}
            >
              Início
            </a>
          </li>
          <li role="none">
            <a
              href="#docs"
              role="menuitem"
              aria-current={activeTab === 'docs' ? 'page' : undefined}
              className={activeTab === 'docs' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); handleNavClick('docs'); }}
            >
              Documentação
            </a>
          </li>
          <li role="none">
            <a
              href="#dashboard"
              role="menuitem"
              aria-current={activeTab === 'dashboard' ? 'page' : undefined}
              className={activeTab === 'dashboard' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); handleNavClick('dashboard'); }}
            >
              Dashboard
            </a>
          </li>
        </ul>

        {/* Desktop Header CTA */}
        <button
          className="btn-nested btn-nested-primary header-cta-btn desktop-only"
          onClick={() => handleNavClick('docs')}
          aria-label="Ir para a documentação da API"
        >
          <span>Documentação da API</span>
          <div className="btn-icon-circle" aria-hidden="true">
            <ArrowUpRight size={14} color="#000" />
          </div>
        </button>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="mobile-menu-toggle mobile-only"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav-drawer"
        >
          {mobileMenuOpen ? <X size={20} color="#ffffff" aria-hidden="true" /> : <Menu size={20} color="#ffffff" aria-hidden="true" />}
        </button>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div id="mobile-nav-drawer" className="mobile-nav-dropdown mobile-only" role="region" aria-label="Menu móvel">
            <a
              href="#playground"
              className={`mobile-nav-item ${activeTab === 'playground' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavClick('playground'); }}
            >
              Início
            </a>
            <a
              href="#docs"
              className={`mobile-nav-item ${activeTab === 'docs' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavClick('docs'); }}
            >
              Documentação
            </a>
            <a
              href="#dashboard"
              className={`mobile-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavClick('dashboard'); }}
            >
              Dashboard
            </a>
            <button
              className="btn-nested btn-nested-primary mobile-dropdown-cta"
              onClick={() => handleNavClick('docs')}
            >
              <span>Documentação da API</span>
              <div className="btn-icon-circle" aria-hidden="true">
                <ArrowUpRight size={14} color="#000" />
              </div>
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
