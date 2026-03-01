import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, GridOptions } from 'ag-grid-community';
import { IonContent, IonButton, IonIcon, IonSpinner } from '@ionic/angular/standalone';

import { UserService } from '../../services/user.service';
import { UserResponse } from '../../models/user-response.model';
import { agGridTheme } from '../../../../shared/config/ag-grid-theme';

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
  ],
})
export class UserListPage implements OnInit {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  activeMenu = 'Users';
  users: UserResponse[] = [];
  rowData: UserResponse[] = [];
  isLoading = false;

  columnDefs: ColDef<UserResponse>[] = [
    { field: 'firstName', headerName: 'First Name', flex: 1 },
    { field: 'surname', headerName: 'Surname', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'role', headerName: 'Role', flex: 1 },
    { field: 'address', headerName: 'Address', flex: 1 },
  ];

  defaultColDef: ColDef<UserResponse> = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  gridOptions: GridOptions<UserResponse> = {
    onRowDoubleClicked: (e) => e.data && this.onEditUser(e.data),
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
        console.log(list);
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

  navigateToAddUser(): void {
    this.router.navigate(['/dashboard/users/add']);
  }

  onEditUser(user: UserResponse): void {
    this.router.navigate(['/dashboard/users/edit', user.id], { state: { user } });
  }

}
