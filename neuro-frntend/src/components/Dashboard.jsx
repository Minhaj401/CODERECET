import React, { useState } from 'react';
import LearningJourney from './LearningJourney';
import CameraCapture from './CameraCapture';
import FlashCardModal from './FlashCardModal';

export default function Dashboard() {
  // Example modules data
  const modules = [
    { id: 1, title: 'Start', type: 'start', progress: 0 },
    { id: 2, title: 'Module 1', type: 'completed', progress: 100 },
    { id: 3, title: 'Module 2', type: 'completed', progress: 100 },
    { id: 4, title: 'Module 3', type: 'completed', progress: 100 },
    { id: 5, title: 'Module 4', type: 'current', progress: 60 },
    { id: 6, title: 'Module 5', type: 'finish', progress: 0 },
  ];
  const [flashOpen, setFlashOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  
  const handleModuleClick = (mod) => {
    setSelectedModule(mod);
    setFlashOpen(true);
  };

  const backgroundStyle = {
    backgroundImage: "url('/Untitled design (8).png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    width: '100%',
  };
  
  return (
    <div style={backgroundStyle} className="min-h-screen">
      <div className="p-4">
        <LearningJourney modules={modules} onSelect={handleModuleClick} />
        <div className="mt-8 flex justify-center">
          <CameraCapture />
        </div>
        <FlashCardModal 
          open={flashOpen} 
          onClose={() => setFlashOpen(false)} 
          moduleId={selectedModule?.id || 1}
        />
      </div>
    </div>
  );
}
