import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Order, OrderSchema } from '../orders/schemas/order.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { License, LicenseSchema } from '../licenses/schemas/license.schema';
import { Product, ProductSchema } from '../products/schemas/product.schema';
import { SupportTicket, SupportTicketSchema } from '../tickets/schemas/ticket.schema';
import { AuditLog, AuditLogSchema } from './schemas/audit-log.schema';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: User.name, schema: UserSchema },
      { name: License.name, schema: LicenseSchema },
      { name: AuditLog.name, schema: AuditLogSchema },
      { name: Product.name, schema: ProductSchema },
      { name: SupportTicket.name, schema: SupportTicketSchema },
    ]),
    OrdersModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
