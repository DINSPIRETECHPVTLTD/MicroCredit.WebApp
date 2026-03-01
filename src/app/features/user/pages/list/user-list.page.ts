import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, GridOptions } from 'ag-grid-community';
import { IonContent, IonButton, IonIcon, IonSpinner } from '@ionic/angular/standalone';

import { AddEditUserPage } from '../add-edit-user/add-edit-user.page';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { UserFormValue } from '../../models/user-form-value.model';

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
    AddEditUserPage,
  ],
})
export class UserListPage implements OnInit {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  activeMenu = 'Users';
  users: User[] = [];
  rowData: User[] = [];
  isLoading = false;
  showForm = false;
  editingUser: User | null = null;

  columnDefs: ColDef<User>[] = [
    { field: 'firstName', headerName: 'First Name', flex: 1 },
    { field: 'lastName', headerName: 'Last Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'role', headerName: 'Role', flex: 1 },
    { field: 'address', headerName: 'Address', flex: 1 },
  ];

  defaultColDef: ColDef<User> = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  gridOptions: GridOptions<User> = {
    onRowDoubleClicked: (e) => e.data && this.onEditUser(e.data),
  };

  pagination = true;
  paginationPageSize = 20;
  paginationPageSizeSelector = [10, 20, 50, 100];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getUsersAsUser().subscribe({
      next: (list: User[]) => {
        this.users = list;
        this.rowData = list;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  onGridReady(_params: GridReadyEvent<User>): void {
    // Grid ready; rowData is bound, no extra setup needed
  }

  openAddUserModal(): void {
    this.editingUser = null;
    this.showForm = true;
  }

  onEditUser(user: User): void {
    this.editingUser = user;
    this.showForm = true;
  }

  onSaveUser(value: UserFormValue): void {
    // TODO: call user API (create or update), then refresh list and close form
    console.log('Save user', value);
    this.showForm = false;
    this.editingUser = null;
    this.loadUsers();
  }

  onCancelUser(): void {
    this.showForm = false;
    this.editingUser = null;
  }

  onMenuChange(menu: string): void {
    this.activeMenu = menu;
    if (menu === 'Dashboard') {
      this.router.navigate(['/dashboard']);
    }
  }

}
