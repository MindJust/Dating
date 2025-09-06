import { Routes, Route } from 'react-router-dom';
import { ConfigProvider } from './context/ConfigContext';
import { AuthProvider } from './context/AuthContext';
import { OfflineProvider } from './context/OfflineContext';
import Home from './pages/Home';
// Suppression de l'import inexistant : import './App.css';

function App() {
  return (
    <ConfigProvider>
      <AuthProvider>
        <OfflineProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              {/* Suppression des routes manquantes */}
            </Routes>
          </div>
        </OfflineProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;