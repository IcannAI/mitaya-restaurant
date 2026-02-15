import React from 'react';
import { AppProvider } from './context/AppContext';
import { useCustomRouter } from './hooks/useCustomRouter';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { ReservationPage } from './pages/ReservationPage';

const AppContent = () => {
  const { path } = useCustomRouter();

  const renderPage = () => {
    switch (path) {
      case '/':
        return <HomePage />;
      case '/menu':
        return <MenuPage />;
      case '/reservation':
        return <ReservationPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <Layout>
      {renderPage()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider children={<AppContent />} />
  );
};

export default App;