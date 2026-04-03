import { createContext, useContext } from 'react';

/** Nodo dentro del shell público (max-w-[480px]) donde portalear modales/overlays. */
export const PublicLayoutPortalContext = createContext<HTMLElement | null>(null);

export function usePublicLayoutPortal(): HTMLElement | null {
    return useContext(PublicLayoutPortalContext);
}
