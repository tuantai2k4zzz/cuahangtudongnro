import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductCategory, ProductStatus } from '@tudongnro/shared-types';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
    findAll(search?: string, category?: ProductCategory, status?: ProductStatus, sort?: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/product.schema").ProductDocument, {}, {}> & import("./schemas/product.schema").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findBySlug(slug: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/product.schema").ProductDocument, {}, {}> & import("./schemas/product.schema").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAllAdmin(search?: string, status?: string, category?: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/product.schema").ProductDocument, {}, {}> & import("./schemas/product.schema").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    create(dto: CreateProductDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/product.schema").ProductDocument, {}, {}> & import("./schemas/product.schema").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    update(id: string, updateData: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/product.schema").ProductDocument, {}, {}> & import("./schemas/product.schema").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
