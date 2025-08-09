import { useState } from 'react';
import { useAuth } from './Auth/AuthWrapper';
import { UserProfile } from './Profile/UserProfile';
import { Statistics } from './Statistics/Statistics';
import { SpeciesList } from './Species/SpeciesList';
import { SpeciesDetail } from './Species/SpeciesDetail';
import { GearList } from './Gear/GearList';
import { Forecast } from './Weather/Forecast';
import { MapPage } from './Map/MapPage';
import { AddCatch } from './Catches/AddCatch';
import { BottomNavbar } from './Navigation/BottomNavbar';
import { motion, AnimatePresence } from 'framer-motion';

const pageVariants = {
  enter: { 
    opacity: 0,
    x: 50,
    transition: { duration: 0.3 }
  },
  center: { 
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    x: -50,
    transition: { duration: 0.3 }
  }
};

export const MainApp = ({ fishingDB, storage }) => {
  const [currentPage, setCurrentPage] = useState('profile');
  const { user, userId } = useAuth();

  const renderPage = () => {
    const props = { 
      user, 
      userId, 
      setPage: setCurrentPage,
      fishingDB,
      storage
    };

    switch (currentPage) {
      case 'profile':
        return <UserProfile {...props} />;
      case 'statistics':
        return <Statistics {...props} />;
      case 'species':
        return <SpeciesList {...props} />;
      case 'speciesDetail':
        return <SpeciesDetail {...props} speciesId={window.__speciesId} />;
      case 'gear':
        return <GearList {...props} />;
      case 'forecast':
        return <Forecast {...props} />;
      case 'map':
        return <MapPage {...props} />;
      case 'addCatch':
        return <AddCatch {...props} />;
      default:
        return <UserProfile {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="pb-20"
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
      
      <BottomNavbar 
        currentPage={currentPage} 
        setPage={setCurrentPage}
      />
    </div>
  );
};