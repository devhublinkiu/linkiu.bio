# LinkiuPOS Module Specification

## Overview
**LinkiuPOS** is a lightweight, touch-optimized Point of Sale (POS) system designed for rapid transaction processing in retail and food service environments. It focuses on speed, simplicity, and direct integration with the existing product catalog and order management system.

## Core Features (MVP)

### 1. Product Interface
-   **Visual Grid**: Large, touch-friendly product cards with images and prices.
-   **Categorization**: Tabbed navigation or quick filters for product categories.
-   **Smart Search**: Real-time search bar for finding products by name or SKU.

### 2. Cart Management
-   **Persistent Sidebar**: Always-visible cart summary on the right side of the screen.
-   **Quick Adjustments**: Large +/- buttons for quantity changes.
-   **Item Removal**: Easy-to-access delete button for cart items.
-   **Order Notes**: Ability to add specific notes to individual items (e.g., "No ice", "Medium rare").

### 3. Checkout Process
-   **Simplified Flow**: One-click access to payment options.
-   **Payment Methods**: Support for Cash, Card, and Transfer/QR (Nequi/Daviplata).
-   **Order Creation**: Generates a standard `Order` record in the database upon completion.
-   **Receipt Printing**: Integration with thermal printers for immediate receipt generation.

## Technical Architecture

### Frontend
-   **Framework**: React (Inertia.js).
-   **Components**: Utilizing Shadcn UI for a modern, responsive design.
-   **State Management**: React Context or local state for managing the cart session.

### Backend
-   **Controller**: `POSController` handles view rendering and order submission.
-   **Models**: Reuses existing `Product`, `Order`, `OrderItem`, and `Tenant` models.
-   **Database**: No new tables required for MVP; relies on existing schema.

## Future Considerations (Post-MVP)
-   **Customer Management**: Linking sales to specific customers for loyalty/history.
-   **Cash Management**: Opening/closing shifts (Z-cuts) and cash drawer tracking.
-   **Kitchen Display System (KDS)**: Integration for sending orders to kitchen screens.
