import { Document } from 'mongoose';
import { ProductCategory, ProductStatus, PlanDurationType, LicenseIssuanceType } from '@tudongnro/shared-types';
export type ProductDocument = Product & Document;
export declare class ProductPlan {
    planId: string;
    name: string;
    durationType: PlanDurationType;
    durationDays: number;
    price: number;
    originalPrice: number;
    isPopular: boolean;
    status: string;
    stockLimit: number;
    renewalRule: string;
    warrantyPolicy: string;
}
export declare class ProductChangelog {
    version: string;
    releaseDate: string;
    notes: string[];
}
export declare class ProductFeature {
    title: string;
    description: string;
    icon: string;
}
export declare class Product {
    name: string;
    slug: string;
    sku: string;
    tagline: string;
    description: string;
    thumbnailUrl: string;
    galleryUrls: string[];
    videoUrl: string;
    category: ProductCategory;
    status: ProductStatus;
    isFeatured: boolean;
    badge: string;
    sortOrder: number;
    toolName: string;
    currentVersion: string;
    supportedGameVersion: string;
    platform: string;
    supportedOs: string;
    changelog: ProductChangelog[];
    features: ProductFeature[];
    unsupportedFeatures: string[];
    plans: ProductPlan[];
    systemRequirements: {
        os: string;
        ram: string;
        cpu?: string;
        disk?: string;
        notes?: string;
    };
    installationGuide: string;
    userGuide: string;
    licenseIssuanceType: LicenseIssuanceType;
    maxDevices: number;
    terms: string;
    seoTitle: string;
    metaDescription: string;
    ogImage: string;
    keywords: string[];
    isIndexed: boolean;
    salesCount: number;
    viewCount: number;
    lastUpdated: Date;
}
export declare const ProductSchema: import("mongoose").Schema<Product, import("mongoose").Model<Product, any, any, any, Document<unknown, any, Product, any, {}> & Product & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Product, Document<unknown, {}, import("mongoose").FlatRecord<Product>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Product> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
