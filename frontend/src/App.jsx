import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Wand2, Download, RefreshCw, Loader2, CheckCircle2 } from 'lucide-react';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('gris');

  const fileInputRef = useRef(null);

  const filtros = [
    { id: 'gris', label: 'Blanco y Negro', desc: 'Clásico monocromo' },
    { id: 'blur', label: 'Blur', desc: 'Suavizado difuso' },
    { id: 'contorno', label: 'Bordes', desc: 'Detección de trazos' },
    { id: 'negativo', label: 'Invertir', desc: 'Colores opuestos' },
    { id: 'detalle', label: 'HDR', desc: 'Resalta detalles' },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setImageBase64(null);
      setError(null);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageBase64(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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

      if (!response.ok) throw new Error('Error al conectar con el servidor.');

      const blob = await response.blob();
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(blob);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const descargarManual = () => {
    if (!imageBase64) return;
    const link = document.createElement("a");
    link.href = imageBase64;
    
   
    link.download = `editor-${selectedFilter}_${Date.now()}.png`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 font-sans text-slate-800 p-4 md:p-8">
      
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <header className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm mb-4 border border-indigo-50">
            <Wand2 className="w-6 h-6 text-indigo-600 mr-2" />
            <span className="text-sm font-bold text-indigo-900 tracking-wider">PHOTO EDITOR</span>
          </div>
          
          {/* AQUÍ ESTÁ EL CAMBIO DE COLOR: DEGRADADO DE TEXTO */}
          <h1 className="text-4xl md:text-6xl font-extrabold mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 drop-shadow-sm pb-2 leading-tight">
            Transforma tus imágenes
          </h1>
          
          <p className="text-slate-500 text-lg md:text-xl font-light">
            Aplica filtros inteligentes en segundos a tus fotos favoritas.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* COLUMNA IZQUIERDA: CONTROLES */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. CARD DE SUBIDA */}
            <div className="bg-white p-6 rounded-2xl shadow-xl shadow-indigo-100/50 border border-white">
              <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Upload size={18}/></div>
                Sube tu imagen
              </h3>
              
              {!selectedFile ? (
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-indigo-200 rounded-xl cursor-pointer bg-slate-50 hover:bg-indigo-50/50 transition-all group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 transform group-hover:scale-105 transition-transform">
                    <ImageIcon className="w-10 h-10 mb-3 text-indigo-300 group-hover:text-indigo-500 transition-colors" />
                    <p className="mb-1 text-sm text-slate-500 font-medium">Click para seleccionar</p>
                    <p className="text-xs text-slate-400">JPG, PNG (Max 5MB)</p>
                  </div>
                  <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
              ) : (
                <div className="relative group overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                  <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover opacity-90 transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                    <button onClick={handleReset} className="bg-white text-red-500 px-4 py-2 rounded-full font-bold text-sm shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform hover:bg-red-50">
                      Cambiar imagen
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-white/95 px-3 py-1 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1 shadow-sm border border-slate-100">
                     <CheckCircle2 size={12} className="text-green-500"/> Listo
                  </div>
                </div>
              )}
            </div>

            {/* 2. CARD DE FILTROS */}
            <div className={`bg-white p-6 rounded-2xl shadow-xl shadow-indigo-100/50 border border-white transition-all duration-300 ${!selectedFile ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
              <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Wand2 size={18}/></div>
                Elige un filtro
              </h3>
              
              <div className="grid grid-cols-1 gap-3">
                {filtros.map(f => (
                  <button 
                    key={f.id} 
                    onClick={() => setSelectedFilter(f.id)} 
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 text-left relative overflow-hidden
                      ${selectedFilter === f.id 
                        ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500 shadow-md' 
                        : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50 hover:shadow-sm'}`}
                  >
                    <div className="z-10 relative">
                      <span className={`block font-bold text-sm ${selectedFilter === f.id ? 'text-indigo-800' : 'text-slate-600'}`}>{f.label}</span>
                      <span className="text-xs text-slate-400 font-medium">{f.desc}</span>
                    </div>
                    {selectedFilter === f.id && <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-lg z-10"></div>}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. BOTÓN DE ACCIÓN */}
            <button 
              onClick={procesarImagen} 
              disabled={loading || !selectedFile} 
              className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-lg shadow-lg shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex justify-center items-center gap-2 group"
            >
              {loading ? (
                <><Loader2 className="animate-spin" /> Procesando...</>
              ) : (
                <><Wand2 size={20} className="group-hover:rotate-12 transition-transform"/> Aplicar Magia</>
              )}
            </button>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 text-center animate-pulse font-medium">
                ⚠️ Error: {error}
              </div>
            )}

          </div>

          {/* COLUMNA DERECHA: RESULTADO */}
          <div className="lg:col-span-8">
            <div className="h-full min-h-[500px] bg-white rounded-3xl shadow-2xl shadow-indigo-100/50 border border-white p-2 relative flex flex-col">
              
              {/* ÁREA DE VISUALIZACIÓN */}
              <div className="flex-1 bg-slate-50 rounded-2xl overflow-hidden relative flex items-center justify-center checkerboard-pattern border border-slate-100/50">
                {!imageBase64 ? (
                  <div className="text-center p-10 opacity-40">
                    <ImageIcon className="w-24 h-24 mx-auto mb-4 text-slate-300" />
                    <p className="text-xl font-medium text-slate-400">El resultado aparecerá aquí</p>
                  </div>
                ) : (
                  <img 
                    src={imageBase64} 
                    alt="Resultado" 
                    className="max-w-full max-h-[600px] object-contain shadow-2xl rounded-lg animate-in fade-in zoom-in duration-500"
                    style={{ position: 'relative', zIndex: 10 }} 
                  />
                )}
              </div>

              {/* BARRA DE HERRAMIENTAS INFERIOR */}
              {imageBase64 && (
                <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-b-3xl">
                  <div className="text-sm text-slate-500 hidden sm:block">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mr-2 shadow-sm">Éxito</span>
                    Filtro: <span className="font-bold text-slate-800">{filtros.find(f => f.id === selectedFilter)?.label}</span>
                  </div>
                  
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button 
                      onClick={handleReset}
                      className="flex-1 sm:flex-none px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center justify-center gap-2 hover:border-slate-300"
                    >
                      <RefreshCw size={18} /> Reiniciar
                    </button>
                    
                    <button 
                      onClick={descargarManual}
                      className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                      <Download size={18} /> Descargar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </main>
      </div>
      
      <style>{`
        .checkerboard-pattern {
          background-image: linear-gradient(45deg, #f1f5f9 25%, transparent 25%), linear-gradient(-45deg, #f1f5f9 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f1f5f9 75%), linear-gradient(-45deg, transparent 75%, #f1f5f9 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
      `}</style>
    </div>
  );
}

export default App;