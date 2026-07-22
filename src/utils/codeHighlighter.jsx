import React from 'react';

export function HighlightedCode({ code, lang = 'javascript' }) {
  if (!code) return null;

  if (lang === 'curl' || lang === 'bash') {
    const lines = code.split('\n');
    return (
      <span>
        {lines.map((line, idx) => {
          if (line.trim().startsWith('curl')) {
            return (
              <div key={idx}>
                <span style={{ color: '#61afef', fontWeight: 'bold' }}>curl</span>
                {line.substring(4)}
              </div>
            );
          }
          if (line.trim().startsWith('-H')) {
            const parts = line.split('-H');
            return (
              <div key={idx}>
                <span>{parts[0]}</span>
                <span style={{ color: '#e5c07b' }}>-H</span>
                <span style={{ color: '#98c379' }}>{parts.slice(1).join('-H')}</span>
              </div>
            );
          }
          if (line.trim().startsWith('-d')) {
            return (
              <div key={idx}>
                <span style={{ color: '#e5c07b' }}>-d</span>
                <span style={{ color: '#98c379' }}>{line.substring(line.indexOf('-d') + 2)}</span>
              </div>
            );
          }
          return <div key={idx}>{line}</div>;
        })}
      </span>
    );
  }

  const lines = code.split('\n');

  return (
    <span>
      {lines.map((line, idx) => {
        if (line.trim().startsWith('//') || line.trim().startsWith('#')) {
          return (
            <div key={idx} style={{ color: '#5c6370', fontStyle: 'italic' }}>
              {line}
            </div>
          );
        }

        return (
          <div key={idx}>
            {line.split(/(\s+|['"`].*?['"`]|[{}\[\]();,:.=])/).map((token, tIdx) => {
              if (!token) return null;

              if (['import', 'from', 'const', 'let', 'var', 'new', 'await', 'async', 'function', 'return', 'def', 'class'].includes(token)) {
                return <span key={tIdx} style={{ color: '#c678dd', fontWeight: 'bold' }}>{token}</span>;
              }

              if (token.startsWith("'") || token.startsWith('"') || token.startsWith('`')) {
                return <span key={tIdx} style={{ color: '#98c379' }}>{token}</span>;
              }

              if (!isNaN(token) && token.trim() !== '') {
                return <span key={tIdx} style={{ color: '#d19a66' }}>{token}</span>;
              }

              if (['CapivaraPay', 'Capivara', 'Promise'].includes(token)) {
                return <span key={tIdx} style={{ color: '#e5c07b', fontWeight: 'bold' }}>{token}</span>;
              }

              if (['create', 'pix', 'log', 'get', 'post', 'usePixCharge'].includes(token)) {
                return <span key={tIdx} style={{ color: '#61afef' }}>{token}</span>;
              }

              if (['amount', 'description', 'correlation_id', 'currency', 'status'].includes(token)) {
                return <span key={tIdx} style={{ color: '#e06c75' }}>{token}</span>;
              }

              return <span key={tIdx}>{token}</span>;
            })}
          </div>
        );
      })}
    </span>
  );
}
