import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

import { AddEditUserPage } from './add-edit-user.page';
import { User } from '../../models/user.model';
import { UserFormValue } from '../../models/user-form-value.model';

@Component({
  selector: 'app-user-form',
  template: `
    <ion-content [fullscreen]="true" class="ion-padding">
      <app-add-edit-user
        [user]="user"
        [roles]="['Admin', 'User', 'Staff']"
        (save)="onSave($event)"
        (cancel)="onCancel()">
      </app-add-edit-user>
    </ion-content>
  `,
  standalone: true,
  imports: [IonContent, AddEditUserPage],
})
export class UserFormPage {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /** For edit: set from navigation state (passed from list). */
  user: User | null = null;

  constructor() {
    const state = this.router.getCurrentNavigation()?.extras?.state as { user?: User } | undefined;
    this.user = state?.user ?? null;
  }

  onSave(_value: UserFormValue): void {
    // TODO: call user API (create/update), then navigate
    this.router.navigate(['/dashboard/users']);
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/users']);
  }
}
