import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import _ from 'lodash';
import CardComponent from './Card';

interface IndexProps {
  mode: string;
  items: any[];
  currentProjects: string[];
  handleClick: (val: any) => void;
  brushOut: (val: any) => void;
  brushReset: (val: any) => void;
}

export function Index({ mode, items, currentProjects, handleClick, brushOut, brushReset }: IndexProps) {
  const [over, setOver] = useState<any>(null);

  const handleOver = (val: any) => {
    setOver(val);
    brushOut(val);
  };

  const handleOut = (val: any) => {
    setOver(null);
    brushReset(val);
  };

  if (items.length === 0) {
    return <p>Index is empty.</p>;
  }

  const containerStyle: React.CSSProperties = mode === 'tile'
    ? { display: 'flex', flexWrap: 'wrap', gap: '20px', cursor: 'pointer' }
    : { cursor: 'pointer' };

  return (
    <div className="indexClass" style={containerStyle}>
      <AnimatePresence mode="popLayout">
        {items.map(val => {
          const highlighted = _.includes(currentProjects, val.caption);
          let theClass = '';
          if (mode === 'tile') {
            theClass = highlighted ? 'researchItem gridItem selected' : 'researchItem gridItem';
            if (val === over) theClass = 'researchItem gridItem myOver';
          } else if (mode === 'details') {
            theClass = highlighted ? 'researchItem detailItem selected' : 'researchItem detailItem';
            if (val === over) theClass = 'researchItem detailItem myOver';
          } else {
            theClass = highlighted ? 'researchItem publicationItem selected' : 'researchItem publicationItem';
            if (val === over) theClass = 'researchItem publicationItem myOver';
          }

          return (
            <motion.div
              key={val.id}
              layout
              className={theClass}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.25 }}
            >
              <CardComponent
                theItem={val}
                mode={mode}
                handleOver={e => handleOver(e)}
                handleOut={e => handleOut(e)}
                handleClick={e => handleClick(e)}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default Index;
