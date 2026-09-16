// Centralized Components Barrel Export
// Domain: Layout
export { default as Navbar } from './layout/navbar';
export { default as Footer } from './layout/footer';

// Domain: Marketplace & Catalog
export { default as ListingCard } from './marketplace/listing-card';
export { default as CategoryRail } from './marketplace/category-rail';
export { default as CompareTray } from './marketplace/compare-tray';

// Domain: Modals & Dialogs
export { default as BarterModal } from './modals/barter-modal';
export { default as OfferModal } from './modals/offer-modal';
export { default as ReviewModal } from './modals/review-modal';

// Domain: Database Studio
export { default as CustomSQLWorkbench } from './database/custom-sql-workbench';
export { default as DatabaseDDLViewer } from './database/database-ddl-viewer';
export { default as DatabaseERDiagram } from './database/database-er-diagram';

// Domain: Context Providers
export { MarketplaceProvider, useMarketplace } from './providers/marketplace-provider';
