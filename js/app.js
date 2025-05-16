// === ELEMENTOS DEL DOM ===
const loadingSpinner = document.getElementById('loading-spinner');
const appContainer = document.getElementById('app'); // Para clases de zoom global

const homeView = document.getElementById('home-view');
const viewToolbar = document.getElementById('view-toolbar');
const gridBtn = document.getElementById('grid-view-btn');
const listBtn = document.getElementById('list-view-btn');
const docListContainer = document.getElementById('docListContainer'); // Nuevo contenedor
const docList = document.getElementById('docList');

const docToolbar = document.getElementById('doc-toolbar');
const docViewerTitle = document.getElementById('doc-viewer-title'); // Nuevo para título
const btnBack = document.getElementById('btn-back');
const btnZoomIn = document.getElementById('btn-font-increase');
const btnZoomOut = document.getElementById('btn-font-decrease');
const viewer = document.getElementById('viewer');

const minutasView = document.getElementById('minutas-view');
const homeBtn = document.getElementById('home-btn');
const minutasCatFilter = document.getElementById('minutas-catFilter');
const minutasDocListContainer = document.getElementById('minutasDocListContainer'); // Nuevo contenedor
const minutasDocList = document.getElementById('minutas-docList');
const minutasViewer = document.getElementById('minutas-viewer');

const toggleSearchBtn = document.getElementById('toggle-search');
const searchBar = document.getElementById('search-bar');
const searchInput = document.getElementById('search');
const clearSearchBtn = document.getElementById('clear-search'); // Nuevo

const searchResults = document.getElementById('search-results');
const resultCounter = document.getElementById('result-counter');
const prevResult = document.getElementById('prev-result');
const nextResult = document.getElementById('next-result');
const closeSearchResultsBtn = document.getElementById('close-search-results'); // Renombrado

let matches = [];
let currentIndex = -1;
let currentActiveContainer = null; // viewer o minutasViewer
let currentDocumentTitle = ''; // Para mostrar en la toolbar
let markInstance = null;

// Zoom Global
const zoomLevels = ['font-size-xs', 'font-size-s', 'font-size-m', 'font-size-l', 'font-size-xl'];
let currentZoomIndex = 2; // Índice para 'font-size-m' (default)

// Documentos (sin cambios)
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

// Definición de minutas (sin cambios)
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
function showLoading(show) {
  loadingSpinner.classList.toggle('hidden', !show);
}

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
homeBtn.addEventListener('click', showHome); // Para el botón en la vista de minutas

btnZoomIn.addEventListener('click', () => changeGlobalZoom(1));
btnZoomOut.addEventListener('click', () => changeGlobalZoom(-1));

toggleSearchBtn.addEventListener('click', () => {
  searchBar.classList.toggle('hidden');
  if (!searchBar.classList.contains('hidden')) {
    searchInput.focus();
  }
  // Opcional: si la barra de búsqueda es parte del header principal y no de la vista de documento,
  // no la ocultes al abrir un documento.
});

clearSearchBtn.addEventListener('click', () => {
  searchInput.value = '';
  clearSearchBtn.classList.add('hidden');
  if (currentActiveContainer) { // Solo limpiar highlights si hay un visor activo
      clearHighlights();
      searchResults.classList.add('hidden'); // Ocultar barra de resultados
  }
  searchInput.focus();
});

closeSearchResultsBtn.addEventListener('click', () => {
  searchInput.value = ''; // Opcional: podrías querer mantener el término
  clearSearchBtn.classList.add('hidden');
  clearHighlights();
  searchResults.classList.add('hidden');
});


prevResult.addEventListener('click', () => navigateResults(-1));
nextResult.addEventListener('click', () => navigateResults(1));

searchInput.addEventListener('input', e => {
  const term = e.target.value.trim();
  clearSearchBtn.classList.toggle('hidden', !term);
  if (searchInput._timeout) clearTimeout(searchInput._timeout);
  searchInput._timeout = setTimeout(() => {
      if (currentActiveContainer) { // Solo buscar si hay un visor activo
          performSearch(term);
      }
  }, 300);
});

minutasCatFilter.addEventListener('change', loadMinutas);

document.addEventListener('DOMContentLoaded', () => {
  loadDocs();
  changeViewMode('grid'); // Vista por defecto
  applyGlobalZoom();
  updateActiveButton(gridBtn, listBtn); // Estado inicial botones de vista
  // Inicialmente searchResults está oculto por CSS
});

// --- Lógica de Vistas y Navegación ---
function changeViewMode(mode) {
  if (mode === 'grid') {
    docList.classList.remove('doc-list');
    docList.classList.add('doc-grid');
    // Para minutas, si también quieres que cambie
    minutasDocList.classList.remove('doc-list');
    minutasDocList.classList.add('doc-grid'); // Asumiendo que minutas también puede ser grid
  } else {
    docList.classList.remove('doc-grid');
    docList.classList.add('doc-list');
    minutasDocList.classList.remove('doc-grid');
    minutasDocList.classList.add('doc-list');
  }
}

function populateDocList(targetElement, documents, isMinutas = false) {
    targetElement.innerHTML = '';
    const fragment = document.createDocumentFragment();
    documents.forEach(doc => {
        const card = document.createElement('div');
        card.className = 'doc-item';
        if (isMinutas) {
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


function loadDocs() {
  populateDocList(docList, docs);
}

function showHome() {
  homeView.style.display = 'flex'; // Es un flex container
  minutasView.classList.add('hidden'); // Usar clase para ocultar
  viewer.style.display = 'none';
  docToolbar.classList.add('hidden');
  
  // Comportamiento de la barra de búsqueda al volver a Home:
  // Opción 1: Siempre ocultar y limpiar
  // searchBar.classList.add('hidden');
  // searchInput.value = '';
  // clearSearchBtn.classList.add('hidden');

  // Opción 2: Mantenerla visible si estaba abierta, pero no funcional hasta abrir doc.
  // (El comportamiento actual de performSearch ya previene buscar sin currentActiveContainer)

  searchResults.classList.add('hidden'); // Ocultar siempre los resultados de búsqueda
  clearView(); // Limpia el contenido de los visores
  currentActiveContainer = null;
  docViewerTitle.textContent = ''; // Limpiar título del visor
  document.title = 'Biblioteca Jurídica – ANF';
  // No es necesario recargar los docs si no cambian
}

function clearView() {
  viewer.innerHTML = '';
  minutasViewer.innerHTML = '';
  if (markInstance) clearHighlights(); // Limpiar highlights de Mark.js
}

async function openDoc(path, title) {
  showLoading(true);
  clearView();
  homeView.style.display = 'none';
  minutasView.classList.add('hidden');
  docToolbar.classList.remove('hidden');
  docViewerTitle.textContent = title; // Mostrar título en la toolbar
  currentDocumentTitle = title;

  // Decidir si la barra de búsqueda debe estar visible al abrir un documento
  // searchBar.classList.remove('hidden'); // Si quieres que siempre se muestre
  // searchInput.focus(); // Opcional

  searchResults.classList.add('hidden'); // Ocultar resultados de búsqueda anteriores

  let targetViewer;
  if (path.startsWith('minutas/')) {
    minutasView.classList.remove('hidden'); // Mostrar la vista de minutas completa
    minutasDocListContainer.style.display = 'none'; // Ocultar lista de minutas
    minutasCatFilter.parentElement.style.display = 'none'; // Ocultar controles de filtro
    minutasViewer.style.display = 'block';
    targetViewer = minutasViewer;
  } else {
    viewer.style.display = 'block';
    targetViewer = viewer;
  }
  currentActiveContainer = targetViewer;
  // applyGlobalZoom(); // Aplicar zoom al nuevo visor activo (ya lo hace el cambio de clase en body)

  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const content = await response.text();
    
    if (path.endsWith('.html')) {
      targetViewer.innerHTML = content;
    } else if (path.endsWith('.md')) {
      targetViewer.innerHTML = marked.parse(content);
    } else {
      targetViewer.innerHTML = `<pre>${content}</pre>`; // Para otros tipos de texto
    }
    
    // Re-aplicar highlight.js si es necesario (para contenido HTML que podría tener <pre><code>)
    if (path.endsWith('.html')) {
        targetViewer.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    }
    document.title = `${title} – Biblioteca Jurídica`;

    // Si el input de búsqueda tiene texto, realizar la búsqueda automáticamente
    if (searchInput.value.trim()) {
        performSearch(searchInput.value.trim());
    }

  } catch (err) {
    targetViewer.innerHTML = `<div class="error-container"><p>Error al cargar: ${path}</p><p>${err.message}</p></div>`;
    console.error("Error fetching document:", err);
  } finally {
    showLoading(false);
    targetViewer.scrollTop = 0; // Scroll al inicio del documento
  }
}

// --- Funciones de Zoom Global ---
function applyGlobalZoom() {
  // Quitar clases de zoom anteriores
  zoomLevels.forEach(level => document.body.classList.remove(level));
  // Añadir clase de zoom actual
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
    markInstance = null; // Liberar instancia
  }
  matches = [];
  currentIndex = -1;
  // searchResults.classList.add('hidden'); // No ocultar aquí, se maneja en performSearch o close
  updateResultsUI();
}

function performSearch(term) {
  if (!currentActiveContainer) return;
  clearHighlights();

  if (!term) {
    searchResults.classList.add('hidden'); // Ocultar si el término está vacío
    return;
  }

  markInstance = new Mark(currentActiveContainer);
  markInstance.mark(term, {
    separateWordSearch: false, // O true si prefieres buscar palabras individualmente
    className: 'highlighted-match', // Clase para personalizar el estilo del match
    done: (count) => {
      matches = Array.from(currentActiveContainer.querySelectorAll('.highlighted-match'));
      if (matches.length > 0) {
        currentIndex = 0;
        scrollToMatch();
        searchResults.classList.remove('hidden');
      } else {
        searchResults.classList.add('hidden');
      }
      updateResultsUI();
    }
  });
}

function scrollToMatch() {
  if (!matches.length || currentIndex < 0) return;
  matches.forEach(match => match.classList.remove('current-match')); // Quitar clase de match actual anterior
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
    resultCounter.textContent = searchInput.value.trim() ? '0 resultados' : '0 de 0';
  }
}

// --- Funciones de Minutas ---
function showMinutas() {
  homeView.style.display = 'none';
  viewer.style.display = 'none';
  docToolbar.classList.add('hidden');
  
  minutasView.classList.remove('hidden');
  minutasDocListContainer.style.display = 'block'; // Mostrar lista de minutas
  minutasCatFilter.parentElement.style.display = 'block'; // Mostrar controles
  minutasViewer.style.display = 'none'; // Ocultar visor de minutas

  // Comportamiento de la barra de búsqueda en vista de minutas
  // Opción 1: Ocultarla
  // searchBar.classList.add('hidden');
  // searchInput.value = '';
  // clearSearchBtn.classList.add('hidden');

  searchResults.classList.add('hidden'); // Ocultar resultados de búsqueda
  clearView();
  currentActiveContainer = null;
  docViewerTitle.textContent = '';
  document.title = 'Minutas Jurisprudencia – Biblioteca Jurídica';
  loadMinutas(); // Carga las minutas (ya considera el filtro)
}

function loadMinutas() {
  const category = minutasCatFilter.value;
  const filteredMinutas = docsMinutas.filter(doc => category === 'all' || doc.category === category);
  populateDocList(minutasDocList, filteredMinutas, true);
  minutasDocListContainer.scrollTop = 0; // Scroll al inicio de la lista
}

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
    // Asegurar que las categorías de minutas estén en el select
    const minutasCategories = [...new Set(docsMinutas.map(m => m.category))].sort();
    minutasCategories.forEach(cat => {
        if (!Array.from(minutasCatFilter.options).find(opt => opt.value === cat)) {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            minutasCatFilter.appendChild(option);
        }
    });
    
    loadDocs();
    changeViewMode(gridBtn.classList.contains('active') ? 'grid' : 'list');
    applyGlobalZoom();
    // searchResults está oculto por CSS/JS inicialmente
});