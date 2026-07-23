import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export function Header({ activeTab, onSelectTab }) {
  return (
    <header>
      <div className="floating-nav">
        <a
          href="#"
          className="logo"
          onClick={(e) => { e.preventDefault(); onSelectTab('playground'); }}
        >
          <span>Capivara<span style={{ color: 'var(--accent-amber)' }}>Pay</span></span>
        </a>

        <ul className="nav-links">
          <li>
            <a
              href="#playground"
              className={activeTab === 'playground' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); onSelectTab('playground'); }}
            >
              Início
            </a>
          </li>
          <li>
            <a
              href="#docs"
              className={activeTab === 'docs' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); onSelectTab('docs'); }}
            >
              Documentação
            </a>
          </li>
          <li>
            <a
              href="#dashboard"
              className={activeTab === 'dashboard' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); onSelectTab('dashboard'); }}
            >
              Dashboard
            </a>
          </li>
        </ul>

        <button
          className="btn-nested btn-nested-primary"
          onClick={() => onSelectTab('docs')}
        >
          <span>Documentação da API</span>
          <div className="btn-icon-circle">
            <ArrowUpRight size={14} color="#000" />
          </div>
        </button>
      </div>
    </header>
  );
}
