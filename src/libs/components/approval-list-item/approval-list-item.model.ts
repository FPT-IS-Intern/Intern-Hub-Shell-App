import { TemplateRef } from '@angular/core';

export interface ApprovalListItemInterface {
  name: string;
  date: Date;
  rightTemplate?: TemplateRef<any>;
  rightContext?: any;
}
