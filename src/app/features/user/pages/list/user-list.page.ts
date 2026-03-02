import { Component, inject, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, GridOptions, RowDoubleClickedEvent } from 'ag-grid-community';
import { IonContent, IonButton, IonIcon, IonSpinner, ModalController, AlertController } from '@ionic/angular/standalone';

import { UserService } from '../../services/user.service';
import { UserResponse } from '../../models/user-response.model';
import { agGridTheme } from '../../../../shared/config/ag-grid-theme';
import { AddEditUserPage } from '../add-edit-user/add-edit-user.page';
import { UserListActionsCellComponent } from './user-list-actions-cell.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.page.html',
  styleUrls: ['./user-list.page.scss'],
  standalone: true,
  imports: [
    NgIf,
    IonContent,
    IonButton,
    IonIcon,
    IonSpinner,
    AgGridAngular,
    UserListActionsCellComponent,
  ],
})
export class UserListPage implements OnInit {
  private readonly userService = inject(UserService);
  private readonly modalController = inject(ModalController);
  private readonly alertController = inject(AlertController);

  activeMenu = 'Users';
  users: UserResponse[] = [];
  rowData: UserResponse[] = [];
  isLoading = false;

  columnDefs: ColDef<UserResponse>[] = [
    { field: 'id', headerName: 'User', flex: 0, width: 80 },
    {
      headerName: 'Full Name',
      flex: 1,
      valueGetter: (params) => {
        const d = params.data;
        if (!d) return '';
        return [d.firstName, d.surname].filter(Boolean).join(' ');
      },
    },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'role', headerName: 'Role', flex: 1 },
    { field: 'address', headerName: 'Address', flex: 1 },
    {
      headerName: 'Actions',
      flex: 0,
      width: 280,
      sortable: false,
      filter: false,
      cellRenderer: UserListActionsCellComponent,
    },
  ];

  defaultColDef: ColDef<UserResponse> = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  gridOptions: GridOptions<UserResponse> = {
    onRowDoubleClicked: (e: RowDoubleClickedEvent<UserResponse>) => e.data && this.onEditUser(e.data),
    context: {
      onEdit: (user: UserResponse) => this.onEditUser(user),
      onResetPassword: (user: UserResponse) => this.onResetPassword(user),
      onSetInactive: (user: UserResponse) => this.onSetInactive(user),
    },
  };

  pagination = true;
  paginationPageSize = 20;
  paginationPageSizeSelector = [10, 20, 50, 100];

  /** Shared AG Grid theme (Quartz with custom params). */
  agGridTheme = agGridTheme;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (list: UserResponse[]) => {
        this.users = list;
        this.rowData = list;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  onGridReady(_params: GridReadyEvent<UserResponse>): void {
    // Grid ready; rowData is bound, no extra setup needed
  }

  async navigateToAddUser(): Promise<void> {
    const modal = await this.modalController.create({
      component: AddEditUserPage,
      componentProps: { userResponse: null, isModal: true },
      cssClass: 'user-form-modal',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) this.loadUsers();
  }

  async onEditUser(user: UserResponse): Promise<void> {
    const modal = await this.modalController.create({
      component: AddEditUserPage,
      componentProps: { userResponse: user, isModal: true },
      cssClass: 'user-form-modal',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) this.loadUsers();
  }

  async onResetPassword(user: UserResponse): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Reset password',
      message: `Send a password reset to ${user.email}?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Reset',
          handler: () => {
            // TODO: call API to send reset password (e.g. POST /api/users/{id}/reset-password)
            this.loadUsers();
          },
        },
      ],
    });
    await alert.present();
  }

  async onSetInactive(user: UserResponse): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Set user inactive',
      message: `Set ${user.firstName} ${user.surname} as inactive? They will no longer be able to sign in.`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Set inactive',
          role: 'destructive',
          handler: () => {
            // TODO: call API to set user inactive (e.g. PUT /api/users/{id}/inactive)
            this.loadUsers();
          },
        },
      ],
    });
    await alert.present();
  }
}
