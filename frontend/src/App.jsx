import { useState } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Wand2, 
  Download, 
  AlertCircle, 
  Layers, 
  Droplets, 
  Sun, 
  Zap,
  ScanLine
} from 'lucide-react';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('gris');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filtros con Iconos y descripciones
  const filtros = [
    { id: 'gris', label: 'B&W', desc: 'Clásico atemporal', icon: <Layers className="w-5 h-5"/> },
    { id: 'blur', label: 'Blur', desc: 'Suavizado onírico', icon: <Droplets className="w-5 h-5"/> },
    { id: 'contorno', label: 'Bordes', desc: 'Estilo boceto', icon: <ScanLine className="w-5 h-5"/> },
    { id: 'negativo', label: 'Invertir', desc: 'Colores opuestos', icon: <Zap className="w-5 h-5"/> },
    { id: 'detalle', label: 'HDR', desc: 'Resaltar texturas', icon: <Sun className="w-5 h-5"/> },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setProcessedUrl(null);
      setError(null);
    }
  };

  const procesarImagen = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`http://localhost:8000/procesar-imagen/?filtro=${selectedFilter}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al procesar la imagen');
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setProcessedUrl(imageUrl);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // FONDO CON DEGRADADO
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-slate-800 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <header className="mb-12 text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-sm mb-4">
            <span className="flex items-center gap-2 text-sm font-bold text-indigo-600 tracking-wide uppercase px-2">
              <Wand2 className="w-4 h-4" /> Photo Studio
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">
            Transforma tus Fotos
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Sube tu imagen, edítala con filtros y descárgala al instante.
          </p>
        </header>

        {/* CONTENEDOR PRINCIPAL TIPO TARJETA */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
            
            {/* PANEL IZQUIERDO: CONTROLES */}
            <div className="lg:col-span-4 p-8 border-b lg:border-b-0 lg:border-r border-indigo-100 bg-white/40">
              
              {/* SECCIÓN 1: SUBIDA */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                  Cargar Imagen
                </h3>
                <label className="group relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-indigo-200 rounded-2xl cursor-pointer bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-300">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center p-4">
                    <div className="bg-white p-3 rounded-full shadow-md mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6 text-indigo-500" />
                    </div>
                    <p className="text-sm text-slate-600 font-medium">
                      {selectedFile ? selectedFile.name : "Arrastra o haz click"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG hasta 10MB</p>
                  </div>
                  <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
              </div>

              {/* SECCIÓN 2: FILTROS */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                  Seleccionar Filtro
                </h3>
                <div className="space-y-3">
                  {filtros.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFilter(f.id)}
                      className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 border ${
                        selectedFilter === f.id
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 scale-[1.02]'
                          : 'bg-white border-transparent hover:border-indigo-200 text-slate-600 hover:bg-indigo-50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg mr-3 ${selectedFilter === f.id ? 'bg-white/20' : 'bg-indigo-50 text-indigo-500'}`}>
                        {f.icon}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-sm">{f.label}</p>
                        <p className={`text-xs ${selectedFilter === f.id ? 'text-indigo-100' : 'text-slate-400'}`}>{f.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* BOTÓN PROCESAR */}
              <button
                onClick={procesarImagen}
                disabled={!selectedFile || loading}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                  !selectedFile || loading
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-indigo-300/50 hover:-translate-y-1'
                }`}
              >
                {loading ? (
                  <>
                    <Wand2 className="w-5 h-5 animate-spin" /> Creando Magia...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" /> Aplicar Filtro
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-start gap-3 text-sm animate-pulse">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              )}
            </div>

            {/* PANEL DERECHO: VISUALIZACIÓN */}
            <div className="lg:col-span-8 p-8 bg-slate-50/50 relative">
              
              {!previewUrl ? (
                // ESTADO VACÍO
                <div className="h-full flex flex-col items-center justify-center text-slate-300 border-4 border-dashed border-slate-200 rounded-3xl min-h-[400px]">
                  <ImageIcon className="w-24 h-24 mb-4 opacity-20" />
                  <p className="text-xl font-medium opacity-50">La magia sucede aquí</p>
                </div>
              ) : (
                // COMPARACIÓN
                <div className="h-full flex flex-col gap-6">
                  
                  {/* IMAGEN ORIGINAL (PEQUEÑA) */}
                  {!processedUrl && (
                     <div className="flex-1 flex flex-col justify-center items-center animate-fade-in">
                        <div className="relative group">
                          <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                          <img 
                            src={previewUrl} 
                            alt="Original" 
                            className="relative rounded-xl shadow-2xl max-h-[500px] object-contain border-4 border-white" 
                          />
                          <span className="absolute top-4 left-4 bg-black/50 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                            ORIGINAL
                          </span>
                        </div>
                     </div>
                  )}

                  {/* RESULTADO (GRANDE) */}
                  {processedUrl && (
                    <div className="flex-1 flex flex-col justify-center items-center animate-in fade-in zoom-in duration-500">
                      <div className="relative group w-full max-w-2xl">
                         <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                         <img 
                            src={processedUrl} 
                            alt="Procesada" 
                            className="relative w-full rounded-2xl shadow-2xl border-4 border-white bg-white" 
                         />
                         
                         {/* ETIQUETA FLOTANTE */}
                         <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4">
                           <a 
                             href={processedUrl} 
                             download={`magic-image-${selectedFilter}.png`}
                             className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
                           >
                             <Download className="w-4 h-4" /> Descargar HD
                           </a>
                           <button 
                             onClick={() => setProcessedUrl(null)}
                             className="bg-black/80 text-white hover:bg-black px-6 py-3 rounded-full font-bold shadow-lg backdrop-blur-md border border-white/20"
                           >
                             Probar otro
                           </button>
                         </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <p className="text-center text-slate-400 mt-8 text-sm">
          Potenciado por FastAPI & React. Diseñado con Tailwind CSS.
        </p>
      </div>
    </div>
  );
}

export default App;