import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { About } from './components/About';
import { MyNav } from './components/MyNav';
import { CV } from './components/CV';
import { Feature } from './components/Feature';
import { Research } from './components/Research';
import './index.scss';
import './styles/main.scss';

function Root() {
  return (
    <HashRouter>
      <MyNav />
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/about" element={<About />} />
        <Route path="/Featured" element={<Feature />} />
        <Route path="/Research" element={<Research />} />
        <Route path="/CV" element={<CV />} />
      </Routes>
    </HashRouter>
  );
}

createRoot(document.getElementById('app')!).render(<Root />);
