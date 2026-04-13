import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Card from '../components/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TeamStatsPage({ data }) {
  const user = data?.user;
  const isInstructor = data?.isInstructor;
  const teamLabels = data?.team_labels || [];
  const wsCount = data?.ws_count || [];
  const allTeams = data?.all_teams || [];
  const currentTeamId = data?.team_id;

  const chartData = teamLabels.map((l, i) => ({
    name: l,
    workshops: wsCount[i] || 0
  })).sort((a, b) => b.workshops - a.workshops);

  return (
    <>
      <NavBar user={user} isInstructor={isInstructor} />
      <main style={{ paddingTop: 'calc(68px + var(--space-6))', paddingBottom: 'var(--space-8)', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            <div>
              <h1 style={{ fontFamily: 'Sora', fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-1)' }}>Team Statistics</h1>
              <p style={{ color: 'var(--color-text-secondary)' }}>Instructor workflow tracking</p>
            </div>
            {allTeams.length > 1 && (
              <select 
                value={currentTeamId} 
                onChange={(e) => window.location.href = `/statistics/team/${e.target.value}`}
                style={{ padding: 'var(--space-2) var(--space-3)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
              >
                {allTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            )}
          </div>

          <Card hover={false}>
            <h3 style={{ fontSize: 'var(--text-md)', marginBottom: 'var(--space-5)' }}>Workshops taken by member</h3>
            <div style={{ height: 500, width: '100%' }}>
              {chartData.length > 0 ? (
                <ResponsiveContainer>
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-divider)" />
                    <XAxis dataKey="name" stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} />
                    <YAxis stroke="var(--color-text-secondary)" fontSize={12} tickLine={false} allowDecimals={false} />
                    <Tooltip 
                      cursor={{fill: 'rgba(10,37,64,0.04)'}} 
                      contentStyle={{ borderRadius: 'var(--radius-md)', border: 'none', boxShadow: 'var(--shadow-modal)' }}
                    />
                    <Bar dataKey="workshops" fill="var(--color-primary)" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ padding: 'var(--space-5)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>No team data available.</div>
              )}
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
