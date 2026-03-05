
import {
    LayoutDashboard,
    ShoppingBag,
    Grid,
    Package,
    Sliders,
    FolderOpen,
    Images,
    Boxes,
    CreditCard,
    LayoutTemplate,
    MessageCircle,
    FlaskConical,
    Puzzle,
    Truck,
    LifeBuoy,
    Briefcase,
    Calendar,
    CalendarCheck,
    Users,
    UserCog,
    Star,
    Banknote,
    Ticket,
    Megaphone,
    MapPin,
    Settings,
    LogOut,
    User,
    // Gastronomy Icons
    Utensils,
    BookOpen,
    Table,
    CalendarClock,
    ChefHat,
    BarChart3,
    Monitor,
    ShoppingBag as ShoppingBagIcon,
    ConciergeBell,
    Video,
    Headphones,
    LayoutGrid,
    Quote,
    Mic2
} from 'lucide-react';

export const MODULE_ICONS: Record<string, any> = {
    dashboard: LayoutDashboard,
    orders: ShoppingBagIcon,
    categories: Grid,
    products: Package,
    product_drop: Package,
    variables: Sliders,
    files: FolderOpen,
    sliders: Images,
    inventory: Boxes,
    warehouse: Boxes,
    linkiupay: CreditCard,
    buildiu: LayoutTemplate,
    whatsapp: MessageCircle,
    linkiulab: FlaskConical,
    integrations: Puzzle,
    shipping: Truck,
    support: LifeBuoy,
    services: Briefcase,
    devotionals: BookOpen,
    appointments: CalendarCheck,
    customers: Users,
    team: UserCog,
    reviews: Quote,
    payment_methods: Banknote,
    coupons: Ticket,
    tickers: Megaphone,
    locations: MapPin,
    settings: Settings,
    profile: User,
    logout: LogOut,
    // Gastronomy Icons
    linkiu_pos: Monitor,
    digital_menu: BookOpen, // or Utensils
    tables: Table,
    reservations: CalendarClock,
    kitchen: ChefHat,
    waiters: ConciergeBell,
    statistics: BarChart3,
    shorts: Video,
    // Church
    collaborators: UserCog,
    donations: Banknote,
    audio_dosis: Headphones,
    feed: Mic2
};

export const MODULE_LABELS: Record<string, string> = {
    dashboard: 'Dashboard',
    orders: 'Pedidos',
    categories: 'Categorías',
    products: 'Productos',
    product_drop: 'Product Drop',
    variables: 'Variables',
    files: 'Mis Archivos',
    sliders: 'Sliders',
    inventory: 'Inventario',
    warehouse: 'Bodega',
    linkiupay: 'LinkiuPay',
    buildiu: 'Buildiu',
    whatsapp: 'Notificaciones whatsapp', // Lowercase w as requested
    linkiulab: 'LinkiuLab',
    integrations: 'Integraciones',
    shipping: 'Zonas de Envío', // As requested
    support: 'Soporte',
    services: 'Mis Servicios',
    devotionals: 'Devocionales',
    appointments: 'Citas',
    customers: 'Clientes',
    team: 'Mi Equipo',
    reviews: 'Testimonios',
    payment_methods: 'Métodos de pago', // Lowercase p as requested
    coupons: 'Cupones',
    tickers: 'Ticker promocionales', // Singular Ticker as requested
    locations: 'Sedes',
    settings: 'Configuración',

    // Gastronomy Labels
    linkiu_pos: 'linkiuPos',
    digital_menu: 'Carta digital',
    tables: 'Mesas y zonas',
    reservations: 'Reservas',
    kitchen: 'Cocina',
    waiters: 'Meseros',
    statistics: 'Estadísticas',
    shorts: 'Shorts',
    // Church
    collaborators: 'Colaboradores',
    donations: 'Donaciones',
    audio_dosis: 'Audio dosis',
    feed: 'Predicas'
};

// Map module keys to route names (if they exist, otherwise '#')
export const MODULE_ROUTES: Record<string, string> = {
    dashboard: 'tenant.dashboard',
    orders: 'tenant.admin.gastronomy.orders.index',
    categories: 'tenant.categories.index',
    products: '#',
    product_drop: '#',
    variables: '#',
    files: 'tenant.media.index',
    sliders: 'tenant.sliders.index',
    inventory: 'tenant.admin.inventory.index',
    warehouse: '#',
    linkiupay: '#',
    buildiu: '#',
    whatsapp: 'tenant.whatsapp.edit',
    linkiulab: '#',
    integrations: '#',
    shipping: 'tenant.shipping.index',
    support: 'tenant.support.index',
    services: 'tenant.admin.services.index',
    devotionals: 'tenant.admin.devotionals.index',
    appointments: 'tenant.admin.appointments.index',
    customers: '#',
    team: 'tenant.members.index',
    reviews: 'tenant.admin.testimonials.index',
    payment_methods: 'tenant.payment-methods.index',
    coupons: '#',
    tickers: 'tenant.admin.tickers.index',
    locations: 'tenant.locations.index',
    settings: 'tenant.settings.edit',
    // Gastronomy Routes
    linkiu_pos: 'tenant.admin.pos',
    digital_menu: 'tenant.admin.products.index',
    tables: 'tenant.admin.tables.index',
    reservations: 'tenant.admin.reservations.index',
    kitchen: 'tenant.admin.kitchen.index',
    waiters: 'tenant.admin.waiters.index',
    statistics: '#',
    shorts: 'tenant.shorts.index',
    // Church
    collaborators: 'tenant.admin.collaborators.index',
    donations: 'tenant.admin.donations.index',
    audio_dosis: 'tenant.admin.audio-dosis.index',
    feed: 'tenant.admin.sermons.index'
};

// Sub-items configuration (optional, for modules with children)
export const MODULE_CHILDREN: Record<string, Array<{ label: string, route: string }>> = {
    marketing: [
        { label: 'Cupones', route: '#' },
        { label: 'Tickers', route: '#' },
    ],
    linkiupay: [
        { label: 'Formulario', route: '#' },
        { label: 'Ofertas', route: '#' },
        { label: 'Estadísticas', route: '#' },
    ],
    linkiulab: [
        { label: 'Visitas y tráfico', route: '#' },
        { label: 'Secciones más vistas', route: '#' },
        { label: 'Conversiones', route: '#' },
        { label: 'Más vendidos', route: '#' },
        { label: 'Heatmaps', route: '#' },
    ],
    // Integrations can be handled as children or just a page
    integrations: [
        { label: 'Rappi', route: '#' },
        { label: 'PayU', route: '#' },
        { label: 'Epayco', route: '#' },
        { label: 'Addi', route: '#' },
        { label: 'Sistecrédito', route: '#' },
        { label: 'Wompi', route: '#' },
        { label: 'YouTube', route: '#' },
        { label: 'Dropi', route: '#' },
        { label: 'MasterShop', route: '#' },
    ]
};

export const VERTICAL_CONFIG: Record<string, string[]> = {
    'dropshipping': [
        'dashboard',
        'orders',
        'categories',
        'product_drop',
        'variables',
        'files',
        'sliders',
        'warehouse',
        'linkiupay',
        'buildiu',
        'whatsapp',
        'linkiulab',
        'integrations',
        'shipping',
        'support',
        'shorts'
    ],
    'ecommerce': [
        'dashboard',
        'orders',
        'categories',
        'products',
        'variables',
        'files',
        'sliders',
        'warehouse',
        'whatsapp',
        'integrations',
        'shipping',
        'payment_methods',
        'locations',
        'coupons',
        'tickers',
        'support',
        'shorts'
    ],
    'gastronomia': [
        'dashboard',
        'orders',
        'linkiu_pos',
        'digital_menu',
        'categories',
        'tables',
        'reservations',
        'inventory',
        'kitchen',
        'waiters',
        'files', // Added Mis Archivos
        'integrations',
        'shipping', // Zonas de envio
        'payment_methods',
        'locations',
        'shorts',
        'whatsapp',
        'sliders',
        'tickers',
        'support',
        'statistics',
        'team'
    ],
    'servicios': [
        'dashboard',
        'services',
        'devotionals',
        'appointments',
        'customers',
        'team',
        'categories',
        'sliders',
        'reviews',
        'integrations',
        'tickers',
        'files',
        'support',
        'whatsapp',
        'locations',
        'shorts'
    ],
    'church': [
        'dashboard',
        'services',
        'devotionals',
        'appointments',
        'collaborators',
        'donations',
        'audio_dosis',
        'feed',
        'sliders',
        'tickers',
        'reviews',
        'shorts',
        'files',
        'locations',
        'payment_methods',
        'whatsapp',
        'support',
        'integrations'
    ],
    // Mismo contenido que church: el vertical en BD se llama "Iglesias" → slug normalizado "iglesias"
    'iglesias': [
        'dashboard',
        'services',
        'devotionals',
        'appointments',
        'collaborators',
        'donations',
        'audio_dosis',
        'feed',
        'sliders',
        'tickers',
        'reviews',
        'shorts',
        'files',
        'locations',
        'payment_methods',
        'whatsapp',
        'support',
        'integrations'
    ],
    'default': [
        'dashboard',
        'settings'
    ]
};

// Modules that support numeric limits per plan (key → label del input)
// Se agregan módulos a medida que se auditan
export const MODULE_HAS_LIMIT: Record<string, string> = {
    'tickers': 'Máx. tickers',
    'sliders': 'Máx. sliders',
    'locations': 'Máx. sedes',
    'payment_methods': 'Máx. cuentas bancarias',
    'digital_menu': 'Máx. productos',
    'shorts': 'Máx. shorts',
    'audio_dosis': 'Máx. episodios',
};

// En vertical gastronomía el módulo es "digital_menu" pero el backend usa getLimit('products')
export const LIMIT_FORM_KEY_TO_BACKEND: Record<string, string> = {
    digital_menu: 'products',
};
export const LIMIT_BACKEND_KEY_TO_FORM: Record<string, string> = {
    products: 'digital_menu',
};

// Helper to differentiate features per vertical (e.g. Integrations list)
export const VERTICAL_FEATURES: Record<string, Record<string, boolean>> = {
    'dropshipping': {
        'integration_dropi': true,
        'integration_mastershop': true,
        'integration_addi': true,
        'integration_sistecredito': true,
    },
    'ecommerce': {
        'integration_payu': true,
        'integration_epayco': true,
        'integration_addi': true,
        'integration_sistecredito': true,
        'integration_wompi': true,
    },
    'gastronomia': {
        'integration_rappi': true,
        'integration_payu': true,
        'integration_wompi': true,
    },
    'servicios': {
        'integration_payu': true,
        'integration_epayco': true,
        'integration_addi': true,
        'integration_sistecredito': true,
        'integration_wompi': true,
    },
    'church': {
        'integration_epayco': true,
        'integration_payu': true,
        'integration_wompi': true,
        'integration_youtube': true,
    },
    'iglesias': {
        'integration_epayco': true,
        'integration_payu': true,
        'integration_wompi': true,
        'integration_youtube': true,
    }
};
