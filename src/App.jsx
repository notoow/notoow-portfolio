import React, { Suspense, lazy, useEffect, useState } from 'react';
import Home from './pages/Home';
import { motion, AnimatePresence } from 'framer-motion';
import PageLoader from './components/PageLoader';
import './App.css';

const ENABLE_ADMIN_PAGE = import.meta.env.DEV || import.meta.env.VITE_ENABLE_ADMIN_PAGE === 'true';
const Minimalist = lazy(() => import('./pages/Minimalist'));
const Interactive = lazy(() => import('./pages/Interactive'));
const CyberTerminal = lazy(() => import('./pages/CyberTerminal'));
const FilmPage = lazy(() => import('./pages/FilmPage'));
const EditPage = lazy(() => import('./pages/EditPage'));
const ThreeDPage = lazy(() => import('./pages/ThreeDPage'));
const DevPage = lazy(() => import('./pages/DevPage'));
const VideoAdminPage = lazy(() => import('./pages/VideoAdminPage'));

function getPageFromHash() {
  const hash = window.location.hash.replace('#', '');
  if (hash === '/interactive' || hash === 'interactive' || hash === '/portfolio' || hash === 'portfolio') return 'portfolio';
  if (hash === '/minimal' || hash === 'minimal') return 'minimal';
  if (hash === '/terminal' || hash === 'terminal') return 'terminal';
  if (hash === '/film' || hash === 'film') return 'film';
  if (hash === '/edit' || hash === 'edit') return 'edit';
  if (hash === '/3d' || hash === '3d') return '3d';
  if (hash === '/dev' || hash === 'dev') return 'dev';
  if (ENABLE_ADMIN_PAGE && (hash === '/admin-videos' || hash === 'admin-videos')) return 'admin-videos';
  return 'home';
}

function App() {
  const [page, setPage] = useState(getPageFromHash);

  useEffect(() => {
    const onHashChange = () => setPage(getPageFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (page === 'home') return;

    const frameId = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [page]);

  const CurrentPage = (() => {
    if (page === 'portfolio') return Interactive;
    if (page === 'minimal') return Minimalist;
    if (page === 'terminal') return CyberTerminal;
    if (page === 'film') return FilmPage;
    if (page === 'edit') return EditPage;
    if (page === '3d') return ThreeDPage;
    if (page === 'dev') return DevPage;
    if (ENABLE_ADMIN_PAGE && page === 'admin-videos') return VideoAdminPage;
    return Home;
  })();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={page}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', minHeight: '100vh' }}
      >
        <Suspense fallback={<PageLoader label="Loading page" />}>
          <CurrentPage />
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

export default App;
