import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Minimalist from './pages/Minimalist';
import Interactive from './pages/Interactive';
import CyberTerminal from './pages/CyberTerminal';
import FilmPage from './pages/FilmPage';
import EditPage from './pages/EditPage';
import ThreeDPage from './pages/ThreeDPage';
import DevPage from './pages/DevPage';
import { motion, AnimatePresence } from 'framer-motion';
import { GlobalLoader } from './components/Scene3D';
import './App.css';

function getPageFromHash() {
  const hash = window.location.hash.replace('#', '');
  if (hash === '/interactive' || hash === 'interactive') return 'interactive';
  if (hash === '/minimal' || hash === 'minimal') return 'minimal';
  if (hash === '/terminal' || hash === 'terminal') return 'terminal';
  if (hash === '/film' || hash === 'film') return 'film';
  if (hash === '/edit' || hash === 'edit') return 'edit';
  if (hash === '/3d' || hash === '3d') return '3d';
  if (hash === '/dev' || hash === 'dev') return 'dev';
  return 'home';
}

function App() {
  const [page, setPage] = useState(getPageFromHash);

  useEffect(() => {
    const onHashChange = () => setPage(getPageFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Global navigate function via window
  useEffect(() => {
    window.__navigate = (to) => {
      window.location.hash = to;
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', minHeight: '100vh' }}
        >
          {page === 'interactive' && <Interactive />}
          {page === 'minimal' && <Minimalist />}
          {page === 'terminal' && <CyberTerminal />}
          {page === 'film' && <FilmPage />}
          {page === 'edit' && <EditPage />}
          {page === '3d' && <ThreeDPage />}
          {page === 'dev' && <DevPage />}
          {page === 'home' && <Home />}
        </motion.div>
      </AnimatePresence>

      <GlobalLoader />
    </>
  );
}

export default App;
