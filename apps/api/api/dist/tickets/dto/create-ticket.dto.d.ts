import { TicketCategory } from '@tudongnro/shared-types';
export declare class CreateTicketDto {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    category: TicketCategory;
    orderCode?: string;
    subject: string;
    message: string;
}
