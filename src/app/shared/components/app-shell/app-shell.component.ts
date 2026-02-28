import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonHeader, IonButton, IonIcon } from '@ionic/angular/standalone';
import { NgIf } from '@angular/common';

export interface AppShellOrgInfo {
  name: string;
  phone?: string;
  city?: string;
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

  defaultOrgName = 'Navya Micro Credit Services';

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
}
