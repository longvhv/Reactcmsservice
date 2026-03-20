export default {
  // Common
  common: {
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    create: 'Crear',
    search: 'Buscar',
    filter: 'Filtrar',
    export: 'Exportar',
    import: 'Importar',
    upload: 'Subir',
    download: 'Descargar',
    view: 'Ver',
    close: 'Cerrar',
    back: 'Volver',
    next: 'Siguiente',
    previous: 'Anterior',
    confirm: 'Confirmar',
    yes: 'Sí',
    no: 'No',
    all: 'Todos',
    select: 'Seleccionar',
    selected: 'seleccionado',
    actions: 'Acciones',
    loading: 'Cargando...',
    saving: 'Guardando...',
    publishing: 'Publicando...',
    draft: 'Guardar borrador',
    publish: 'Publicar',
    preview: 'Vista previa',
    settings: 'Configuración',
    language: 'Idioma',
  },

  // Confirmations
  confirmations: {
    deleteArticle: '¿Está seguro de que desea eliminar este artículo?',
    deleteCategory: '¿Está seguro de que desea eliminar esta categoría?',
    deleteCategoryWithArticles: '¿Está seguro de que desea eliminar esta categoría? Todos los artículos de esta categoría se moverán a "Sin categoría".',
    deletePermissionGroup: '¿Está seguro de que desea eliminar el grupo de permisos "{{name}}"?',
    deletePermissionGroupWithMembers: '¿Está seguro de que desea eliminar el grupo de permisos "{{name}}"? Todos los miembros perderán este acceso.',
    removeMember: '¿Está seguro de que desea eliminar este miembro del grupo?',
  },

  // Search
  search: {
    placeholder: 'Búsqueda rápida...',
    recentSearches: 'Búsquedas recientes',
    quickActions: 'Acciones rápidas',
    commandPalette: 'Buscar comando...',
  },

  // Header
  header: {
    createNew: 'Crear nuevo',
    profile: 'Mi perfil',
    settings: 'Configuración',
    logout: 'Cerrar sesión',
    adminUser: 'Usuario Admin',
    adminEmail: 'admin@cms.com',
    premiumPlan: 'Plan Premium',
    pro: 'PRO',
    expiresIn: 'Expira en 30 días',
    i18nTestSuite: '🧪 Suite de prueba i18n',
    
    // Notifications
    newComments: '{{count}} nuevos comentarios necesitan revisión',
    pendingApproval: '{{count}} artículos pendientes de aprobación',
    crawlerCollected: 'Rastreador recopiló {{count}} artículos nuevos',
    backupComplete: 'Copia de seguridad completada con éxito',
    minutesAgo: 'hace {{count}} minutos',
    hoursAgo: 'hace {{count}} horas',
    
    // Quick actions
    createArticle: 'Crear nuevo artículo',
    uploadMedia: 'Subir medios',
    viewStats: 'Ver estadísticas',
    manageCategories: 'Gestionar categorías',
    
    // Recent searches
    recentSearch1: {
      query: 'Artículos sobre IA',
      type: 'Artículos',
    },
    recentSearch2: {
      query: 'Videos tutoriales de React',
      type: 'Medios',
    },
    recentSearch3: {
      query: 'Galería de imágenes 2024',
      type: 'Galería',
    },
  },

  // Menu Navigation
  menu: {
    dashboard: 'Panel',
    articles: 'Artículos',
    categories: 'Categorías',
    media: 'Biblioteca',
    comments: 'Comentarios',
    users: 'Usuarios',
    moderation: 'Moderación',
    moderationAll: 'Moderación de contenido',
    analytics: 'Análisis',
    crawler: 'Rastreador',
    settings: 'Configuración',
    eventSeries: 'Series de eventos',
    permissions: 'Grupos de permisos',
    aiTools: 'Herramientas IA',
    activity: 'Registro de actividad',
  },

  // Article Types
  articleTypes: {
    news: 'Noticias',
    newsDesc: 'Artículo de noticias regular',
    video: 'Video',
    videoDesc: 'Artículo con contenido de video',
    gallery: 'Galería',
    galleryDesc: 'Colección de imágenes',
    document: 'Documento',
    documentDesc: 'Archivo de documento',
    legal: 'Documento legal',
    legalDesc: 'Documento legal o regulación',
    legalShort: 'Legal',
    personnel: 'Personal',
    personnelDesc: 'Información de personal',
    staff: 'Personal',
    recruitment: 'Reclutamiento',
    recruitmentDesc: 'Información de reclutamiento de trabajo',
    job: 'Oferta de empleo',
    podcast: 'Podcast',
    podcastDesc: 'Podcast de audio',
    event: 'Evento',
    eventDesc: 'Información del evento',
    download: 'Descarga',
    downloadDesc: 'Archivo descargable',
    blog: 'Blog',
    blogDesc: 'Entrada de blog',
    tutorial: 'Tutorial',
    tutorialDesc: 'Artículo tutorial',
    pressRelease: 'Comunicado de prensa',
    pressReleaseDesc: 'Comunicado de prensa',
    interview: 'Entrevista',
    interviewDesc: 'Artículo de entrevista',
    infographic: 'Infografía',
    infographicDesc: 'Gráfico de información visual',
  },

  // Article Status
  status: {
    published: 'Publicado',
    draft: 'Borrador',
    review: 'En revisión',
    scheduled: 'Programado',
    archived: 'Archivado',
    rejected: 'Rechazado',
    pending: 'Pendiente',
  },

  // Article Management
  articles: {
    title: 'Gestión de artículos',
    createNew: 'Crear nuevo artículo',
    editArticle: 'Editar artículo',
    deleteArticle: 'Eliminar artículo',
    bulkActions: 'Acciones masivas',
    selectAll: 'Seleccionar todo',
    deselectAll: 'Deseleccionar todo',
    selectedItems: 'artículos',
    noArticles: 'No se encontraron artículos',
    searchPlaceholder: 'Buscar artículos...',
    
    columns: {
      id: 'ID',
      thumbnail: 'Imagen',
      title: 'Título',
      type: 'Tipo',
      status: 'Estado',
      category: 'Categoría',
      author: 'Autor',
      views: 'Vistas',
      comments: 'Comentarios',
      publishDate: 'Publicado',
      updatedDate: 'Actualizado',
      featured: 'Destacado',
      actions: 'Acciones',
    },

    viewDetail: 'Ver detalles',
    markFeatured: 'Marcar como destacado',
    unmarkFeatured: 'Quitar destacado',
    moveTo: 'Mover a',
    duplicate: 'Duplicar',
    archive: 'Archivar',
    restore: 'Restaurar',
    
    filterByType: 'Filtrar por tipo',
    filterByStatus: 'Filtrar por estado',
    filterByCategory: 'Filtrar por categoría',
    filterByAuthor: 'Filtrar por autor',
    
    viewTable: 'Tabla',
    viewList: 'Lista',
    viewGrid: 'Cuadrícula',
    
    columnsDisplay: 'Mostrar columnas',
    resetColumns: 'Restablecer',
    columnsCount: 'columnas',
  },

  // Article Editor
  editor: {
    title: 'Título del artículo',
    titlePlaceholder: 'Ingrese el título del artículo...',
    content: 'Contenido',
    contentPlaceholder: 'Comience a escribir el contenido...',
    excerpt: 'Extracto',
    excerptPlaceholder: 'Breve descripción del artículo...',
    
    editMode: 'Editar',
    previewMode: 'Vista previa',
    
    selectType: 'Tipo de artículo',
    selectTypeRequired: 'Tipo de artículo *',
    
    thumbnail: 'Miniatura',
    thumbnailRequired: 'Miniatura *',
    uploadImage: 'Haga clic para cargar imagen',
    uploadImageHelp: 'PNG, JPG o WebP (máx. 5MB)',
    dragDropImages: 'Arrastre y suelte o haga clic para agregar imágenes',
    dragDropImagesHelp: 'Admite varias imágenes. PNG, JPG, WebP (máx. 10MB/imagen)',
    
    categories: 'Categorías',
    categoriesRequired: 'Categorías *',
    selectCategories: 'Seleccionar categorías',
    searchCategories: 'Buscar categorías...',
    tags: 'Etiquetas',
    addTag: 'Agregar etiqueta...',
    
    author: 'Autor',
    authorRequired: 'Autor *',
    selectAuthor: 'Seleccionar autor',
    addNewAuthor: 'Agregar nuevo autor',
    authorName: 'Nombre del autor',
    authorNamePlaceholder: 'Ingrese el nombre del autor...',
    
    aiTools: 'Herramientas AI',
    translateAuto: 'Traducción automática',
    checkGrammar: 'Verificar gramática',
    optimizeSEO: 'Optimizar SEO',
    suggestContent: 'Sugerir contenido',
    
    saveAndContinue: 'Guardar y agregar otro',
    saveDraft: 'Guardar borrador',
    lastSaved: 'Guardado por última vez en',
    
    videoUrl: 'URL del video',
    videoUrlPlaceholder: 'https://youtube.com/watch?v=...',
    duration: 'Duración',
    durationPlaceholder: '00:00',
    
    noImages: 'Aún no hay imágenes en la galería',
    imageCaption: 'Pie de imagen',
    
    position: 'Posición',
    salary: 'Salario',
    location: 'Ubicación',
    deadline: 'Fecha límite de solicitud',
    requirements: 'Requisitos',
    benefits: 'Beneficios',
    
    eventDate: 'Fecha del evento',
    eventTime: 'Hora del evento',
    venue: 'Lugar',
    maxParticipants: 'Participantes máximos',
    registrationCount: 'Registrados',
    
    episode: 'Episodio',
    audioUrl: 'URL de audio',
    albumArt: 'Portada del álbum',
    
    documentNumber: 'Número de documento',
    documentType: 'Tipo de documento',
    issueDate: 'Fecha de emisión',
    effectiveDate: 'Fecha de vigencia',
    issuingAuthority: 'Autoridad emisora',
    
    department: 'Departamento',
    joinDate: 'Fecha de ingreso',
    bio: 'Biografía',
    
    fileType: 'Tipo de archivo',
    fileSize: 'Tamaño del archivo',
    downloadUrl: 'URL de descarga',
    
    readingTime: 'Tiempo de lectura (minutos)',
    readingTimeUnit: 'min de lectura',
    
    characters: 'caracteres',
    words: 'palabras',
  },

  // Categories
  categories: {
    title: 'Gestión de categorías',
    createNew: 'Crear nueva categoría',
    editCategory: 'Editar categoría',
    deleteCategory: 'Eliminar categoría',
    noCategories: 'No se encontraron categorías',
    
    name: 'Nombre de categoría',
    nameRequired: 'Nombre de categoría *',
    namePlaceholder: 'Ingrese el nombre de la categoría...',
    slug: 'Slug',
    slugPlaceholder: 'url-friendly-slug',
    description: 'Descripción',
    descriptionPlaceholder: 'Descripción de la categoría...',
    parentCategory: 'Categoría padre',
    selectParent: 'Seleccionar categoría padre (opcional)',
    noParent: 'Ninguno (Categoría raíz)',
    icon: 'Icono',
    color: 'Color',
    image: 'Imagen',
    allowedContentTypes: 'Tipos de contenido permitidos',
    
    totalArticles: 'Total de artículos',
    publishedArticles: 'Publicados',
    draftArticles: 'Borradores',
    subcategories: 'Subcategorías',
    
    viewArticles: 'Ver artículos',
    addSubcategory: 'Agregar subcategoría',
    moveCategory: 'Mover',
    mergeCategories: 'Fusionar categorías',
  },

  // Media Library
  media: {
    title: 'Biblioteca de medios',
    uploadFiles: 'Subir archivos',
    dragDrop: 'Arrastre y suelte archivos aquí o',
    clickToUpload: 'haga clic para seleccionar',
    supportedFormats: 'Admite: Imágenes, Videos, Documentos',
    maxSize: 'Máx. 100MB/archivo',
    
    allFiles: 'Todos los archivos',
    images: 'Imágenes',
    videos: 'Videos',
    documents: 'Documentos',
    audio: 'Audio',
    
    gridView: 'Cuadrícula',
    listView: 'Lista',
    
    fileName: 'Nombre del archivo',
    fileSize: 'Tamaño',
    fileType: 'Tipo',
    uploadedBy: 'Subido por',
    uploadDate: 'Fecha de subida',
    usedIn: 'Usado en',
    
    selectFile: 'Seleccionar archivo',
    copyUrl: 'Copiar URL',
    urlCopied: 'URL copiada',
    downloadFile: 'Descargar',
    deleteFile: 'Eliminar',
    editMetadata: 'Editar metadatos',
    replaceFile: 'Reemplazar archivo',
    
    totalFiles: 'Total de archivos',
    totalSize: 'Tamaño total',
    filesSelected: 'archivos seleccionados',
  },

  // Dashboard
  dashboard: {
    welcome: 'Bienvenido de nuevo',
    overview: 'Aquí está una descripción general de su sistema CMS',
    systemHealthy: 'El sistema funciona sin problemas',
    
    totalArticles: 'Total de artículos',
    publishedToday: 'Publicados hoy',
    pendingReview: 'Revisión pendiente',
    totalViews: 'Total de vistas',
    totalComments: 'Comentarios',
    totalLikes: 'Me gusta',
    
    viewsChart: 'Vistas a lo largo del tiempo',
    articlesByType: 'Artículos por tipo',
    articlesByStatus: 'Artículos por estado',
    topAuthors: 'Mejores autores',
    
    recentActivity: 'Actividad reciente',
    recentArticles: 'Últimos artículos',
    popularArticles: 'Artículos populares',
    
    quickActions: 'Acciones rápidas',
    createArticle: 'Crear artículo',
    createCategory: 'Crear categoría',
    uploadMedia: 'Subir medios',
    reviewContent: 'Revisar contenido',
  },

  // Moderation
  moderation: {
    title: 'Moderación de contenido',
    pendingItems: 'Elementos pendientes',
    reviewQueue: 'Cola de revisión',
    
    approve: 'Aprobar',
    reject: 'Rechazar',
    requestChanges: 'Solicitar cambios',
    
    filterByType: 'Filtrar por tipo',
    filterByAuthor: 'Filtrar por autor',
    filterByDate: 'Filtrar por fecha',
    
    totalPending: 'Total pendiente',
    approvedToday: 'Aprobados hoy',
    rejectedToday: 'Rechazados hoy',
  },

  // Users
  users: {
    title: 'Gestión de usuarios',
    createNew: 'Agregar usuario',
    editUser: 'Editar usuario',
    
    username: 'Nombre de usuario',
    email: 'Correo electrónico',
    fullName: 'Nombre completo',
    role: 'Rol',
    status: 'Estado',
    lastLogin: 'Último inicio de sesión',
    
    admin: 'Administrador',
    editor: 'Editor',
    author: 'Autor',
    contributor: 'Colaborador',
    viewer: 'Visor',
    
    active: 'Activo',
    inactive: 'Inactivo',
    suspended: 'Suspendido',
  },

  // Settings
  settings: {
    title: 'Configuración',
    general: 'General',
    appearance: 'Apariencia',
    language: 'Idioma',
    notifications: 'Notificaciones',
    security: 'Seguridad',
    
    siteName: 'Nombre del sitio',
    siteDescription: 'Descripción del sitio',
    timezone: 'Zona horaria',
    dateFormat: 'Formato de fecha',
    
    theme: 'Tema',
    lightMode: 'Claro',
    darkMode: 'Oscuro',
    autoMode: 'Automático',
  },

  // Crawler
  crawler: {
    title: 'Gestión de rastreador',
    campaigns: 'Campañas',
    sources: 'Fuentes',
    articles: 'Artículos rastreados',
    approved: 'Artículos aprobados',
    
    // Submenu labels
    submenu: {
      campaigns: 'Campañas',
      sources: 'Fuentes',
      crawled: 'Artículos rastreados',
      approved: 'Artículos aprobados',
    },
    
    createCampaign: 'Crear campaña',
    editCampaign: 'Editar campaña',
    campaignName: 'Nombre de la campaña',
    campaignDescription: 'Descripción',
    campaignStatus: 'Estado',
    
    createSource: 'Agregar fuente',
    editSource: 'Editar fuente',
    sourceName: 'Nombre de fuente',
    sourceUrl: 'URL de fuente',
    sourceType: 'Tipo de fuente',
    crawlFrequency: 'Frecuencia de rastreo',
    lastCrawled: 'Último rastreo',
    
    startCrawl: 'Iniciar rastreo',
    stopCrawl: 'Detener rastreo',
    testSource: 'Probar fuente',
    viewResults: 'Ver resultados',
    
    totalSources: 'Total de fuentes',
    activeSources: 'Activas',
    totalCrawled: 'Rastreados',
    pendingApproval: 'Pendientes',
  },

  // AI Tools
  aiTools: {
    title: 'Herramientas AI',
    autoTranslate: 'Traducción automática',
    grammarCheck: 'Verificación gramatical',
    seoOptimize: 'Optimización SEO',
    contentSuggest: 'Sugerencias de contenido',
    generateSummary: 'Generar resumen',
    generateTitle: 'Generar título',
    generateTags: 'Generar etiquetas',
    imageAlt: 'Generar texto alternativo',
    
    processing: 'Procesando...',
    completed: 'Completado',
    failed: 'Fallido',
  },

  // Workflow
  workflow: {
    title: 'Gestión de flujo de trabajo',
    createWorkflow: 'Crear flujo de trabajo',
    editWorkflow: 'Editar flujo de trabajo',
    workflowName: 'Nombre del flujo de trabajo',
    workflowSteps: 'Pasos',
    
    step: 'Paso',
    addStep: 'Agregar paso',
    removeStep: 'Eliminar paso',
    stepName: 'Nombre del paso',
    assignTo: 'Asignar a',
    
    approve: 'Aprobar',
    reject: 'Rechazar',
    requestRevision: 'Solicitar revisión',
    moveToNext: 'Mover al siguiente',
  },

  // Event Stream
  eventStream: {
    title: 'Flujos de eventos',
    createStream: 'Crear flujo',
    editStream: 'Editar flujo',
    streamName: 'Nombre del flujo',
    streamDescription: 'Descripción',
    events: 'Eventos',
    
    createEvent: 'Crear evento',
    editEvent: 'Editar evento',
    eventTitle: 'Título del evento',
    eventDate: 'Fecha del evento',
    eventTime: 'Hora',
    eventLocation: 'Ubicación',
    eventDescription: 'Descripción',
    
    totalStreams: 'Total de flujos',
    upcomingEvents: 'Próximos eventos',
    pastEvents: 'Eventos pasados',
  },

  // Activity Log
  activity: {
    title: 'Registro de actividad',
    timeline: 'Línea de tiempo',
    filterByUser: 'Filtrar por usuario',
    filterByAction: 'Filtrar por acción',
    filterByDate: 'Filtrar por fecha',
    
    created: 'creó',
    updated: 'actualizó',
    deleted: 'eliminó',
    published: 'publicó',
    approved: 'aprobó',
    rejected: 'rechazó',
    
    justNow: 'Justo ahora',
    minutesAgo: 'minutos atrás',
    hoursAgo: 'horas atrás',
    daysAgo: 'días atrás',
    weeksAgo: 'semanas atrás',
    monthsAgo: 'meses atrás',
  },

  // Analytics
  analytics: {
    title: 'Análisis y estadísticas',
    overview: 'Resumen',
    detailed: 'Detallado',
    
    pageviews: 'Vistas de página',
    uniqueVisitors: 'Visitantes únicos',
    bounceRate: 'Tasa de rebote',
    avgTimeOnPage: 'Tiempo promedio en la página',
    topPages: 'Páginas principales',
    topReferrers: 'Principales referentes',
    
    today: 'Hoy',
    yesterday: 'Ayer',
    last7Days: 'Últimos 7 días',
    last30Days: 'Últimos 30 días',
    thisMonth: 'Este mes',
    lastMonth: 'Mes pasado',
    custom: 'Personalizado',
  },

  // Permissions
  permissions: {
    title: 'Grupos de permisos',
    createGroup: 'Crear grupo',
    editGroup: 'Editar grupo',
    groupName: 'Nombre del grupo',
    groupDescription: 'Descripción',
    members: 'Miembros',
    searchPlaceholder: 'Buscar grupos de permisos...',
    
    canCreate: 'Crear',
    canRead: 'Leer',
    canUpdate: 'Actualizar',
    canDelete: 'Eliminar',
    canPublish: 'Publicar',
    canApprove: 'Aprobar',
    
    articles: 'Artículos',
    categories: 'Categorías',
    media: 'Medios',
    users: 'Usuarios',
    settings: 'Configuración',
  },

  // Placeholders (for inputs, textareas)
  placeholders: {
    // Search
    searchCommand: 'Buscar comandos...',
    searchMedia: 'Buscar en la biblioteca de medios...',
    searchCrawler: 'Buscar fuentes de rastreador...',
    searchHistory: 'Buscar historial...',
    searchArticles: 'Buscar artículos...',
    searchEventStream: 'Buscar flujos de eventos...',
    
    // Dates
    dateFrom: 'Desde fecha',
    dateTo: 'Hasta fecha',
    
    // File sizes
    sizeMin: 'Mín',
    sizeMax: 'Máx',
    
    // Media
    uploaderName: 'Nombre del cargador...',
    fileDescription: 'Ingrese descripción del archivo...',
    addNewTag: 'Agregar nueva etiqueta...',
    
    // Crawler
    webhookUrl: 'https://hooks.slack.com/...',
    crawlerName: 'Ej: VnExpress Technology',
    rssUrl: 'https://example.com/rss',
    
    // Content
    startWriting: 'Comience a escribir contenido...',
    shortDescription: 'Breve descripción del artículo...',
    readingTime: '5',
    videoUrl: 'https://youtube.com/watch?v=...',
    timestamp: '15:30',
    timestamps: '00:00 - Introducción...',
    galleryDescription: 'Descripción de esta galería de imágenes...',
    documentNumber: '15/2024/NĐ-CP',
    issuingAuthority: 'Gobierno',
    jobPosition: 'Desarrollador Frontend Senior',
    years: '2',
    eventName: 'Ej: Tech Summit 2025',
    eventDescription: 'Descripción de esta serie de eventos...',
  },

  // Tooltips (for title attributes)
  tooltips: {
    delete: 'Eliminar',
    edit: 'Editar',
    editItem: 'Editar',
    view: 'Ver',
    add: 'Agregar',
    changePassword: 'Cambiar contraseña',
    more: 'Más',
  },
};