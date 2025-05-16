// === ELEMENTOS DEL DOM ===
const loadingSpinner = document.getElementById('loading-spinner');
const appContainer = document.getElementById('app'); 

const homeView = document.getElementById('home-view');
const viewToolbar = document.getElementById('view-toolbar');
const gridBtn = document.getElementById('grid-view-btn');
const listBtn = document.getElementById('list-view-btn');
const docListContainer = document.getElementById('docListContainer'); 
const docList = document.getElementById('docList');

const docToolbar = document.getElementById('doc-toolbar');
const docViewerTitle = document.getElementById('doc-viewer-title'); 
const btnBack = document.getElementById('btn-back');
const btnZoomIn = document.getElementById('btn-font-increase');
const btnZoomOut = document.getElementById('btn-font-decrease');
const viewer = document.getElementById('viewer');

const minutasView = document.getElementById('minutas-view');
const homeBtn = document.getElementById('home-btn');
const minutasCatFilter = document.getElementById('minutas-catFilter');
const minutasDocListContainer = document.getElementById('minutasDocListContainer'); 
const minutasDocList = document.getElementById('minutas-docList');
const minutasViewer = document.getElementById('minutas-viewer');

const toggleSearchBtn = document.getElementById('toggle-search');
const searchBar = document.getElementById('search-bar');
const searchInput = document.getElementById('search');
const clearSearchBtnGlobal = document.getElementById('clear-search'); // El del HTML es #clear-search

const searchResults = document.getElementById('search-results');
const resultCounter = document.getElementById('result-counter');
const prevResult = document.getElementById('prev-result');
const nextResult = document.getElementById('next-result');
const closeSearchResultsBtn = document.getElementById('close-search-results'); 

let matches = [];
let currentIndex = -1;
let currentActiveContainer = null; 
let currentDocumentTitle = ''; 
let markInstance = null;

const zoomLevels = ['font-size-xs', 'font-size-s', 'font-size-m', 'font-size-l', 'font-size-xl'];
let currentZoomIndex = 2; // Índice para 'font-size-m' (default)

// Documentos y Minutas (sin cambios, asumo que están correctos)
const docs = [
  { file: 'docs/documento1.html', title: 'CÓDIGO PENAL', icon: 'fa-solid fa-gavel' },
  { file: 'docs/documento2.html', title: 'CÓDIGO PROCESAL PENAL', icon: 'fa-solid fa-scale-balanced' },
  { file: 'docs/documento3.html', title: 'LEY DE DROGAS', icon: 'fa-solid fa-pills' },
  { file: 'docs/documento4.html', title: 'LEY DE CONTROL DE ARMAS', icon: 'fa-solid fa-gun' },
  { file: 'docs/documento5.html', title: 'LEY DE PENAS SUSTITUTIVAS', icon: 'fa-solid fa-person-walking-arrow-right' },
  { file: 'docs/documento6.html', title: 'LEY DE VIOLENCIA INTRAFAMILIAR', icon: 'fa-solid fa-house-user' },
  { file: 'docs/documento7.html', title: 'LEY RPA', icon: 'fa-solid fa-child' },
  { file: 'docs/documento8.html', title: 'LEY RPA (Diferida)', icon: 'fa-solid fa-child-reaching' },
  { file: 'docs/documento9.html', title: 'LEY DE VIOLENCIA EN LOS ESTADIOS', icon: 'fa-solid fa-futbol' },
  { file: 'docs/documento10.html', title: 'LEY DE TRANSITO', icon: 'fa-solid fa-car' },
  { file: 'docs/documento11.html', title: 'LEY ORGANICA DEL MINISTERIO PUBLICO', icon: 'fa-solid fa-building-columns' },
  { file: 'docs/calculadora_abonos.html', title: 'Calculadora Abonos por Arresto', icon: 'fa-solid fa-calculator' },
  { file: 'minutas', title: 'Minutas Jurisprudencia', icon: 'fa-solid fa-book-bookmark' }
];
const docsMinutas = [
  { path: 'minutas/2_CONTROL_DE_IDENTIDAD-LEY_DE_TRANSITO_C.md', title: 'N° 2 CONTROL DE IDENTIDAD - LEY DE TRÁNSITO', category: 'Control de Identidad' },
  { path: 'minutas/3_ACCESO_A_INFORMACION_EN_FACEBOOK.md', title: 'N° 3 ACCESO A INFORMACIÓN EN FACEBOOK', category: 'Diligencias e Investigación' },
  { path: 'minutas/4_PRUEBA_POSTERIOR_AL_CIERRE.md', title: 'N° 4 PRUEBA POSTERIOR AL CIERRE', category: 'Procedimiento y Garantías' },
  { path: 'minutas/5_ARTICULO_195_LEY_18290.md', title: 'N° 5 ARTÍCULO 195 LEY 18290', category: 'Delitos y Tipicidad' },
  { path: 'minutas/6_REVISIÓN_DE_CELULARES.md', title: 'N° 6 REVISIÓN DE CELULARES', category: 'Diligencias e Investigación' },
  { path: 'minutas/7_PRIMERAS_DILIGENCIAS_Y_GPS.md', title: 'N° 7 PRIMERAS DILIGENCIAS Y GPS', category: 'Diligencias e Investigación' },
  { path: 'minutas/8_EFECTO_DE_LA_APELACIÓN_DE_LA_REVOCACIÓN_DE_LA_PENA_SUSTITUTIVA.md', title: 'N° 8 EFECTO DE LA APELACIÓN DE LA REVOCACIÓN DE PENA SUSTITUTIVA', category: 'Procedimiento y Garantías' },
  { path: 'minutas/9_CONTROL_DE_IDENTIDAD_EN_INVESTIGACION_EN_CURSO.md', title: 'N° 9 CONTROL DE IDENTIDAD EN INVESTIGACIÓN EN CURSO', category: 'Control de Identidad' },
  { path: 'minutas/10_COAUTORIA_EN_PORTE_O_TENENCIA_DE_ARMAS.md', title: 'N° 10 COAUTORÍA EN PORTE O TENENCIA DE ARMAS', category: 'Delitos y Tipicidad' },
  { path: 'minutas/11_INTERNACION_PROVISIONAL_PREVIA_AL_INFORME_SIQUIATRICO.md', title: 'N° 11 INTERNACIÓN PROVISIONAL PREVIA AL INFORME SÍQUIATRICO', category: 'Procedimiento y Garantías' },
  { path: 'minutas/12_TESTIGOS_NECESIDAD_DE_UNA_DECLARACIÓN_PREVIA.md', title: 'N° 12 TESTIGOS: NECESIDAD DE UNA DECLARACIÓN PREVIA', category: 'Procedimiento y Garantías' },
  { path: 'minutas/13_CONTROL_DE_IDENTIDAD_(ARROJAR_OBJETO).md', title: 'N° 13 CONTROL DE IDENTIDAD (ARROJAR OBJETO)', category: 'Control de Identidad' },
  { path: 'minutas/14_JUICIOS_POR_VIDEOCONFERENCIA_(RECLAMOS_CONCRETOS).md', title: 'N° 14 JUICIOS POR VIDEOCONFERENCIA (RECLAMOS CONCRETOS)', category: 'Procedimiento y Garantías' },
  { path: 'minutas/15_CONTROL_DE_IDENTIDAD_Y_DENUNCIA_ANÓNIMA.md', title: 'N° 15 CONTROL DE IDENTIDAD Y DENUNCIA ANÓNIMA', category: 'Control de Identidad' },
  { path: 'minutas/16_DETENCION_POR_GUARDIAS_DE_SEGURIDAD_O_MUNICIPALES.md', title: 'N° 16 DETENCIÓN POR GUARDIAS DE SEGURIDAD O MUNICIPALES', category: 'Detención y Aprehensión' },
  { path: 'minutas/17_OTRO_DOCUMENTO.md', title: 'N° 17 OTRO DOCUMENTO', category: 'Categoría Ejemplo' },
  { path: 'minutas/18_OTRA_CATEGORIA.md', title: 'N° 18 OTRA CATEGORÍA', category: 'Categoría Ejemplo' },
  { path: 'minutas/19_CADENA_DE_CUSTODIA_Y_DEBIDO_PROCESO.md', title: 'N° 19 CADENA DE CUSTODIA Y DEBIDO PROCESO', category: 'Evidencia y Cadena de Custodia' },
  { path: 'minutas/20_CONTROL_IDENTIDAD_OLOR_MARIHUANA.md', title: 'N° 20 CONTROL DE IDENTIDAD: OLOR A MARIHUANA', category: 'Control de Identidad' },
  { path: 'minutas/21_CONTROL_IDENTIDAD_Y_HUIDA.md', title: 'N° 21 CONTROL DE IDENTIDAD Y HUIDA', category: 'Control de Identidad' },
  { path: 'minutas/22_CONTROL_IDENTIDAD_Y_CAN_DETECTOR_DE_DROGAS.md', title: 'N° 22 CONTROL DE IDENTIDAD Y CAN DETECTOR DE DROGAS', category: 'Control de Identidad' },
  { path: 'minutas/23_RECLAMOS_POR_INFRACCIÓN_DE_GARANTÍAS_DE_TERCEROS.md', title: 'N° 23 RECLAMOS POR INFRACCIÓN DE GARANTÍAS DE TERCEROS', category: 'Procedimiento y Garantías' },
  { path: 'minutas/24_PORTE_O_TENENCIA_DE_UNA_MUNICIÓN.md', title: 'N° 24 PORTE O TENENCIA DE UNA MUNICIÓN', category: 'Delitos y Tipicidad' },
  { path: 'minutas/25_DELITO_CONTINUADO_-_REITERADO.md', title: 'N° 25 DELITO CONTINUADO REITERADO', category: 'Delitos y Tipicidad' },
  { path: 'minutas/26_CONTROL_VIA_PUBLICA.md', title: 'N° 26 CONTROL VÍA PÚBLICA', category: 'Control de Identidad' },
  { path: 'minutas/27_OBLIGATORIEDAD_ART_302_CPP.md', title: 'N° 27 OBLIGATORIEDAD ART. 302 CPP DURANTE ETAPA INVESTIGATIVA', category: 'Procedimiento y Garantías' },
  { path: 'minutas/28_ABUSO_SEXUAL_INTRODUCCION_DE_DEDOS.md', title: 'N° 28 ABUSO SEXUAL: INTRODUCCIÓN DE DEDOS', category: 'Delitos y Tipicidad' },
  { path: 'minutas/29_ACTUACIONES_AUTONOMAS_CARABINEROS.md', title: 'N° 29 ACTUACIONES AUTÓNOMAS DE CARABINEROS EN MANIFESTACIONES', category: 'Diligencias e Investigación' },
  { path: 'minutas/30_RETRACTACION_VICTIMA_331_LETRA_F_CPP.md', title: 'N° 30 RETRACTACIÓN VÍCTIMA ART. 331 LETRA F) CPP', category: 'Procedimiento y Garantías' },
  { path: 'minutas/31_INSTRUCCION_PRIMERAS_DILIGENCIAS.md', title: 'N° 31 INSTRUCCIÓN SOBRE PRIMERAS DILIGENCIAS', category: 'Diligencias e Investigación' },
  { path: 'minutas/32_OTRA_MINUTA.md', title: 'N° 32 OTRA MINUTA Ejemplo', category: 'Categoría Ejemplo' }
];


// --- Funciones Auxiliares ---
function showLoading(show) { loadingSpinner.classList.toggle('hidden', !show); }
function updateActiveButton(activeBtn, inactiveBtn) {
  activeBtn.classList.add('active');
  inactiveBtn.classList.remove('active');
}

// --- Event Listeners ---
gridBtn.addEventListener('click', () => {
  changeViewMode('grid');
  updateActiveButton(gridBtn, listBtn);
});
listBtn.addEventListener('click', () => {
  changeViewMode('list');
  updateActiveButton(listBtn, gridBtn);
});

btnBack.addEventListener('click', showHome);
homeBtn.addEventListener('click', showHome);

btnZoomIn.addEventListener('click', () => changeGlobalZoom(1));
btnZoomOut.addEventListener('click', () => changeGlobalZoom(-1));

toggleSearchBtn.addEventListener('click', () => {
  searchBar.classList.toggle('hidden');
  if (!searchBar.classList.contains('hidden')) {
    searchInput.focus();
    // Si hay un documento abierto y texto en el input, re-ejecutar búsqueda
    if (currentActiveContainer && searchInput.value.trim()) {
        performSearch(searchInput.value.trim());
    }
  } else {
    // Si se oculta la barra, también ocultar los resultados
    searchResults.classList.add('hidden');
    // No limpiamos highlights aquí, se mantienen si el usuario solo cierra la barra
  }
});

clearSearchBtnGlobal.addEventListener('click', () => {
  searchInput.value = '';
  clearSearchBtnGlobal.classList.add('hidden');
  if (currentActiveContainer) { 
      clearHighlights(); // Limpia los resaltados del documento
      searchResults.classList.add('hidden'); // Oculta la barra de resultados
  }
  searchInput.focus();
});

closeSearchResultsBtn.addEventListener('click', () => {
  // No limpiar el input, solo los resultados y highlights
  clearHighlights();
  searchResults.classList.add('hidden');
});

prevResult.addEventListener('click', () => navigateResults(-1));
nextResult.addEventListener('click', () => navigateResults(1));

searchInput.addEventListener('input', e => {
  const term = e.target.value.trim();
  clearSearchBtnGlobal.classList.toggle('hidden', !term);
  if (searchInput._timeout) clearTimeout(searchInput._timeout);
  searchInput._timeout = setTimeout(() => {
      if (currentActiveContainer && searchBar.offsetParent !== null) { // Solo buscar si hay visor y la barra de búsqueda está visible
          performSearch(term);
      } else if (!term && currentActiveContainer) { // Si el término se borra
          clearHighlights();
          searchResults.classList.add('hidden');
      }
  }, 300);
});

minutasCatFilter.addEventListener('change', loadMinutas);

// --- Lógica de Vistas y Navegación ---
function changeViewMode(mode) {
  const isGrid = mode === 'grid';
  docList.className = isGrid ? 'doc-grid' : 'doc-list'; // Reemplaza todas las clases por una sola
  minutasDocList.className = isGrid ? 'doc-grid' : 'doc-list'; // También para minutas
}

function populateDocList(targetElement, documents, isMinutas = false) {
    targetElement.innerHTML = '';
    const fragment = document.createDocumentFragment();
    documents.forEach(doc => {
        const card = document.createElement('div');
        card.className = 'doc-item'; // Clase base
        if (isMinutas) {
            // Para minutas, el título y la categoría. El icono se podría añadir a docsMinutas si se quiere.
            card.innerHTML = `<div class="doc-title">${doc.title}</div><div class="doc-category">${doc.category}</div>`;
            card.addEventListener('click', () => openDoc(doc.path, doc.title));
        } else {
            card.innerHTML = `<div class="doc-icon"><i class="${doc.icon}"></i></div><div class="doc-title">${doc.title}</div>`;
            card.addEventListener('click', () => doc.file === 'minutas' ? showMinutas() : openDoc(doc.file, doc.title));
        }
        fragment.appendChild(card);
    });
    targetElement.appendChild(fragment);
}

function loadDocs() { populateDocList(docList, docs); }

function showHome() {
  homeView.style.display = 'flex'; 
  minutasView.classList.add('hidden'); 
  viewer.style.display = 'none';
  docToolbar.classList.add('hidden');
  
  searchBar.classList.add('hidden'); // Ocultar barra de búsqueda al ir a home
  searchResults.classList.add('hidden'); 
  clearView(); 
  currentActiveContainer = null;
  docViewerTitle.textContent = ''; 
  document.title = 'Biblioteca Jurídica – ANF';
}

function clearView() {
  viewer.innerHTML = '';
  minutasViewer.innerHTML = '';
  clearHighlights(); // Asegurar que los highlights se limpien
}

async function openDoc(path, title) {
  showLoading(true);
  clearView(); // Limpia visores y cualquier resaltado anterior
  homeView.style.display = 'none';
  minutasView.classList.add('hidden');
  docToolbar.classList.remove('hidden');
  docViewerTitle.textContent = title; 
  currentDocumentTitle = title;

  // La searchBar se controla con su propio botón toggleSearchBtn, no se muestra/oculta aquí.
  // Pero sí ocultamos los resultados de una búsqueda anterior.
  searchResults.classList.add('hidden');

  let targetViewer;
  if (path.startsWith('minutas/')) {
    minutasView.classList.remove('hidden'); 
    minutasDocListContainer.style.display = 'none'; 
    minutasCatFilter.parentElement.style.display = 'none'; 
    minutasViewer.style.display = 'block';
    targetViewer = minutasViewer;
  } else {
    viewer.style.display = 'block';
    targetViewer = viewer;
  }
  currentActiveContainer = targetViewer;
  // El zoom global se aplica al body, así que el nuevo contenido lo respetará.

  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const content = await response.text();
    
    if (path.endsWith('.html')) {
      targetViewer.innerHTML = content;
    } else if (path.endsWith('.md')) {
      // Usar { sanitize: false } si confías en el contenido de tus MD.
      // Si no, marked.parse sanitizará por defecto, lo que puede quitar algunos estilos o scripts.
      // Para una biblioteca interna, sanitize: false suele ser seguro.
      targetViewer.innerHTML = marked.parse(content, { breaks: true }); // breaks:true para saltos de línea tipo GFM
    } else {
      targetViewer.innerHTML = `<pre>${content}</pre>`; 
    }
    
    if (path.endsWith('.html')) { // Re-aplicar highlight.js para código en HTML
        targetViewer.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    }
    document.title = `${title} – Biblioteca Jurídica`;

    // Si la barra de búsqueda está visible y hay texto, realizar búsqueda
    if (searchInput.value.trim() && !searchBar.classList.contains('hidden')) {
        performSearch(searchInput.value.trim());
    }

  } catch (err) {
    targetViewer.innerHTML = `<div class="error-container" style="padding:1rem; color:red;"><h4>Error al cargar documento:</h4><p>${path}</p><p>${err.message}</p></div>`;
    console.error("Error fetching document:", path, err);
  } finally {
    showLoading(false);
    if (targetViewer) targetViewer.scrollTop = 0; 
  }
}

// --- Funciones de Zoom Global ---
function applyGlobalZoom() {
  zoomLevels.forEach(level => document.body.classList.remove(level));
  document.body.classList.add(zoomLevels[currentZoomIndex]);
}
function changeGlobalZoom(delta) {
  const newZoomIndex = currentZoomIndex + delta;
  if (newZoomIndex >= 0 && newZoomIndex < zoomLevels.length) {
    currentZoomIndex = newZoomIndex;
    applyGlobalZoom();
  }
}

// --- Funciones de Búsqueda ---
function clearHighlights() {
  if (markInstance) {
    markInstance.unmark();
    markInstance = null; 
  }
  matches = [];
  currentIndex = -1;
  // No ocultar searchResults aquí, se gestiona en performSearch o al cerrar la barra/resultados
  updateResultsUI(); // Actualiza el contador a "0 de 0" o similar
}

function performSearch(term) {
  if (!currentActiveContainer) {
    searchResults.classList.add('hidden');
    return;
  }
  clearHighlights(); // Limpia resaltados anteriores antes de una nueva búsqueda

  if (!term) { // Si el término está vacío, no hay nada que buscar
    searchResults.classList.add('hidden');
    return;
  }

  markInstance = new Mark(currentActiveContainer);
  markInstance.mark(term, {
    separateWordSearch: false, 
    className: 'highlighted-match', 
    accuracy: "partially", // Permite coincidencias parciales
    wildcards: "disabled", // O "enabled" si quieres usar * como comodín
    ignoreJoiners: true, // Ignora guiones, etc. para unir palabras
    done: (count) => {
      matches = Array.from(currentActiveContainer.querySelectorAll('mark.highlighted-match')); // Seleccionar solo los nuestros
      if (matches.length > 0) {
        currentIndex = 0;
        scrollToMatch();
        searchResults.classList.remove('hidden'); // Mostrar resultados
      } else {
        searchResults.classList.add('hidden'); // Ocultar si no hay resultados
      }
      updateResultsUI();
    },
    noMatch: (term) => {
        searchResults.classList.add('hidden');
        updateResultsUI(); // Asegurar que el contador se actualice
    }
  });
}

function scrollToMatch() {
  if (!matches.length || currentIndex < 0 || currentIndex >= matches.length) return;
  
  // Quitar clase 'current-match' de cualquier match anterior
  const prevCurrent = currentActiveContainer.querySelector('mark.current-match');
  if (prevCurrent) prevCurrent.classList.remove('current-match');
  
  const currentMatchElement = matches[currentIndex];
  currentMatchElement.classList.add('current-match'); // Añadir clase al match actual
  currentMatchElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function navigateResults(direction) {
  if (!matches.length) return;
  currentIndex = (currentIndex + direction + matches.length) % matches.length;
  scrollToMatch();
  updateResultsUI();
}

function updateResultsUI() {
  if (matches.length > 0) {
    resultCounter.textContent = `${currentIndex + 1} de ${matches.length}`;
  } else {
    // Si hay un término de búsqueda pero no resultados.
    resultCounter.textContent = searchInput.value.trim() ? '0 resultados' : '';
  }
}

// --- Funciones de Minutas ---
function showMinutas() {
  homeView.style.display = 'none';
  viewer.style.display = 'none';
  docToolbar.classList.add('hidden');
  
  minutasView.classList.remove('hidden');
  minutasDocListContainer.style.display = 'block'; 
  minutasCatFilter.parentElement.style.display = 'block'; 
  minutasViewer.style.display = 'none'; 

  searchBar.classList.add('hidden'); // Ocultar barra de búsqueda en vista de minutas (lista)
  searchResults.classList.add('hidden'); 
  clearView();
  currentActiveContainer = null;
  docViewerTitle.textContent = '';
  document.title = 'Minutas Jurisprudencia – Biblioteca Jurídica';
  loadMinutas(); 
}

function loadMinutas() {
  const category = minutasCatFilter.value;
  const filteredMinutas = docsMinutas.filter(doc => category === 'all' || doc.category === category);
  populateDocList(minutasDocList, filteredMinutas, true);
  if (minutasDocListContainer) minutasDocListContainer.scrollTop = 0; 
}

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
    const minutasCategories = [...new Set(docsMinutas.map(m => m.category))].sort();
    minutasCategories.forEach(cat => {
        if (!Array.from(minutasCatFilter.options).find(opt => opt.value === cat)) {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            minutasCatFilter.appendChild(option);
        }
    });
    
    if (window.location.hash === '#minutas') {
        showMinutas();
    } else {
        showHome(); // Iniciar en Home por defecto si no hay hash
        loadDocs(); 
    }
    
    // Establecer vista por defecto y aplicar zoom inicial
    // Leer desde localStorage si se guardó la preferencia de vista
    const savedView = localStorage.getItem('bibliotecaViewMode') || 'grid';
    changeViewMode(savedView);
    updateActiveButton(savedView === 'grid' ? gridBtn : listBtn, savedView === 'grid' ? listBtn : gridBtn);

    // Leer desde localStorage el nivel de zoom
    const savedZoomIndex = parseInt(localStorage.getItem('bibliotecaZoomIndex'));
    if (!isNaN(savedZoomIndex) && savedZoomIndex >= 0 && savedZoomIndex < zoomLevels.length) {
        currentZoomIndex = savedZoomIndex;
    }
    applyGlobalZoom();

    // Inicialmente el botón de limpiar búsqueda está oculto
    clearSearchBtnGlobal.classList.add('hidden');
    searchResults.classList.add('hidden'); // Asegurarse que esté oculto al inicio
});

// Guardar preferencias en localStorage
window.addEventListener('beforeunload', () => {
    localStorage.setItem('bibliotecaViewMode', docList.classList.contains('doc-grid') ? 'grid' : 'list');
    localStorage.setItem('bibliotecaZoomIndex', currentZoomIndex.toString());
});