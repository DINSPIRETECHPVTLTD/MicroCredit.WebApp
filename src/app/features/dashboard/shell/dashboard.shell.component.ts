import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../auth/services/auth.service';
import { AppShellComponent, AppShellOrgInfo, AppShellBranchInfo } from '../../../shared/components/app-shell';

@Component({
  selector: 'app-dashboard-shell',
  templateUrl: './dashboard.shell.component.html',
  standalone: true,
  imports: [RouterOutlet, AppShellComponent],
})
export class DashboardShellComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  get organization(): AppShellOrgInfo | null {
    return this.auth.getSession()?.organization ?? null;
  }
  selectedBranch: AppShellBranchInfo | null = null;

  isOrgOwner = true;
  isOrgMode = true;
  isBranchMode = false;
  isStaff = false;
  isBranchUser = false;

  activeMenu = 'Dashboard';
  showMasterSubmenu = false;
  showFundsSubmenu = false;
  showLoanSubmenu = false;

  get userDisplayName(): string {
    return this.auth.getDisplayName();
  }

  setActiveMenu(menu: string): void {
    this.activeMenu = menu;
    if (menu === 'Master') this.showMasterSubmenu = !this.showMasterSubmenu;
    if (menu === 'Funds') this.showFundsSubmenu = !this.showFundsSubmenu;
    if (menu === 'Loan') this.showLoanSubmenu = !this.showLoanSubmenu;
  }

  selectSubmenu(submenu: string): void {
    this.activeMenu = submenu;
  }

  returnToOrgMode(): void {
    this.selectedBranch = null;
    this.isBranchMode = false;
    this.isOrgMode = true;
  }

  logout(): void {
    this.auth.clearSession();
    this.router.navigate(['/auth/login']);
  }
}
