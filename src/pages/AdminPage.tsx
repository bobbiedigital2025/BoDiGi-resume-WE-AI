import React from 'react';
import { useBackgroundService } from '../AppBackgroundProvider';
import AdminResearchChat from '../features/admin/AdminResearchChat';

const AdminPage: React.FC = () => {
  const { isAdmin } = useBackgroundService();

  if (!isAdmin) {
    return (
      <div style={{ color: 'red', marginTop: 32 }}>
        <strong>Access denied.</strong> This page is for admin only.
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin Dashboard</h1>
      <AdminResearchChat />
    </div>
  );
};

export default AdminPage;
