import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonHeader, IonButton, IonIcon } from '@ionic/angular/standalone';
import { NgIf } from '@angular/common';

/** Matches API OrgResponse for display in header (id, name, address, phoneNumber). */
export interface AppShellOrgInfo {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
}

export interface AppShellBranchInfo {
  name: string;
}

@Component({
  selector: 'app-app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  standalone: true,
  imports: [IonHeader, IonButton, IonIcon, NgIf],
})
export class AppShellComponent {
  @Input() organization: AppShellOrgInfo | null = null;
  @Input() selectedBranch: AppShellBranchInfo | null = null;
  @Input() isOrgOwner = false;
  @Input() isOrgMode = true;
  @Input() isBranchMode = false;
  @Input() isStaff = false;
  @Input() isBranchUser = false;
  @Input() userDisplayName = 'User';
  @Input() activeMenu = 'Dashboard';
  @Input() showMasterSubmenu = false;
  @Input() showFundsSubmenu = false;
  @Input() showLoanSubmenu = false;

  @Output() menuChange = new EventEmitter<string>();
  @Output() submenuSelect = new EventEmitter<string>();
  @Output() returnToOrgMode = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  onMenuChange(menu: string): void {
    this.menuChange.emit(menu);
  }

  onSubmenuSelect(submenu: string): void {
    this.submenuSelect.emit(submenu);
  }

  onReturnToOrgMode(): void {
    this.returnToOrgMode.emit();
  }

  onLogout(): void {
    this.logout.emit();
  }

  defaultOrgName = 'Navya Micro Credit Services';
}
