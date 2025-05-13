import React, { useState, useEffect } from 'react';
import { Menu, X, Download, ChevronUp } from 'lucide-react';
import WorkoutDay from './components/WorkoutDay';
import Navigation from './components/Navigation';
import WeekSelector from './components/WeekSelector';
import ProgressPhotos from './components/ProgressPhotos';
import { useProgressStore } from './store/progressStore';
import {
  // Semana 1
  mondayDataWeek1,
  tuesdayDataWeek1,
  wednesdayDataWeek1,
  thursdayDataWeek1,
  fridayDataWeek1,
  saturdayDataWeek1,
  sundayDataWeek1,
  // Semana 2
  mondayDataWeek2,
  tuesdayDataWeek2,
  wednesdayDataWeek2,
  thursdayDataWeek2,
  fridayDataWeek2,
  saturdayDataWeek2,
  sundayDataWeek2,
  // Semana 3
  mondayDataWeek3,
  tuesdayDataWeek3,
  wednesdayDataWeek3,
  thursdayDataWeek3,
  fridayDataWeek3,
  saturdayDataWeek3,
  sundayDataWeek3
} from './data/workoutData';

function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const initializeFirebase = useProgressStore(state => state.initializeFirebase);
  const currentWeek = useProgressStore(state => state.currentWeek);

  useEffect(() => {
    initializeFirebase();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Seleccionar los datos según la semana actual
  const getWeekData = () => {
    switch (currentWeek) {
      case 1:
        return {
          monday: mondayDataWeek1,
          tuesday: tuesdayDataWeek1,
          wednesday: wednesdayDataWeek1,
          thursday: thursdayDataWeek1,
          friday: fridayDataWeek1,
          saturday: saturdayDataWeek1,
          sunday: sundayDataWeek1
        };
      case 2:
        return {
          monday: mondayDataWeek2,
          tuesday: tuesdayDataWeek2,
          wednesday: wednesdayDataWeek2,
          thursday: thursdayDataWeek2,
          friday: fridayDataWeek2,
          saturday: saturdayDataWeek2,
          sunday: sundayDataWeek2
        };
      case 3:
        return {
          monday: mondayDataWeek3,
          tuesday: tuesdayDataWeek3,
          wednesday: wednesdayDataWeek3,
          thursday: thursdayDataWeek3,
          friday: fridayDataWeek3,
          saturday: saturdayDataWeek3,
          sunday: sundayDataWeek3
        };
      default:
        return {
          monday: mondayDataWeek1,
          tuesday: tuesdayDataWeek1,
          wednesday: wednesdayDataWeek1,
          thursday: thursdayDataWeek1,
          friday: fridayDataWeek1,
          saturday: saturdayDataWeek1,
          sunday: sundayDataWeek1
        };
    }
  };

  const weekData = getWeekData();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-gray-900/95 z-50 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
              Programa HyperGrowth
            </h1>
            <button
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="lg:hidden text-gray-300 hover:text-white"
            >
              {isNavOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Navigation isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-20 pb-16">
        {/* Hero Section */}
        <section className="relative h-[80vh] flex items-center justify-center mb-16 rounded-2xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Fitness Hero"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/70" />
          <div className="relative text-center">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Transforma Tu Cuerpo
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Programa Completo de Entrenamiento y Nutrición para Hipertrofia
            </p>
            <div className="space-y-4">
              <button className="bg-gradient-to-r from-red-500 to-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity">
                Comienza Tu Viaje
              </button>
              <p className="text-lg text-gray-300">Semana {currentWeek} de 4</p>
            </div>
          </div>
        </section>

        {/* Week Selector */}
        <WeekSelector />

        {/* Workout Days */}
        <div className="space-y-16">
          <WorkoutDay
            id={`monday-week-${currentWeek}`}
            day="Lunes"
            focus="Pierna (Cuádriceps)"
            data={weekData.monday}
          />
          <WorkoutDay
            id={`tuesday-week-${currentWeek}`}
            day="Martes"
            focus="Push (Pecho, Hombros, Tríceps)"
            data={weekData.tuesday}
          />
          <WorkoutDay
            id={`wednesday-week-${currentWeek}`}
            day="Miércoles"
            focus="Pull (Espalda y Bíceps)"
            data={weekData.wednesday}
          />
          <WorkoutDay
            id={`thursday-week-${currentWeek}`}
            day="Jueves"
            focus="Pierna (Femorales y Glúteos)"
            data={weekData.thursday}
          />
          <WorkoutDay
            id={`friday-week-${currentWeek}`}
            day="Viernes"
            focus="Torso Completo"
            data={weekData.friday}
          />
          <WorkoutDay
            id={`saturday-week-${currentWeek}`}
            day="Sábado"
            focus="Descanso Activo"
            data={weekData.saturday}
          />
          <WorkoutDay
            id={`sunday-week-${currentWeek}`}
            day="Domingo"
            focus="Descanso"
            data={weekData.sunday}
          />
          
          {/* Progress Photos Section */}
          <ProgressPhotos weekNumber={currentWeek} />
        </div>
      </main>

      {/* Floating Buttons */}
      <div className="fixed bottom-4 right-4 space-y-2">
        <button
          className="w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-lg transition-colors"
          title="Descargar PDF"
        >
          <Download size={24} />
        </button>
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center shadow-lg transition-colors"
            title="Volver arriba"
          >
            <ChevronUp size={24} />
          </button>
        )}
      </div>
    </div>
  );
}

export default App;