import React, { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';

export function Header({ activeTab, onSelectTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header>
      <div className="floating-nav">
        <a
          href="#"
          className="logo"
          onClick={(e) => { e.preventDefault(); handleNavClick('playground'); }}
        >
          <span>Capivara<span style={{ color: 'var(--accent-amber)' }}>Pay</span></span>
        </a>

        {/* Desktop Navigation Links - Centered */}
        <ul className="nav-links desktop-only">
          <li>
            <a
              href="#playground"
              className={activeTab === 'playground' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); handleNavClick('playground'); }}
            >
              Início
            </a>
          </li>
          <li>
            <a
              href="#docs"
              className={activeTab === 'docs' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); handleNavClick('docs'); }}
            >
              Documentação
            </a>
          </li>
          <li>
            <a
              href="#dashboard"
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
        >
          <span>Documentação da API</span>
          <div className="btn-icon-circle">
            <ArrowUpRight size={14} color="#000" />
          </div>
        </button>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="mobile-menu-toggle mobile-only"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Abrir menu de navegação"
        >
          {mobileMenuOpen ? <X size={20} color="#ffffff" /> : <Menu size={20} color="#ffffff" />}
        </button>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-nav-dropdown mobile-only">
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
              <div className="btn-icon-circle">
                <ArrowUpRight size={14} color="#000" />
              </div>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
