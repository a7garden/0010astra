import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MantineProvider, ColorSchemeScript, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import AppShell from './components/AppShell';
import HomePage from './pages/HomePage';
import ConceptsPage from './pages/ConceptsPage';
import ConceptDetailPage from './pages/ConceptDetailPage';

const theme = createTheme({
  primaryColor: 'violet',
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  defaultRadius: 'md',
});

export default function App() {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="dark" />
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <Notifications position="top-right" />
        <BrowserRouter>
          <AppShell>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/concepts" element={<ConceptsPage />} />
              <Route path="/concepts/:slug" element={<ConceptDetailPage />} />
            </Routes>
          </AppShell>
        </BrowserRouter>
      </MantineProvider>
    </>
  );
}
