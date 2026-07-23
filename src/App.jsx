import React, { useState } from 'react';
import { Header } from './components/Header';
import { PixWidget } from './components/PixWidget';
import { CodePlayground } from './components/CodePlayground';
import { BentoFeatures } from './components/BentoFeatures';
import { DeveloperDashboard } from './components/DeveloperDashboard';
import { ApiDocs } from './components/ApiDocs';
import { useTransactions } from './hooks/useTransactions';
import { ArrowRight, BookOpen } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('playground');
  const [amount, setAmount] = useState(29.90);

  const { transactions, totalVolume, totalCount, refetch: refetchTransactions } = useTransactions();

  return (
    <div>
      <Header activeTab={activeTab} onSelectTab={setActiveTab} />

      <main>
        {activeTab === 'docs' && (
          <ApiDocs />
        )}

        {activeTab === 'dashboard' && (
          <DeveloperDashboard
            transactions={transactions}
            totalVolume={totalVolume}
            totalCount={totalCount}
            onRefresh={refetchTransactions}
          />
        )}

        {activeTab === 'playground' && (
          <div>
            <section className="hero">
              <h1>
                O gateway Pix <span>para desenvolvedores</span>
              </h1>
              <p>
                Integre pagamentos Pix no seu site ou SaaS em 2 linhas de código com confirmação via webhook em tempo real.
              </p>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '3rem' }}>
                <button className="btn-nested btn-nested-primary" onClick={() => setActiveTab('docs')}>
                  <span>Ver documentação</span>
                  <div className="btn-icon-circle">
                    <BookOpen size={14} color="#000" />
                  </div>
                </button>
                <button className="btn-nested btn-nested-outline" onClick={() => setActiveTab('dashboard')}>
                  <span>Abrir dashboard</span>
                  <div className="btn-icon-circle">
                    <ArrowRight size={14} />
                  </div>
                </button>
              </div>
            </section>

            <div className="grid-2" style={{ marginBottom: '4rem' }}>
              <CodePlayground />
              <PixWidget amount={amount} />
            </div>

            <BentoFeatures onSelectDocs={() => setActiveTab('docs')} />
          </div>
        )}
      </main>
    </div>
  );
}
