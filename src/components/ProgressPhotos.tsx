import React, { useState } from 'react';
import { Link2, Loader2 } from 'lucide-react';
import { useProgressStore } from '../store/progressStore';

interface ProgressPhotosProps {
  weekNumber: number;
}

const ProgressPhotos: React.FC<ProgressPhotosProps> = ({ weekNumber }) => {
  const [frontUrl, setFrontUrl] = useState('');
  const [backUrl, setBackUrl] = useState('');
  const [uploadingType, setUploadingType] = useState<'front' | 'back' | null>(null);
  const { updateProgressPhotos, progressPhotos } = useProgressStore();
  
  const currentPhotos = progressPhotos[`week${weekNumber}`] || { front: '', back: '' };

  const convertGoogleDriveUrl = (url: string) => {
    if (!url.includes('drive.google.com')) return url;
    
    const fileId = url.match(/\/d\/(.*?)\//) || url.match(/id=(.*?)(&|$)/);
    if (!fileId) return url;
    
    return `https://drive.google.com/uc?export=view&id=${fileId[1]}`;
  };

  const handleUrlSubmit = async (type: 'front' | 'back') => {
    const url = type === 'front' ? frontUrl : backUrl;
    if (!url.trim() || uploadingType) return;

    try {
      setUploadingType(type);
      const imageUrl = convertGoogleDriveUrl(url.trim());
      updateProgressPhotos(weekNumber, type, imageUrl);
      
      // Clear only the corresponding input
      if (type === 'front') {
        setFrontUrl('');
      } else {
        setBackUrl('');
      }
    } catch (error) {
      console.error('Error saving image URL:', error);
      alert('Error al guardar la URL. Por favor, intenta de nuevo.');
    } finally {
      setUploadingType(null);
    }
  };

  const PhotoInput = ({ type, title }: { type: 'front' | 'back', title: string }) => {
    const currentUrl = currentPhotos[type];
    const isUploading = uploadingType === type;
    const inputValue = type === 'front' ? frontUrl : backUrl;
    const setInputValue = type === 'front' ? setFrontUrl : setBackUrl;

    return (
      <div className="bg-gray-700/50 rounded-lg p-4">
        <h4 className="font-medium mb-4">{title}</h4>
        {currentUrl ? (
          <div className="space-y-4">
            <div className="relative h-64">
              <img 
                src={currentUrl} 
                alt={`Progreso ${type} semana ${weekNumber}`}
                className="absolute inset-0 w-full h-full object-contain rounded-lg"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ingresa nueva URL de Google Drive"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-gray-800 rounded px-3 py-2 text-white placeholder-gray-400"
              />
              <button
                onClick={() => handleUrlSubmit(type)}
                disabled={isUploading || !inputValue.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 px-4 py-2 rounded flex items-center gap-2"
              >
                {isUploading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Link2 size={20} />
                )}
                Actualizar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="h-64 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">No hay foto {type === 'front' ? 'frontal' : 'trasera'}</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ingresa URL de Google Drive"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-gray-800 rounded px-3 py-2 text-white placeholder-gray-400"
              />
              <button
                onClick={() => handleUrlSubmit(type)}
                disabled={isUploading || !inputValue.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 px-4 py-2 rounded flex items-center gap-2"
              >
                {isUploading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Link2 size={20} />
                )}
                Guardar
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="mt-16">
      <h3 className="text-2xl font-semibold mb-6 flex items-center">
        <span className="bg-purple-500 w-2 h-8 rounded mr-3"></span>
        Fotos de Progreso - Semana {weekNumber}
      </h3>
      
      <div className="grid md:grid-cols-2 gap-8">
        <PhotoInput type="front" title="Foto Frontal" />
        <PhotoInput type="back" title="Foto Trasera" />
      </div>

      <div className="mt-4 p-4 bg-gray-800 rounded-lg">
        <h4 className="font-medium mb-2">Instrucciones para compartir fotos desde Google Drive:</h4>
        <ol className="list-decimal list-inside space-y-2 text-gray-300">
          <li>Sube tu foto a Google Drive</li>
          <li>Haz clic derecho en el archivo y selecciona "Compartir"</li>
          <li>Cambia el acceso a "Cualquier persona con el enlace"</li>
          <li>Copia el enlace y pégalo en el campo de texto correspondiente</li>
          <li>Asegúrate de que la URL comience con "https://drive.google.com/"</li>
        </ol>
      </div>
    </section>
  );
};

export default ProgressPhotos;