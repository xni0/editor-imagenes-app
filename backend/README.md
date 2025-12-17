# ⚡ FastAPI Image Processing API

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-009688?style=flat&logo=fastapi&logoColor=white)
![Pillow](https://img.shields.io/badge/Pillow-Image_Processing-yellow?style=flat)
![Status](https://img.shields.io/badge/Status-Backend_Completed-success)

Una API REST de alto rendimiento diseñada para la manipulación de imágenes en tiempo real. 

Este proyecto se diferencia de un CRUD tradicional por ser **Stateless** (sin estado): utiliza **buffers en memoria (In-Memory Processing)** para recibir, transformar y devolver datos binarios sin tocar el disco duro del servidor, maximizando la velocidad y reduciendo la latencia.

## 🚀 Características Técnicas

* **Procesamiento en Memoria:** Uso de `io.BytesIO` para evitar operaciones de I/O en disco (Disk Bound) y priorizar velocidad.
* **Seguridad Robusta:**
    * Validación de **Magic Numbers** (integridad de archivo real).
    * Validación de **MIME Types** (solo acepta imágenes).
    * Límite de tamaño de payload (protección contra DoS).
* **Tipado Estricto:** Uso de `Python Enums` para controlar los filtros permitidos.
* **Streaming Responses:** Entrega de datos procesados como flujo directo de bytes.
* **Documentación Interactiva:** Swagger UI y OpenAPI integrados automáticamente.

## 🛠️ Stack Tecnológico

* **Core:** Python 3.x
* **Framework:** FastAPI
* **Servidor ASGI:** Uvicorn
* **Motor de Procesamiento:** Pillow (PIL Fork)
* **Gestión de Datos:** Python-Multipart & Pydantic

## 🎨 Endpoints y Filtros

### `POST /procesar-imagen/`

Recibe una imagen (multipart/form-data) y un parámetro de filtro. Devuelve la imagen procesada en formato PNG.

| Filtro (`query param`) | Descripción Técnica |
| :--- | :--- |
| `gris` | Conversión a escala de grises (Luminance). |
| `blur` | Aplicación de filtro Gaussiano (Radius=5). |
| `contorno` | Detección de bordes mediante kernel de convolución. |
| `negativo` | Inversión de canales RGB. |
| `detalle` | Realce de nitidez (Sharpening filter). |

## 🔧 Instalación y Despliegue Local

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/xni0/editor-imagenes-api.git
    cd editor-imagenes-api
    ```

2.  **Crear entorno virtual:**
    ```bash
    python -m venv venv
    # Windows:
    .\venv\Scripts\activate
    # Mac/Linux:
    source venv/bin/activate
    ```

3.  **Instalar dependencias:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Iniciar el servidor:**
    ```bash
    uvicorn main:app --reload
    ```

5.  **Ver documentación:**
    Abre `http://127.0.0.1:8000/docs` en tu navegador.

## 🧪 Testing

El proyecto incluye un archivo `pruebas.http` para realizar tests directos con la extensión **REST Client** de VS Code, cubriendo:
* Casos de éxito para cada filtro.
* Tests de estrés (archivos grandes).
* Tests de seguridad (archivos falsos/corruptos).

## 🔜 Próximos Pasos (Roadmap)

* [x] Arquitectura de Backend Stateless.
* [x] Implementación de validaciones de seguridad (MIME/Size).
* [ ] Desarrollo de Frontend SPA con **React + Tailwind CSS**.
* [ ] Dockerización del servicio para despliegue en nube (AWS/Render).

---

<div align="center">
  <p>Realizado por <strong>Lucilene Vidal Lima</strong></p>
  <p>Desarrollado con 🐍 y FastAPI.</p>
</div>

