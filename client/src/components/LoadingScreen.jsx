import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Database, BrainCircuit, ImageIcon } from 'lucide-react';
import './LoadingScreen.css';

const STAGES = [
  { id: 1, text: 'Discovering stories...', icon: <Database className="pulse-icon" /> },
  { id: 2, text: 'Combining sources...', icon: <Database className="pulse-icon" /> },
  { id: 3, text: 'Analyzing stories...', icon: <BrainCircuit className="pulse-icon" /> },
  { id: 4, text: 'Creating visuals...', icon: <ImageIcon className="pulse-icon" /> },
];

const LoadingScreen = () => {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStage(prev => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 1500); // Progress every 1.5s
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="loading-screen">
      <div className="background-glow loader-glow"></div>
      
      <div className="loading-content">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="brand-loader"
        >
          <Sparkles size={48} color="var(--primary)" />
        </motion.div>

        <div className="stages-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="stage-display"
            >
              {STAGES[currentStage].icon}
              <h2>{STAGES[currentStage].text}</h2>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="progress-bar-container">
          <motion.div 
            className="progress-bar-fill"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStage + 1) / STAGES.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
