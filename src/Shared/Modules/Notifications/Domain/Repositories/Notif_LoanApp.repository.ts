import { NotificationLoanApplicationEntity } from "../Entities/Notif_LoanApp.entity";

export const NOTIFICATION_LOAN_APPLICATION_REPOSITORY = Symbol('NOTIFICATION_LOAN_APPLICATION_REPOSITORY');
export interface INotificationLoanApplicationRepository {
 create(data: Partial<NotificationLoanApplicationEntity>): Promise<NotificationLoanApplicationEntity>;
 findByMarketingId(marketingId: number): Promise<NotificationLoanApplicationEntity[]>;
 patchUpdateNotificationById(id: string, updateData: Partial<NotificationLoanApplicationEntity>): Promise<NotificationLoanApplicationEntity | null>;
}
