import React from 'react';
import DashboardPage from './DashboardPage';

// Preview wrapper that provides a mock user to bypass auth
const mockUser = {
  displayName: 'Aryan',
  email: 'aryan@Nexus Ayurve.com',
  uid: 'preview-user',
  photoURL: null,
} as any;

export default function DashboardPreview() {
  return <DashboardPage user={mockUser} />;
}
