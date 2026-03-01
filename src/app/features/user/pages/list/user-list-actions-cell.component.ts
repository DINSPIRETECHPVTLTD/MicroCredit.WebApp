import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { IonButton, IonIcon } from '@ionic/angular/standalone';

import { UserResponse } from '../../models/user-response.model';

export interface UserListActionsContext {
  onEdit(user: UserResponse): void;
  onResetPassword(user: UserResponse): void;
  onSetInactive(user: UserResponse): void;
}

@Component({
  selector: 'app-user-list-actions-cell',
  standalone: true,
  imports: [IonButton, IonIcon],
  template: `
    <div class="user-actions-cell">
      <ion-button fill="clear" size="small" (click)="onEdit()" title="Edit">
        <ion-icon name="pencil-outline"></ion-icon>
      </ion-button>
      <ion-button fill="clear" size="small" (click)="onResetPassword()" title="Reset password">
        <ion-icon name="key-outline"></ion-icon>
      </ion-button>
      <ion-button fill="clear" size="small" color="warning" (click)="onSetInactive()" title="Set inactive">
        <ion-icon name="person-remove-outline"></ion-icon>
      </ion-button>
    </div>
  `,
  styles: [
    `
      .user-actions-cell {
        display: flex;
        gap: 2px;
        align-items: center;
        height: 100%;
      }
      .user-actions-cell ion-button {
        --padding-start: 6px;
        --padding-end: 6px;
        margin: 0;
        min-height: 28px;
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
