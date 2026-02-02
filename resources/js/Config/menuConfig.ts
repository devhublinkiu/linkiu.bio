
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
    ShoppingBag as ShoppingBagIcon
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
    linkiupay: CreditCard,
    buildiu: LayoutTemplate,
    whatsapp: MessageCircle,
    linkiulab: FlaskConical,
    integrations: Puzzle,
    shipping: Truck,
    support: LifeBuoy,
    services: Briefcase,
    agenda: Calendar,
    appointments: CalendarCheck,
    customers: Users,
    team: UserCog,
    reviews: Star,
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
    statistics: BarChart3
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
    linkiupay: 'LinkiuPay',
    buildiu: 'Buildiu',
    whatsapp: 'Notificaciones whatsapp', // Lowercase w as requested
    linkiulab: 'LinkiuLab',
    integrations: 'Integraciones',
    shipping: 'Zonas de envió', // As requested
    support: 'Soporte',
    services: 'Mis Servicios',
    agenda: 'Mi Agenda',
    appointments: 'Citas',
    customers: 'Clientes',
    team: 'Mi Equipo',
    reviews: 'Reseñas',
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
    statistics: 'Estadísticas'
};

// Map module keys to route names (if they exist, otherwise '#')
export const MODULE_ROUTES: Record<string, string> = {
    dashboard: 'tenant.dashboard',
    orders: '#',
    categories: '#',
    products: '#',
    product_drop: '#',
    variables: '#',
    files: 'tenant.media.index',
    sliders: '#',
    inventory: '#',
    linkiupay: '#',
    buildiu: '#',
    whatsapp: '#',
    linkiulab: '#',
    integrations: '#',
    shipping: '#',
    support: '#',
    services: '#',
    agenda: '#',
    appointments: '#',
    customers: '#',
    team: '#',
    reviews: '#',
    payment_methods: '#',
    coupons: '#',
    tickers: '#',
    locations: '#',
    settings: 'tenant.settings.edit',
    // Gastronomy Routes
    linkiu_pos: '#',
    digital_menu: '#',
    tables: '#',
    reservations: '#',
    kitchen: '#',
    statistics: '#'
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
        'inventory',
        'linkiupay',
        'buildiu',
        'whatsapp',
        'linkiulab',
        'integrations',
        'shipping',
        'support'
    ],
    'ecommerce': [
        'dashboard',
        'orders',
        'categories',
        'products',
        'variables',
        'files',
        'sliders',
        'inventory',
        'whatsapp',
        'integrations',
        'shipping',
        'payment_methods',
        'locations',
        'coupons',
        'tickers',
        'support'
    ],
    'gastronomia': [
        'dashboard',
        'orders',
        'linkiu_pos',
        'categories',
        'digital_menu',
        'tables',
        'reservations',
        'inventory',
        'kitchen',
        'files', // Added Mis Archivos
        'integrations',
        'shipping', // Zonas de envio
        'payment_methods',
        'locations',
        'whatsapp',
        'coupons',
        'sliders',
        'tickers',
        'support',
        'statistics'
    ],
    'servicios': [
        'dashboard',
        'services',
        'agenda',
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
        'locations'
    ],
    'default': [
        'dashboard',
        'settings'
    ]
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
    }
};
