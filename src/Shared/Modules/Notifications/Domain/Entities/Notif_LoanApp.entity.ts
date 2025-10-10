export class NotificationLoanApplicationEntity {
  id?: string;
  user_id: number;
  loan_app_id: number;
  message: string;
  isRead?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<NotificationLoanApplicationEntity>) {
    Object.assign(this, partial);
  }
}
