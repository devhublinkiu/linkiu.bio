"use client"

import * as React from "react"
import { Link, usePage, router } from '@inertiajs/react'
import {
    BadgeCheck,
    Sparkles,
    ChevronRight,
    Lock
} from "lucide-react"

import { cn } from '@/lib/utils'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import { Card, CardContent } from '@/Components/ui/card'
import { Progress } from '@/Components/ui/progress'
import { PageProps } from '@/types'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarGroup,
    SidebarGroupLabel,
} from "@/Components/ui/sidebar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/Components/ui/collapsible"
import ApplicationLogo from "@/Components/ApplicationLogo"
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal'

import {
    MODULE_ICONS,
    MODULE_LABELS,
    MODULE_ROUTES,
    MODULE_CHILDREN,
    VERTICAL_CONFIG,
    VERTICAL_FEATURES
} from '@/Config/menuConfig'

interface NavItem {
    label: string
    route: string
    icon: any
    key: string
    children?: Array<{ label: string, route: string }>
}

const MODULE_PERMISSIONS: Record<string, string> = {
    'dashboard': 'dashboard.view',
    'orders': 'orders.view',
    'categories': 'categories.view',
    'products': 'products.view',
    'product_drop': 'products.view',
    'variables': 'products.view',
    'files': 'media.view',
    'sliders': 'sliders.view',
    'inventory': 'inventory.view',
    'linkiupay': 'billing.view',
    'buildiu': 'buildiu.view',
    'whatsapp': 'whatsapp.view',
    'linkiulab': 'linkiulab.view',
    'integrations': 'integrations.view',
    'shipping': 'shipping_zones.view',
    'support': 'support.view',
    'services': 'services.view',
    'agenda': 'agenda.view',
    'appointments': 'appointments.view',
    'customers': 'customers.view',
    'team': 'users.view',
    'reviews': 'reviews.view',
    'payment_methods': 'payment_methods.view',
    'coupons': 'coupons.view',
    'tickers': 'tickers.view',
    'locations': 'locations.view',
    'settings': 'settings.view',
    'roles': 'roles.view',
    'profile': 'profile.view',
    'subscription': 'billing.view',
    'billing': 'billing.view',
    'linkiu_pos': 'orders.view',
    'digital_menu': 'products.view',
    'tables': 'tables.view',
    'reservations': 'reservations.view',
    'kitchen': 'kitchen.view',
    'waiters': 'waiters.view',
    'statistics': 'statistics.view',
    'logout': 'dashboard.view', // Any auth user can logout
}

export default function AdminSidebar(props: React.ComponentProps<typeof Sidebar>) {
    const { auth, currentTenant, currentUserRole } = usePage<PageProps & {
        currentTenant: any & { vertical?: { slug: string } },
        currentUserRole: any
    }>().props
    const [showPermissionModal, setShowPermissionModal] = React.useState(false)

    // Permission Check
    const checkPermission = (moduleKey: string) => {
        const permission = MODULE_PERMISSIONS[moduleKey]
        if (!permission) return true
        if (!currentUserRole) return false
        if (currentUserRole.is_owner) return true
        return currentUserRole.permissions.includes('*') || currentUserRole.permissions.includes(permission)
    }

    const handleNavigation = (e: React.MouseEvent, moduleKey: string, isLocked: boolean) => {
        if (!checkPermission(moduleKey)) {
            e.preventDefault()
            e.stopPropagation()
            setShowPermissionModal(true)
            return false
        }

        if (isLocked) {
            e.preventDefault()
            e.stopPropagation()

            // Critical check: if user can't see billing, don't redirect to subscription page (avoids 403)
            if (!checkPermission('billing')) {
                setShowPermissionModal(true)
                return false
            }

            router.get(route('tenant.subscription.index', { tenant: currentTenant.slug }))
            return false
        }

        return true
    }

    // Dynamic Menu Generation
    const rawSlug = currentTenant?.vertical?.slug?.toLowerCase() || 'default'
    const verticalSlug = rawSlug.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    const modulesList = VERTICAL_CONFIG[verticalSlug] || VERTICAL_CONFIG['default']

    const dynamicItems: NavItem[] = modulesList.map(moduleKey => {
        const icon = MODULE_ICONS[moduleKey] || MODULE_ICONS['dashboard']
        let children = MODULE_CHILDREN[moduleKey]

        const features = VERTICAL_FEATURES[verticalSlug]
        if (features && children && moduleKey === 'integrations') {
            children = children.filter(child => {
                const featureKey = `integration_${child.label.toLowerCase().replace('é', 'e')}`
                return features[featureKey] === true
            })
        }

        return {
            label: MODULE_LABELS[moduleKey] || moduleKey,
            route: MODULE_ROUTES[moduleKey] || '#',
            icon: icon,
            key: moduleKey,
            children: children
        }
    })

    const isLockedItem = (itemKey: string) => {
        const planFeatures = currentTenant?.latest_subscription?.plan?.features
        let configObject: Record<string, boolean> = {}

        if (Array.isArray(planFeatures)) {
            const found = planFeatures.find(f => typeof f === 'object' && !Array.isArray(f))
            if (found) configObject = found
        } else if (typeof planFeatures === 'object' && planFeatures !== null) {
            configObject = planFeatures
        }

        return configObject[itemKey] === false
    }

    return (
        <Sidebar variant="inset" {...props}>
            <PermissionDeniedModal
                open={showPermissionModal}
                onOpenChange={setShowPermissionModal}
            />

            <SidebarHeader>
                {/* Verified Badge */}
                <div className="px-2 py-2 group-data-[state=collapsed]:hidden">
                    <Badge variant="outline" className="w-full justify-center gap-2 py-2 border-blue-200 bg-blue-50/50 text-blue-700 hover:bg-blue-100/50">
                        <BadgeCheck className="h-4 w-4" />
                        <span className="text-xs font-semibold">Tienda Verificada</span>
                    </Badge>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {dynamicItems.map((item) => {
                            const isLocked = isLockedItem(item.key)
                            const isActive = item.route !== '#' && route().current(item.route)
                            const hasChildren = item.children && item.children.length > 0
                            const hasPermission = checkPermission(item.key)

                            return (
                                <React.Fragment key={item.key}>
                                    {hasChildren ? (
                                        <Collapsible asChild defaultOpen={isActive} className="group/collapsible">
                                            <SidebarMenuItem>
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton
                                                        tooltip={item.label}
                                                        isActive={isActive}
                                                        onClick={(e) => handleNavigation(e, item.key, isLocked)}
                                                    >
                                                        <item.icon className={cn(!hasPermission && "text-red-500")} />
                                                        <span className={cn(!hasPermission && "text-red-600 font-medium")}>{item.label}</span>
                                                        {!hasPermission ? (
                                                            <Lock className="ml-auto h-3.5 w-3.5 text-red-500 animate-pulse" />
                                                        ) : isLocked ? (
                                                            <Badge className="ml-auto h-5 px-1.5 text-[10px] font-bold bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">PRO</Badge>
                                                        ) : (
                                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                        )}
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <SidebarMenuSub>
                                                        {item.children?.map((child) => (
                                                            <SidebarMenuSubItem key={child.label}>
                                                                <SidebarMenuSubButton asChild>
                                                                    <Link
                                                                        href={!hasPermission ? '#' : (isLocked ? route('tenant.subscription.index', { tenant: currentTenant.slug }) : (child.route === '#' ? '#' : route(child.route, { tenant: currentTenant.slug })))}
                                                                        onClick={(e) => handleNavigation(e, item.key, isLocked)}
                                                                    >
                                                                        <span>{child.label}</span>
                                                                        {!hasPermission ? (
                                                                            <Lock className="ml-auto h-3 w-3 text-red-500" />
                                                                        ) : isLocked && (
                                                                            <Badge className="ml-auto h-4 px-1 text-[9px] font-bold bg-amber-100 text-amber-700 border-amber-200">PRO</Badge>
                                                                        )}
                                                                    </Link>
                                                                </SidebarMenuSubButton>
                                                            </SidebarMenuSubItem>
                                                        ))}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            </SidebarMenuItem>
                                        </Collapsible>
                                    ) : (
                                        <SidebarMenuItem>
                                            <SidebarMenuButton
                                                asChild
                                                tooltip={item.label}
                                                isActive={isActive}
                                                onClick={(e) => handleNavigation(e, item.key, isLocked)}
                                            >
                                                <Link href={!hasPermission ? '#' : (isLocked ? route('tenant.subscription.index', { tenant: currentTenant.slug }) : (item.route === '#' ? '#' : route(item.route, { tenant: currentTenant.slug })))}>
                                                    <item.icon className={cn(!hasPermission && "text-red-500")} />
                                                    <span className={cn(!hasPermission && "text-red-600 font-medium")}>{item.label}</span>
                                                    {!hasPermission ? (
                                                        <Lock className="ml-auto h-3.5 w-3.5 text-red-500" />
                                                    ) : isLocked && (
                                                        <Badge className="ml-auto h-5 px-1.5 text-[10px] font-bold bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">PRO</Badge>
                                                    )}
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )}
                                </React.Fragment>
                            )
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                {currentTenant?.latest_subscription && (
                    <div className="p-2">
                        <Card className="group-data-[state=collapsed]:hidden border-purple-200/50 bg-gradient-to-br from-purple-50 via-white to-blue-50">
                            <CardContent className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                                        {currentTenant.latest_subscription.plan?.name || 'Pro'}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            currentTenant.latest_subscription.days_remaining <= 3 && "border-red-200 text-red-600"
                                        )}
                                    >
                                        {currentTenant.latest_subscription.status === 'trialing'
                                            ? `${currentTenant.latest_subscription.trial_days_remaining} días`
                                            : `${currentTenant.latest_subscription.days_remaining} días`
                                        }
                                    </Badge>
                                </div>

                                <Progress value={Math.max(5, currentTenant.latest_subscription.percent_completed)} />

                                <Button asChild className="w-full">
                                    <Link
                                        href={route('tenant.subscription.index', { tenant: currentTenant.slug })}
                                        onClick={(e) => handleNavigation(e, 'subscription', false)}
                                    >
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Ver planes
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                        {/* Mini-indicator for collapsed state */}
                        <div className="hidden group-data-[state=collapsed]:flex justify-center">
                            <Link href={route('tenant.subscription.index', { tenant: currentTenant.slug })}>
                                <Sparkles className="h-5 w-5 text-purple-500" />
                            </Link>
                        </div>
                    </div>
                )}
            </SidebarFooter>
        </Sidebar >
    )
}
