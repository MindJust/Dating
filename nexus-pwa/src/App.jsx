import { Routes, Route } from 'react-router-dom';
import { ConfigProvider } from './context/ConfigContext';
import { AuthProvider } from './context/AuthContext';
import { OfflineProvider } from './context/OfflineContext';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import Discovery from './pages/Discovery';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Safety from './pages/Safety';
import Premium from './pages/Premium';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <ConfigProvider>
      <AuthProvider>
        <OfflineProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/discovery" element={<Discovery />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/:matchId" element={<Chat />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/safety" element={<Safety />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </OfflineProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;