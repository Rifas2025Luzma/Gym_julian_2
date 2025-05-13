import React from 'react';

const days = [
  { id: 'monday', label: 'Lunes' },
  { id: 'tuesday', label: 'Martes' },
  { id: 'wednesday', label: 'Miércoles' },
  { id: 'thursday', label: 'Jueves' },
  { id: 'friday', label: 'Viernes' },
  { id: 'saturday', label: 'Sábado' },
  { id: 'sunday', label: 'Domingo' },
];

interface NavigationProps {
  isNavOpen: boolean;
  setIsNavOpen: (isOpen: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = ({ isNavOpen, setIsNavOpen }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setIsNavOpen(false);
    }
  };

  return (
    <nav
      className={`${
        isNavOpen
          ? 'absolute top-16 left-0 right-0 bg-gray-900 border-b border-gray-800'
          : 'hidden lg:block'
      }`}
    >
      <ul className={`${isNavOpen ? 'flex flex-col' : 'flex'} space-x-1`}>
        {days.map((day) => (
          <li key={day.id} className={`${isNavOpen ? 'p-4' : ''}`}>
            <button
              onClick={() => scrollToSection(day.id)}
              className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            >
              {day.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navigation;