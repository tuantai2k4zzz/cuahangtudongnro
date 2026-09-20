import { ProductCategory, ProductStatus, PlanDurationType, LicenseIssuanceType } from '@tudongnro/shared-types';
export declare class ProductPlanDto {
    planId: string;
    name: string;
    durationType?: PlanDurationType;
    durationDays: number;
    price: number;
    originalPrice: number;
    isPopular?: boolean;
    status?: string;
    stockLimit?: number | null;
    renewalRule?: string;
    warrantyPolicy?: string;
}
export declare class CreateProductDto {
    name: string;
    slug: string;
    sku?: string;
    tagline: string;
    description: string;
    thumbnailUrl: string;
    galleryUrls?: string[];
    videoUrl?: string;
    category: ProductCategory;
    status?: ProductStatus;
    isFeatured?: boolean;
    badge?: string;
    sortOrder?: number;
    toolName?: string;
    currentVersion: string;
    supportedGameVersion?: string;
    platform?: string;
    supportedOs?: string;
    changelog?: any[];
    features?: any[];
    unsupportedFeatures?: string[];
    plans: ProductPlanDto[];
    systemRequirements?: any;
    installationGuide?: string;
    userGuide?: string;
    licenseIssuanceType?: LicenseIssuanceType;
    maxDevices?: number;
    terms?: string;
    seoTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    keywords?: string[];
    isIndexed?: boolean;
}
