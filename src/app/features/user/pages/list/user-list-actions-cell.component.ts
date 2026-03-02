import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { UserResponse } from '../../models/user-response.model';

export interface UserListActionsContext {
  onEdit(user: UserResponse): void;
  onResetPassword(user: UserResponse): void;
  onSetInactive(user: UserResponse): void;
}

@Component({
  selector: 'app-user-list-actions-cell',
  standalone: true,
  imports: [],
  template: `
    <div class="user-actions-cell">
      <button type="button" class="ag-btn ag-edit" (click)="onEdit()" title="Edit">Edit</button>
      <button type="button" class="ag-btn ag-reset-password" (click)="onResetPassword()" title="Reset Password">Reset Password</button>
      <button type="button" class="ag-btn ag-inactive" (click)="onSetInactive()" title="Inactive">Inactive</button>
    </div>
  `,
  styles: [
    `
      .user-actions-cell {
        display: flex;
        gap: 6px;
        align-items: center;
        height: 100%;
        flex-wrap: wrap;
      }
    `,
  ],
})
export class UserListActionsCellComponent implements ICellRendererAngularComp {
  private params!: ICellRendererParams<UserResponse, unknown, UserListActionsContext>;
  private get data(): UserResponse | undefined {
    return this.params?.data;
  }
  private get context(): UserListActionsContext | undefined {
    return this.params?.context as UserListActionsContext | undefined;
  }

  agInit(params: ICellRendererParams<UserResponse, unknown, UserListActionsContext>): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  onEdit(): void {
    if (this.data && this.context?.onEdit) this.context.onEdit(this.data);
  }

  onResetPassword(): void {
    if (this.data && this.context?.onResetPassword) this.context.onResetPassword(this.data);
  }

  onSetInactive(): void {
    if (this.data && this.context?.onSetInactive) this.context.onSetInactive(this.data);
  }
}
