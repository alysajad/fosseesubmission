import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StateDistribution({ states, counts }) {
  const data = states.map((state, i) => ({
    name: state,
    workshops: counts[i] || 0
  })).sort((a, b) => b.workshops - a.workshops);

  if (!data.length) return <div style={{ padding: 'var(--space-5)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>No regional data available yet.</div>

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-divider)" />
          <XAxis type="number" stroke="var(--color-text-secondary)" fontSize={12} />
          <YAxis dataKey="name" type="category" width={120} stroke="var(--color-text-secondary)" fontSize={12} tick={{fill: 'var(--color-text-secondary)'}} />
          <Tooltip 
            cursor={{fill: 'rgba(10,37,64,0.04)'}} 
            contentStyle={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--color-divider)', boxShadow: 'var(--shadow-modal)' }}
          />
          <Bar dataKey="workshops" fill="var(--color-accent)" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
