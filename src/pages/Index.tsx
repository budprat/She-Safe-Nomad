// This file is deprecated - routing is now handled in App.tsx
// The old state-based navigation has been replaced with URL-based routing
// Keeping for backwards compatibility with any direct imports

import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to the home page - actual routing is handled in App.tsx
  return <Navigate to="/" replace />;
};

export default Index;
