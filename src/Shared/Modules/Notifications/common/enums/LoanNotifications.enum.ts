//! ENUMERATORS
export enum LoanAppsRoleTarget {
  HEAD_MANAGEMENT = 'head_marketing',
  CREDIT_ANALYST = 'credit_analyst',
  SURVEYOR = 'surveyor',
  SUPERVISOR = 'supervisor',
  MARKETING = 'marketing',
}

export enum FlowTargettingMessage {
  DRAFT_SUBMITTED_TO_SUPERVISOR = 'draft_submitted_to_supervisor',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  READ = 'read',
}

export enum NotificationType {
  TRIGGER = 'trigger',
  SCHEDULE = 'schedule',
}
