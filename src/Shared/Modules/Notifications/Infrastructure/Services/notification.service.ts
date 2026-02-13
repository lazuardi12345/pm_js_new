import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { USERTYPE } from 'src/Shared/Enums/Users/Users.enum';
import {
  FlowTargettingMessage,
  NotificationType,
} from '../../common/enums/LoanNotifications.enum';

export interface NotificationGeneralPayload {
  title: string;
  message: string;
  token?: string;
  targetUsers?: string[];
  targetRoles?: string[];
  metadata?: {
    loanId?: string;
    loanStatus?: string;
    applicantName?: string;
    loanAmount?: number;
    tenor?: number;
    interestRate?: number;
    submittedAt?: Date;
    additionalInfo?: string;
    spvId?: string | number;
  };
}
export interface NotificationApprovalPayload {
  title: string;
  message: string;
  token?: string;
  metadata: {
    loanId: string;
    role: USERTYPE;
    approvalStatus: 'approved' | 'rejected';
    approvalAmount?: number;
    approvalTenor?: number;
    kesimpulan: string;
    keterangan?: string;
    approvedBy: string;
    approvedAt: Date;
    remarks?: string;
  };
}

export interface NotificationResponse {
  id: string;
  title: string;
  message: string;
  status: string;
  createdAt: Date;
}

@Injectable()
export class NotificationClientService {
  private readonly logger = new Logger(NotificationClientService.name);
  private readonly notificationServiceUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.notificationServiceUrl =
      this.configService.get<string>('NOTIFICATION_SERVICE_URL') ||
      'https://created-studied-actual-render.trycloudflare.com';
  }

  /**
   * Send general notification (marketing, info, dll)
   */
  async sendGeneralNotification(
    payload: NotificationGeneralPayload,
  ): Promise<NotificationResponse | null> {
    try {
      const response = await fetch(
        `${this.notificationServiceUrl}/api/notifications/loan-apps/general`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            notificationType: 'trigger',
            targetUsers: payload.targetUsers,
            targetRoles: payload.targetRoles,
          }),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        this.logger.error('Failed to send notification:', error);
        return null;
      }

      const data = await response.json();
      this.logger.log(`Notification sent successfully: ${data.id}`);
      return data;
    } catch (error) {
      this.logger.error('Error sending notification:', error);
      return null;
    }
  }

  /**
   * Helper: Send draft created notification
   */

  async sendDraftCreatedNotification(
    loanApp: any,
    spvId?: number | null,
    token?: string,
  ): Promise<void> {
    try {
      const response = await fetch(
        `${this.notificationServiceUrl}/notifications/loan-apps/draft`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            loanId: loanApp._id.toString(),
            spvId,
            applicant_name: loanApp.client_external.nama_lengkap,
            loan_amount: Number(
              loanApp.loan_application_external.nominal_pinjaman,
            ),
            loan_type: loanApp.loan_application_external.jenis_pembiayaan,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        this.logger.log(`✅ Notification sent: ${data.id}`);
      } else {
        const error = await response.json();
        this.logger.error('❌ Notification failed:', error);
      }
    } catch (error) {
      this.logger.error('❌ Notification error:', error);
    }
  }

  /**
   * Helper: Send Loan Application created notification
   */

  async sendLoanApplicationSubmittedNotification(
    loanApp: any,
    spvId?: number | null,
    token?: string,
  ): Promise<void> {
    try {
      const response = await fetch(
        `${this.notificationServiceUrl}/notifications/loan-apps/loan-application`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            loanId: loanApp.id,
            spvId,
            applicant_name: loanApp.client_external.nama_lengkap,
            loan_amount: Number(
              loanApp.loan_application_external.nominal_pinjaman,
            ),
            loan_type: loanApp.loan_application_external.jenis_pembiayaan,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        this.logger.log(`✅ Notification sent: ${data.id}`);
      } else {
        const error = await response.json();
        this.logger.error('❌ Notification failed:', error);
      }
    } catch (error) {
      this.logger.error('❌ Notification error:', error);
    }
  }

  /**
   * Helper: Send draft created notification
   */

  async sendAdminBIApprovalNotification(
    loanApp: { draftId: string; marketingId: string },
    token?: string,
  ): Promise<void> {
    try {
      const response = await fetch(
        `${this.notificationServiceUrl}/notifications/loan-apps/admin-bi-approval`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            loanId: loanApp.draftId,
            marketingId: loanApp.marketingId,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        this.logger.log(`✅ Notification sent: ${data.id}`);
      } else {
        const error = await response.json();
        this.logger.error('❌ Notification failed:', error);
      }
    } catch (error) {
      this.logger.error('❌ Notification error:', error);
    }
  }

  /**
   * Helper: Send Loan Application created notification
   */

  async sendSPVApprovalResponseNotification(
    loanId: number,
    spvId?: number | null,
    marketingId?: number | null,
    token?: string,
  ): Promise<void> {
    try {
      const response = await fetch(
        `${this.notificationServiceUrl}/notifications/loan-apps/spv-approval`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            loanId,
            spvId,
            marketingId,
            // applicant_name: approval.client_external.nama_lengkap,
            // loan_amount: Number(
            //   approval.loan_application_external.nominal_pinjaman,
            // ),
            // loan_type: approval.loan_application_external.jenis_pembiayaan,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        this.logger.log(`✅ Notification sent: ${data.id}`);
      } else {
        const error = await response.json();
        this.logger.error('❌ Notification failed:', error);
      }
    } catch (error) {
      this.logger.error('❌ Notification error:', error);
    }
  }

  /**
   * Helper: Send Loan Application created notification
   */

  async sendSPVRejectionResponseNotification(
    loanId: number,
    spvId?: number | null,
    marketingId?: number | null,
    token?: string,
  ): Promise<void> {
    try {
      const response = await fetch(
        `${this.notificationServiceUrl}/notifications/loan-apps/spv-rejection`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            loanId,
            spvId,
            marketingId,
            // applicant_name: approval.client_external.nama_lengkap,
            // loan_amount: Number(
            //   approval.loan_application_external.nominal_pinjaman,
            // ),
            // loan_type: approval.loan_application_external.jenis_pembiayaan,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        this.logger.log(`✅ Notification sent: ${data.id}`);
      } else {
        const error = await response.json();
        this.logger.error('❌ Notification failed:', error);
      }
    } catch (error) {
      this.logger.error('❌ Notification error:', error);
    }
  }

  /**
   * Helper: Send Loan Application created notification
   */

  async sendCAApprovalResponseNotification(
    loanApp: any,
    token?: string,
  ): Promise<void> {
    try {
      const response = await fetch(
        `${this.notificationServiceUrl}/notifications/loan-apps/ca-approval`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            loanId: loanApp.id,
            applicant_name: loanApp.client_external.nama_lengkap,
            loan_amount: Number(
              loanApp.loan_application_external.nominal_pinjaman,
            ),
            loan_type: loanApp.loan_application_external.jenis_pembiayaan,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        this.logger.log(`✅ Notification sent: ${data.id}`);
      } else {
        const error = await response.json();
        this.logger.error('❌ Notification failed:', error);
      }
    } catch (error) {
      this.logger.error('❌ Notification error:', error);
    }
  }

  /**
   * Helper: Send Loan Application created notification
   */

  async sendCARejectionResponseNotification(
    loanApp: any,
    spvId?: number | null,
    token?: string,
  ): Promise<void> {
    try {
      const response = await fetch(
        `${this.notificationServiceUrl}/notifications/loan-apps/ca-rejection`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            loanId: loanApp.id,
            spvId,
            applicant_name: loanApp.client_external.nama_lengkap,
            loan_amount: Number(
              loanApp.loan_application_external.nominal_pinjaman,
            ),
            loan_type: loanApp.loan_application_external.jenis_pembiayaan,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        this.logger.log(`✅ Notification sent: ${data.id}`);
      } else {
        const error = await response.json();
        this.logger.error('❌ Notification failed:', error);
      }
    } catch (error) {
      this.logger.error('❌ Notification error:', error);
    }
  }

  /**
   * Send approval notification
   */
  async sendApprovalNotification(
    payload: NotificationApprovalPayload,
  ): Promise<NotificationResponse | null> {
    try {
      const response = await fetch(
        `${this.notificationServiceUrl}/api/notifications/loan-apps/approval`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...payload,
            notificationType: 'trigger',
          }),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        this.logger.error('Failed to send approval notification:', error);
        return null;
      }

      const data = await response.json();
      this.logger.log(`Approval notification sent successfully: ${data.id}`);
      return data;
    } catch (error) {
      this.logger.error('Error sending approval notification:', error);
      return null;
    }
  }

  /**
   * Send scheduled notification
   */
  async scheduleGeneralNotification(
    payload: NotificationGeneralPayload,
    scheduledAt: Date,
  ): Promise<NotificationResponse | null> {
    try {
      const response = await fetch(
        `${this.notificationServiceUrl}/api/notifications/loan-apps/general`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...payload,
            notificationType: 'schedule',
            scheduledAt: scheduledAt.toISOString(),
          }),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        this.logger.error('Failed to schedule notification:', error);
        return null;
      }

      const data = await response.json();
      this.logger.log(
        `Notification scheduled successfully: ${data.id} for ${scheduledAt}`,
      );
      return data;
    } catch (error) {
      this.logger.error('Error scheduling notification:', error);
      return null;
    }
  }

  /**
   * Helper: Send approval notification
   */
  async sendLoanApprovalNotification(
    loanId: string,
    approverRole: USERTYPE,
    approvalStatus: 'approved' | 'rejected',
    approvedBy: string,
    kesimpulan: string,
    approvalAmount?: number,
    approvalTenor?: number,
    keterangan?: string,
    token?: string,
  ): Promise<void> {
    const title =
      approvalStatus === 'approved'
        ? `Pinjaman Disetujui oleh ${approverRole}`
        : `Pinjaman Ditolak oleh ${approverRole}`;

    const message =
      approvalStatus === 'approved'
        ? `Selamat! Pengajuan pinjaman Anda telah disetujui oleh ${approverRole}.`
        : `Mohon maaf, pengajuan pinjaman Anda ditolak oleh ${approverRole}.`;

    await this.sendApprovalNotification({
      title,
      message,
      token,
      metadata: {
        loanId,
        role: approverRole,
        approvalStatus,
        approvalAmount,
        approvalTenor,
        kesimpulan,
        keterangan,
        approvedBy,
        approvedAt: new Date(),
      },
    });
  }
}
