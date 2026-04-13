import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/tokens.css';
import './styles/global.css';

// Lazy load pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ActivationPage = lazy(() => import('./pages/ActivationPage'));
const LogoutPage = lazy(() => import('./pages/LogoutPage'));
const WorkshopTypesPage = lazy(() => import('./pages/WorkshopTypesPage'));
const WorkshopTypeDetailPage = lazy(() => import('./pages/WorkshopTypeDetailPage'));
const WorkshopDetailPage = lazy(() => import('./pages/WorkshopDetailPage'));
const ProposeWorkshopPage = lazy(() => import('./pages/ProposeWorkshopPage'));
const CoordinatorDashPage = lazy(() => import('./pages/CoordinatorDashPage'));
const InstructorDashPage = lazy(() => import('./pages/InstructorDashPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AddWorkshopTypePage = lazy(() => import('./pages/AddWorkshopTypePage'));
const EditWorkshopTypePage = lazy(() => import('./pages/EditWorkshopTypePage'));
const PasswordChangePage = lazy(() => import('./pages/PasswordChangePage'));
const PasswordResetPage = lazy(() => import('./pages/PasswordResetPage'));
const PublicStatsPage = lazy(() => import('./pages/PublicStatsPage'));
const TeamStatsPage = lazy(() => import('./pages/TeamStatsPage'));

function PageSkeleton() {
  return (
    <div className="page-skeleton" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div style={{
        width: '40px', height: '40px',
        border: '3px solid #D0D8E4', borderTopColor: '#0A2540',
        borderRadius: '50%', animation: 'spin 700ms linear infinite'
      }} />
    </div>
  );
}

const root = document.getElementById('react-root');
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <BrowserRouter>
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/workshop/login/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/workshop/register/" element={<RegisterPage />} />
            <Route path="/activate" element={<ActivationPage />} />
            <Route path="/workshop/activate_user/" element={<ActivationPage />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="/workshop/logout/" element={<LogoutPage />} />
            <Route path="/workshop-types" element={<WorkshopTypesPage />} />
            <Route path="/workshop-types/:id" element={<WorkshopTypeDetailPage />} />
            <Route path="/workshop/:id" element={<WorkshopDetailPage />} />
            <Route path="/propose" element={<ProposeWorkshopPage />} />
            <Route path="/workshop/propose/" element={<ProposeWorkshopPage />} />
            <Route path="/coordinator" element={<CoordinatorDashPage />} />
            <Route path="/workshop/status" element={<CoordinatorDashPage />} />
            <Route path="/instructor" element={<InstructorDashPage />} />
            <Route path="/workshop/dashboard" element={<InstructorDashPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/add-workshop-type" element={<AddWorkshopTypePage />} />
            <Route path="/edit-workshop-type/:id" element={<EditWorkshopTypePage />} />
            <Route path="/password-change" element={<PasswordChangePage />} />
            <Route path="/password-reset" element={<PasswordResetPage />} />
            <Route path="/stats" element={<PublicStatsPage />} />
            <Route path="/team-stats" element={<TeamStatsPage />} />
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </React.StrictMode>
  );
}
