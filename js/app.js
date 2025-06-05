// === ELEMENTOS DEL DOM ===
const loadingSpinner = document.getElementById('loading-spinner');

const homeView = document.getElementById('home-view');
const viewToolbar = document.getElementById('view-toolbar');
const gridBtn = document.getElementById('grid-view-btn');
const listBtn = document.getElementById('list-view-btn');
const docListContainer = document.getElementById('docListContainer');
const docList = document.getElementById('docList');

const docViewerToolbar = document.getElementById('doc-viewer-toolbar');
const docViewerTitleText = document.getElementById('doc-viewer-title-text');
const btnBackToHome = document.getElementById('btn-back-to-home');
const btnZoomIn = document.getElementById('btn-font-increase');
const btnZoomOut = document.getElementById('btn-font-decrease');
const viewer = document.getElementById('viewer');
const viewerSection = document.getElementById('viewer-section');

const minutasView = document.getElementById('minutas-view');
const homeBtnMinutas = document.getElementById('home-btn-minutas');
const minutasCatFilter = document.getElementById('minutas-catFilter');
const minutasDocListContainer = document.getElementById('minutasDocListContainer');
const minutasDocList = document.getElementById('minutas-docList');
const minutasViewer = document.getElementById('minutas-viewer');

const toggleSearchBtnHeader = document.getElementById('toggle-search-btn-header');
const searchBarContainer = document.getElementById('search-bar-container');
const searchInputMain = document.getElementById('search-input-main');
const clearSearchInputBtn = document.getElementById('clear-search-input-btn');

const searchResultsBar = document.getElementById('search-results-bar');
const resultCounterSpan = document.getElementById('result-counter-span');
const prevResultBtn = document.getElementById('prev-result-btn');
const nextResultBtn = document.getElementById('next-result-btn');
const closeSearchResultsBtnMain = document.getElementById('close-search-results-btn');

let matches = [];
let currentIndex = -1;
let currentActiveContainer = null;
let currentDocumentTitle = '';
let markInstance = null;

const zoomLevels = ['font-size-xs', 'font-size-s', 'font-size-m', 'font-size-l', 'font-size-xl'];
let currentZoomIndex = 2;

// --- DATOS ---
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

// --- FUNCIONES AUXILIARES ---
function showLoading(show) { loadingSpinner.classList.toggle('hidden', !show); }
function updateActiveButton(activeBtn, inactiveBtn) {
  if (activeBtn) activeBtn.classList.add('active');
  if (inactiveBtn) inactiveBtn.classList.remove('active');
}

function _applyDiagnosticStyles(toolbarElement, context, backgroundColor) {
    if (!toolbarElement) {
        console.error('Diagnostic styles: Toolbar element not found. Context:', context);
        return;
    }
    console.log(`Applying diagnostic styles to toolbar. Context: [${context}], Background: [${backgroundColor}]`);
    
    toolbarElement.style.setProperty('display', 'flex', 'important');
    toolbarElement.style.setProperty('visibility', 'visible', 'important');
    toolbarElement.style.setProperty('opacity', '1', 'important');
    toolbarElement.style.setProperty('height', '48px', 'important'); // Assuming var(--toolbar-height) is 48px
    toolbarElement.style.setProperty('position', 'sticky', 'important');
    toolbarElement.style.setProperty('top', '0px', 'important');
    toolbarElement.style.setProperty('left', '0px', 'important');
    toolbarElement.style.setProperty('width', '100%', 'important');
    toolbarElement.style.setProperty('z-index', '20000', 'important'); // Very high z-index
    toolbarElement.style.setProperty('background-color', backgroundColor, 'important');
    toolbarElement.style.setProperty('border', '3px solid lime', 'important'); // Increased border for visibility
    toolbarElement.style.setProperty('color', 'black', 'important'); // Ensure text on buttons is visible
}

function resetToolbarStyles(toolbarElement, context) {
    if (!toolbarElement) {
        console.error('resetToolbarStyles: Toolbar element not found. Context:', context);
        return;
    }
    // console.log(`Resetting toolbar styles. Context: [${context}]`);

    toolbarElement.style.setProperty('display', 'flex');
    toolbarElement.style.setProperty('visibility', 'visible');
    toolbarElement.style.setProperty('opacity', '1');
    toolbarElement.style.setProperty('height', 'var(--toolbar-height)');
    toolbarElement.style.setProperty('position', 'sticky');
    toolbarElement.style.setProperty('top', '0px');
    toolbarElement.style.setProperty('left', '0px');
    toolbarElement.style.setProperty('width', '100%');
    toolbarElement.style.setProperty('z-index', '200'); // Original z-index from CSS
    toolbarElement.style.setProperty('background-color', 'var(--card-bg)'); // Original background from CSS
    
    // Reset all borders first then apply the specific one it needs
    toolbarElement.style.setProperty('border', 'none'); 
    toolbarElement.style.setProperty('border-bottom', '1px solid #e0e0e0'); // From .toolbar CSS in stylesheet

    // Gentle repaint trigger
    toolbarElement.style.setProperty('transform', 'translateZ(0)');
    setTimeout(() => {
        toolbarElement.style.removeProperty('transform');
    }, 0);
}


function ensureToolbarVisible() {
  if (!docViewerToolbar) return;
  const isMarkdown = currentActiveContainer?.dataset?.isMarkdown === 'true';
  docViewerToolbar.classList.remove('hidden');
  resetToolbarStyles(
    docViewerToolbar,
    isMarkdown
      ? 'desde ensureToolbarVisible (Markdown)'
      : 'desde ensureToolbarVisible (HTML)'
  );
}

// --- EVENT LISTENERS ---
gridBtn.addEventListener('click', () => {
  changeViewMode('grid');
  updateActiveButton(gridBtn, listBtn);
});
listBtn.addEventListener('click', () => {
  changeViewMode('list');
  updateActiveButton(listBtn, gridBtn);
});

btnBackToHome.addEventListener('click', showHome);
homeBtnMinutas.addEventListener('click', showHome);

btnZoomIn.addEventListener('click', () => changeGlobalZoom(1));
btnZoomOut.addEventListener('click', () => changeGlobalZoom(-1));

toggleSearchBtnHeader.addEventListener('click', () => {
  const isNowHidden = searchBarContainer.classList.toggle('hidden');
  document.body.classList.toggle('search-bar-visible', !isNowHidden);
  let stylesResetApplied = false; // Changed from diagnosticApplied
  
  if (!isNowHidden) { 
    searchInputMain.focus();
    if (currentActiveContainer && searchInputMain.value.trim()) {
        performSearch(searchInputMain.value.trim());
    }
  } else { 
    searchResultsBar.classList.add('hidden'); 
    if (currentActiveContainer) {
        const isDocMarkdown = currentActiveContainer.dataset.isMarkdown === 'true';
        // _applyDiagnosticStyles removed
        resetToolbarStyles(docViewerToolbar, isDocMarkdown ? "Markdown doc, search bar closed" : "HTML doc, search bar closed");
        stylesResetApplied = true; 
    }
  }

  if (currentActiveContainer) {
      if (!stylesResetApplied) { 
          ensureToolbarVisible();
}
      // If stylesResetApplied is true, resetToolbarStyles handles visibility.
  } else {
      docViewerToolbar.classList.add('hidden');
  }
});

clearSearchInputBtn.addEventListener('click', () => {
  searchInputMain.value = '';
  clearSearchInputBtn.classList.add('hidden');
  if (currentActiveContainer) {
      clearHighlights();
      searchResultsBar.classList.add('hidden');
  }
  searchInputMain.focus();
});

closeSearchResultsBtnMain.addEventListener('click', () => {
  clearHighlights();
  searchResultsBar.classList.add('hidden');
});

prevResultBtn.addEventListener('click', () => navigateResults(-1));
nextResultBtn.addEventListener('click', () => navigateResults(1));

searchInputMain.addEventListener('input', e => {
  const term = e.target.value.trim();
  clearSearchInputBtn.classList.toggle('hidden', !term);
  if (searchInputMain._timeout) clearTimeout(searchInputMain._timeout);
  searchInputMain._timeout = setTimeout(() => {
      if (currentActiveContainer && !searchBarContainer.classList.contains('hidden')) {
          performSearch(term);
      } else if (!term && currentActiveContainer) {
          clearHighlights();
          searchResultsBar.classList.add('hidden');
      }

      if (currentActiveContainer && !docViewerToolbar.classList.contains('hidden') && searchBarContainer.classList.contains('hidden')) {
          // This case should ideally not happen if search bar is hidden, but as a safeguard
          // if a search term was entered, then search bar hidden quickly.
      } else if (currentActiveContainer) {
          ensureToolbarVisible();
// console.log("searchInputMain input: docViewerToolbar forced visible if currentActiveContainer");
      }
  }, 300);
});

minutasCatFilter.addEventListener('change', loadMinutas);

// --- LÓGICA DE VISTAS Y NAVEGACIÓN ---
function changeViewMode(mode) {
  // console.log(`changeViewMode(${mode})`);
  const isGrid = mode === 'grid';
  docList.className = isGrid ? 'doc-grid' : 'doc-list';
  minutasDocList.className = isGrid ? 'doc-grid' : 'doc-list';
}

function populateDocList(targetElement, documents, isMinutas = false) {
  // console.log(`populateDocList para ${targetElement.id}, ${documents.length} items, isMinutas: ${isMinutas}`);
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
          card.addEventListener('click', () => doc.file === 'minutas' ? showMinutasListView() : openDoc(doc.file, doc.title));
      }
      fragment.appendChild(card);
  });
  targetElement.appendChild(fragment);
}

function loadDocs() { 
    // console.log("loadDocs()"); 
    populateDocList(docList, docs); 
}

function showHome() {
  // console.log("showHome() llamado");
  homeView.style.display = 'flex';
  minutasView.classList.add('hidden');
  if (viewerSection) viewerSection.classList.add('hidden');
  minutasViewer.style.display = 'none';
  docViewerToolbar.classList.add('hidden');

  searchBarContainer.classList.add('hidden'); 
  document.body.classList.remove('search-bar-visible');
  searchResultsBar.classList.add('hidden'); 
  
  clearView();
  currentActiveContainer = null; 
  docViewerTitleText.textContent = '';
  document.title = 'Biblioteca Jurídica – ANF';
  if (toggleSearchBtnHeader) toggleSearchBtnHeader.style.display = 'block';
}

function clearView() {
  // console.log("clearView()");
  viewer.innerHTML = '';
  minutasViewer.innerHTML = '';
  clearHighlights();
}

async function openDoc(path, title) {
  // console.log(`openDoc() llamado con path: ${path}, title: ${title}`);
  showLoading(true);
  clearView(); 
  
  homeView.style.display = 'none'; 
  ensureToolbarVisible();
// console.log("openDoc: docViewerToolbar.classList.remove('hidden') llamado");

  docViewerTitleText.textContent = title;
  currentDocumentTitle = title;
  searchResultsBar.classList.add('hidden');

  let targetViewer;
  if (path.startsWith('minutas/')) {
    minutasView.classList.remove('hidden');
    minutasDocListContainer.style.display = 'none';
    if (minutasCatFilter.parentElement) minutasCatFilter.parentElement.style.display = 'none';
    if (viewerSection) viewerSection.classList.add('hidden');
    minutasViewer.style.display = 'block';
    targetViewer = minutasViewer;
  } else {
    minutasView.classList.add('hidden');
    minutasViewer.style.display = 'none';
    if (viewerSection) viewerSection.classList.remove('hidden');
    targetViewer = viewer;
  }

  if (!targetViewer) {
      console.error("CRITICAL: targetViewer no se estableció.");
      showLoading(false);
      return;
  }
  currentActiveContainer = targetViewer; 
  if (currentActiveContainer) {
      currentActiveContainer.dataset.isMarkdown = path.endsWith('.md').toString();
  }

  try {
    if (location.protocol === 'file:' && path.endsWith('.html')) {
      targetViewer.innerHTML = `<iframe src="${path}" class="embedded-iframe"></iframe>`;
      document.title = `${title} – Biblioteca Jurídica`;
      showLoading(false);
      return;
    }

    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status} for ${path}`);
    const content = await response.text();

    if (path.endsWith('.html')) {
      targetViewer.innerHTML = content;
    } else if (path.endsWith('.md')) {
      targetViewer.innerHTML = marked.parse(content, { breaks: true, gfm: true });
    } else {
      targetViewer.innerHTML = `<pre>${content}</pre>`;
    }
    
    if (typeof hljs !== 'undefined') {
        targetViewer.querySelectorAll('pre code').forEach(block => {
            hljs.highlightElement(block);
        });
    }
    document.title = `${title} – Biblioteca Jurídica`;

    if (searchInputMain.value.trim() && !searchBarContainer.classList.contains('hidden')) {
        performSearch(searchInputMain.value.trim());
    }
  } catch (err) {
    console.error("Error en openDoc al cargar contenido:", err);
    if (targetViewer) {
        targetViewer.innerHTML = `<div class="error-container" style="padding:1rem; color:red;"><h4>Error al cargar documento:</h4><p>${path}</p><p>${err.message}</p></div>`;
    }
  } finally {
    showLoading(false);
    if (targetViewer) targetViewer.scrollTop = 0;
  }
}

// --- FUNCIONES DE ZOOM GLOBAL ---
function applyGlobalZoom() {
  zoomLevels.forEach(level => document.body.classList.remove(level));
  document.body.classList.add(zoomLevels[currentZoomIndex]);
  // console.log("Zoom aplicado:", zoomLevels[currentZoomIndex]);
}
function changeGlobalZoom(delta) {
  const newZoomIndex = currentZoomIndex + delta;
  if (newZoomIndex >= 0 && newZoomIndex < zoomLevels.length) {
    currentZoomIndex = newZoomIndex;
    applyGlobalZoom();
  }
}

// --- FUNCIONES DE BÚSQUEDA ---
function clearHighlights() {
  // console.log("clearHighlights()");
  if (markInstance && currentActiveContainer) {
    // const isMarkdownDocument = currentActiveContainer.dataset.isMarkdown === 'true'; // Already got this for diagnostics, ensure it's here or re-declare
    // If not already declared in this scope, uncomment the line above or ensure it's available.
    // For safety, let's re-evaluate it here based on currentActiveContainer which is confirmed.
    const isDocMarkdown = currentActiveContainer.dataset.isMarkdown === 'true';
    markInstance.unmark();
    markInstance = null;
    // _applyDiagnosticStyles removed
    resetToolbarStyles(docViewerToolbar, isDocMarkdown ? "Markdown doc, after clearHighlights" : "HTML doc, after clearHighlights");
  } else if (markInstance) { 
    markInstance.unmark();
    markInstance = null;
  }
  matches = [];
  currentIndex = -1;
  updateResultsUI();
}

function performSearch(term) {
  // console.log(`performSearch("${term}")`);
  if (!currentActiveContainer) {
    searchResultsBar.classList.add('hidden');
    return;
  }
  clearHighlights();

  if (!term) {
    searchResultsBar.classList.add('hidden');
    if (currentActiveContainer) { // Asegurar que la toolbar del visor NO se oculte
        ensureToolbarVisible();
// console.log("performSearch (término vacío): docViewerToolbar forzada a visible");
    }
    return;
  }

  markInstance = new Mark(currentActiveContainer);
  markInstance.mark(term, {
    separateWordSearch: false, className: 'highlighted-match',
    accuracy: "partially", ignoreJoiners: true,
    done: (_count) => {
      matches = Array.from(currentActiveContainer.querySelectorAll('mark.highlighted-match'));
      // console.log(`Búsqueda finalizada, ${matches.length} resultados.`);
      if (matches.length > 0) {
        currentIndex = 0;
        scrollToMatch();
        searchResultsBar.classList.remove('hidden');
      } else {
        searchResultsBar.classList.add('hidden');
      }
      updateResultsUI();
      if (currentActiveContainer) { // Asegurar que la toolbar del visor esté visible
        ensureToolbarVisible();
// console.log("performSearch (done): docViewerToolbar forzada a visible");
      }
    },
    noMatch: (_term) => {
        // console.log("Búsqueda sin resultados para:", _term);
        searchResultsBar.classList.add('hidden');
        updateResultsUI();
        if (currentActiveContainer) { // Asegurar que la toolbar del visor esté visible
            ensureToolbarVisible();
// console.log("performSearch (noMatch): docViewerToolbar forzada a visible");
        }
    }
  });
}

function scrollToMatch() {
  // console.log(`scrollToMatch(), currentIndex: ${currentIndex}, matches.length: ${matches.length}`);
  if (!matches.length || currentIndex < 0 || currentIndex >= matches.length) return;
  
  const prevCurrent = currentActiveContainer.querySelector('mark.current-match');
  if (prevCurrent) prevCurrent.classList.remove('current-match');
  
  const currentMatchElement = matches[currentIndex];
  currentMatchElement.classList.add('current-match');
  currentMatchElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function navigateResults(direction) {
  // console.log(`navigateResults(${direction})`);
  if (!matches.length) return;
  currentIndex = (currentIndex + direction + matches.length) % matches.length;
  scrollToMatch();
  updateResultsUI();
}

function updateResultsUI() {
  // console.log(`updateResultsUI(), matches: ${matches.length}, currentIndex: ${currentIndex}`);
  if (matches.length > 0 && !searchResultsBar.classList.contains('hidden')) {
    resultCounterSpan.textContent = `${currentIndex + 1} de ${matches.length}`;
  } else {
    resultCounterSpan.textContent = searchInputMain.value.trim() ? '0 resultados' : '';
  }
}

// --- FUNCIONES DE MINUTAS ---
function showMinutasListView() {
  // console.log("showMinutasListView()");
  homeView.style.display = 'none';
  if (viewerSection) viewerSection.classList.add('hidden');
  minutasViewer.style.display = 'none';
  docViewerToolbar.classList.add('hidden'); 
  
  minutasView.classList.remove('hidden');
  minutasDocListContainer.style.display = 'block';
  if (minutasCatFilter.parentElement) minutasCatFilter.parentElement.style.display = 'block';

  searchBarContainer.classList.add('hidden'); 
  document.body.classList.remove('search-bar-visible');
  searchResultsBar.classList.add('hidden'); 
  clearView();
  currentActiveContainer = null;
  docViewerTitleText.textContent = '';
  document.title = 'Minutas Jurisprudencia – Biblioteca Jurídica';
  if (toggleSearchBtnHeader) toggleSearchBtnHeader.style.display = 'block';
  loadMinutas();
}

function loadMinutas() {
  // console.log("loadMinutas()");
  const category = minutasCatFilter.value;
  const filteredMinutas = docsMinutas.filter(doc => category === 'all' || doc.category === category);
  populateDocList(minutasDocList, filteredMinutas, true);
  if (minutasDocListContainer) minutasDocListContainer.scrollTop = 0;
}

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    // console.log("DOMContentLoaded");
    const minutasCategories = [...new Set(docsMinutas.map(m => m.category).filter(Boolean))].sort();
    minutasCatFilter.innerHTML = '<option value="all">Todas las categorías</option>';
    minutasCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        minutasCatFilter.appendChild(option);
    });
    
    if (window.location.hash === '#minutas') {
        showMinutasListView();
    } else {
        showHome();
        if (docList) loadDocs();
    }
    
    const savedView = localStorage.getItem('bibliotecaViewMode') || 'grid';
    if (gridBtn && listBtn) {
        changeViewMode(savedView);
        updateActiveButton(savedView === 'grid' ? gridBtn : listBtn, savedView === 'grid' ? listBtn : gridBtn);
    }

    const savedZoomIndex = parseInt(localStorage.getItem('bibliotecaZoomIndex'));
    if (!isNaN(savedZoomIndex) && savedZoomIndex >= 0 && savedZoomIndex < zoomLevels.length) {
        currentZoomIndex = savedZoomIndex;
    }
    applyGlobalZoom();

    if(clearSearchInputBtn) clearSearchInputBtn.classList.add('hidden');
    if(searchResultsBar) searchResultsBar.classList.add('hidden');
});

window.addEventListener('beforeunload', () => {
    // console.log("beforeunload - guardando preferencias");
    if (docList && docList.classList) {
        localStorage.setItem('bibliotecaViewMode', docList.classList.contains('doc-grid') ? 'grid' : 'list');
    }
    localStorage.setItem('bibliotecaZoomIndex', currentZoomIndex.toString());
});
