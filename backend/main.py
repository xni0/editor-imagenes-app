from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageOps, ImageFilter
import io
from enum import Enum 

app = FastAPI()

# CONFIGURACIÓN CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MODELOS DE DATOS (ENUM) 
class FiltrosDisponibles(str, Enum):
    gris = "gris"
    blur = "blur"
    contorno = "contorno"
    negativo = "negativo"
    detalle = "detalle"

# ENDPOINT PRINCIPAL 
@app.post("/procesar-imagen/")
async def procesar_imagen(
    file: UploadFile = File(...), 
    filtro: FiltrosDisponibles = FiltrosDisponibles.gris
):
    # VALIDACIÓN: TIPO DE ARCHIVO (MIME TYPE)
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400, 
            detail="El archivo debe ser una imagen (jpeg, png, etc)"
        )

    # Leemos el archivo completo en memoria
    request_object_content = await file.read()

    # VALIDACIÓN: TAMAÑO MÁXIMO (10 MB)
    MAX_FILE_SIZE = 10 * 1024 * 1024 # 10MB
    if len(request_object_content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="La imagen es demasiado grande (Máximo 10MB)"
        )

    # VALIDACIÓN: INTEGRIDAD DE LA IMAGEN
    try:
        # Intentamos abrirla para ver si Pillow la reconoce
        imagen = Image.open(io.BytesIO(request_object_content))
        imagen.verify() # Verifica estructura interna
        
        # IMPORTANTE: verify() consume el archivo, hay que volver a abrirlo para editarlo
        imagen = Image.open(io.BytesIO(request_object_content)) 
    except Exception:
        raise HTTPException(
            status_code=400, 
            detail="El archivo está corrupto o no es una imagen válida"
        )

    # APLICAR FILTROS
    if filtro == FiltrosDisponibles.gris:
        imagen = ImageOps.grayscale(imagen)
    elif filtro == FiltrosDisponibles.blur:
        imagen = imagen.filter(ImageFilter.GaussianBlur(radius=5))
    elif filtro == FiltrosDisponibles.contorno:
        imagen = imagen.filter(ImageFilter.CONTOUR)
    elif filtro == FiltrosDisponibles.negativo:
        imagen = ImageOps.invert(imagen.convert("RGB"))
    elif filtro == FiltrosDisponibles.detalle:
        imagen = imagen.filter(ImageFilter.DETAIL)

    # DEVOLVER RESULTADO
    buffer_salida = io.BytesIO()
    imagen.save(buffer_salida, format="PNG")
    buffer_salida.seek(0)

    return StreamingResponse(buffer_salida, media_type="image/png")