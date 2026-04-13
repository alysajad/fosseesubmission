import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Card from '../components/Card';
import Badge from '../components/Badge';
import StateDistribution from '../components/StateDistribution';
import AnimatedContainer from '../components/AnimatedContainer';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function PublicStatsPage({ data }) {
  const user = data?.user;
  const isInstructor = data?.isInstructor;
  const workshops = data?.workshops || [];
  const pagination = data?.pagination || {};

  const typeData = (data?.ws_type || []).map((t, i) => ({
    name: t,
    value: data?.ws_type_count?.[i] || 0
  }));

  const COLORS = ['#0A2540', '#F5A623', '#34C759', '#32ADE6', '#AF52DE', '#FF3B30'];

  return (
    <>
      <NavBar user={user} isInstructor={isInstructor} />
      <main style={{ paddingTop: 'calc(68px + var(--space-6))', paddingBottom: 'var(--space-8)', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
        <AnimatedContainer className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 var(--space-4)' }}>
          <h1 style={{ fontFamily: 'Sora', fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-1)' }}>Dashboard</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>Overview of FOSSEE Workshops</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
            <Card hover={false}>
              <h3 style={{ fontSize: 'var(--text-md)', marginBottom: 'var(--space-4)' }}>Workshops by State</h3>
              <StateDistribution states={data?.ws_states || []} counts={data?.ws_count || []} />
            </Card>

            <Card hover={false}>
              <h3 style={{ fontSize: 'var(--text-md)', marginBottom: 'var(--space-4)' }}>Workshops by Type</h3>
              <div style={{ width: '100%', height: 400 }}>
                {typeData.length > 0 ? (
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={typeData} cx="50%" cy="50%" innerRadius={80} outerRadius={130} paddingAngle={2} dataKey="value">
                        {typeData.map((e, i) => <Cell key={`c-${i}`} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 'var(--radius-md)', border: 'none', boxShadow: 'var(--shadow-modal)' }} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ padding: 'var(--space-5)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>No type data available.</div>
                )}
              </div>
            </Card>
          </div>

          <Card hover={false}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
              <h3 style={{ fontSize: 'var(--text-md)' }}>Recent Workshops</h3>
              <a href="?download=download" style={{ color: 'var(--color-info)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Download CSV</a>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-divider)', color: 'var(--color-text-secondary)' }}>
                    <th style={{ padding: 'var(--space-3) var(--space-2)' }}>Director</th>
                    <th style={{ padding: 'var(--space-3) var(--space-2)' }}>Institute</th>
                    <th style={{ padding: 'var(--space-3) var(--space-2)' }}>Instructor</th>
                    <th style={{ padding: 'var(--space-3) var(--space-2)' }}>Type</th>
                    <th style={{ padding: 'var(--space-3) var(--space-2)' }}>Date</th>
                    <th style={{ padding: 'var(--space-3) var(--space-2)' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {workshops.map(w => (
                    <tr key={w.id} style={{ borderBottom: '1px solid var(--color-divider)' }}>
                      <td style={{ padding: 'var(--space-3) var(--space-2)', fontWeight: 500 }}>{w.coordinatorName}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-2)' }}>{w.institute}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-2)' }}>{w.instructorName || '—'}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-2)' }}>{w.workshopType}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-2)', whiteSpace: 'nowrap' }}>{w.date}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-2)' }}>
                        <Badge variant={w.status === 'Success' ? 'success' : w.status === 'Pending' ? 'warning' : 'error'}>{w.status}</Badge>
                      </td>
                    </tr>
                  ))}
                  {!workshops.length && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-5)', color: 'var(--color-text-secondary)' }}>No workshops found.</td></tr>}
                </tbody>
              </table>
            </div>
            
            {(pagination.hasPrev || pagination.hasNext) && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-5)' }}>
                {pagination.hasPrev && <a href={`?page=${pagination.currentPage - 1}`} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>&larr; Previous</a>}
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Page {pagination.currentPage} of {pagination.totalPages}</span>
                {pagination.hasNext && <a href={`?page=${pagination.currentPage + 1}`} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>Next &rarr;</a>}
              </div>
            )}
          </Card>
        </AnimatedContainer>
      </main>
      <Footer />
    </>
  );
}
