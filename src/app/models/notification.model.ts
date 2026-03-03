export interface NotificationActionData {
  action?: string;
  screen?: string;
  url?: string;
  id?: string;
  task_id?: string;
  [key: string]: unknown;
}

export interface InAppNotificationResponse {
  id: string;
  title: string;
  content: string;
  type: string;
  actionData?: NotificationActionData | string;
  read: boolean;
  createdAt: number;
}
