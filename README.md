# 📸 AI Photo Studio - Full Stack Image Processor

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

> Una aplicación Full Stack moderna para el procesamiento de imágenes, combinando una interfaz de usuario reactiva de alto nivel con la potencia de Python para la manipulación de píxeles.

## 🌟 Descripción del Proyecto

**AI Photo Studio** es una herramienta web que permite a los usuarios subir imágenes y aplicar transformaciones visuales (filtros) en tiempo real.

El proyecto demuestra la integración de una arquitectura **Cliente-Servidor (Full Stack)** donde:
1.  **Frontend (React + Tailwind):** Ofrece una experiencia de usuario (UX) premium con diseño "Glassmorphism", animaciones fluidas y feedback visual instantáneo.
2.  **Backend (FastAPI + Python):** Actúa como una API REST que recibe archivos binarios, los procesa en memoria utilizando la librería `Pillow` y devuelve el resultado transformado sin necesidad de almacenamiento persistente (Stateless).

## 🚀 Características Principales

* **Interfaz Moderna:** Diseño responsivo con efectos de desenfoque (backdrop-blur) y degradados.
* **Procesamiento en el Servidor:** La lógica de imagen no ocurre en el navegador, sino en un servidor Python dedicado.
* **Filtros Disponibles:**
    * ⚪ **B&W:** Conversión a escala de grises.
    * 💧 **Blur:** Desenfoque Gaussiano.
    * ✏️ **Contornos:** Detección de bordes (Edge Detection).
    * ⚡ **Invertir:** Negativo fotográfico.
    * ☀️ **HDR Falso:** Mejora algorítmica de contraste y nitidez.
* **Gestión de Estados:** Manejo de carga (Loaders), errores y previsualizaciones mediante Hooks de React.

## 🛠️ Stack Tecnológico

### Frontend (Cliente)
* **Framework:** React (Vite)
* **Estilos:** Tailwind CSS
* **Iconografía:** Lucide React
* **Comunicación:** Fetch API (Asíncrono)

### Backend (API)
* **Servidor:** FastAPI (Python)
* **Servidor ASGI:** Uvicorn
* **Procesamiento de Imagen:** Pillow (PIL)
* **Manejo de Datos:** Python-Multipart

---

## 💻 Instalación y Uso Local

Sigue estos pasos para correr el proyecto en tu máquina.

### Prerrequisitos
* Node.js instalado.
* Python 3.8+ instalado.

### 1. Configurar el Backend (Python)

```bash
# Navega a la carpeta del backend (donde está main.py)
cd backend

# (Opcional) Crea un entorno virtual
python -m venv venv
# Actívalo: source venv/bin/activate (Mac/Linux) o venv\Scripts\activate (Windows)

# Instala las dependencias
pip install fastapi uvicorn pillow python-multipart

# Inicia el servidor
uvicorn main:app --reload
````
*El servidor correrá en `http://localhost:8000`*

### 2. Configurar el Frontend (React)

```bash
# Navega a la carpeta del frontend (en una nueva terminal)
cd frontend

# Instala las dependencias de Node
npm install

# Inicia la aplicación
npm run dev
```
*La web estará disponible en `http://localhost:5173` (o el puerto que indique Vite)*
---

## 📂 Estructura del Proyecto

```text
/
├── backend/
│   ├── main.py            # Lógica principal de la API y procesamiento
│   └── requirements.txt   # Dependencias de Python
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Componente principal e interfaz
│   │   └── main.jsx       # Punto de entrada de React
│   └── tailwind.config.js # Configuración de estilos
│
└── README.md
````
## 📡 Endpoints de la API

La API cuenta con un endpoint principal:

### `POST /procesar-imagen/`

Recibe una imagen y devuelve la imagen procesada en formato blob.

* **Query Param:** `?filtro=[gris|blur|contorno|negativo|detalle]`
* **Body:** `form-data` con el archivo de imagen (`file`).

---

## ✨ Autor

Desarrollado como proyecto Full Stack para demostrar habilidades en integración Frontend-Backend y manipulación de medios con Python.

Lucilene Vidal Lima 👨‍💻

