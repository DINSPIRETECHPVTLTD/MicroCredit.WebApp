import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
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

  /** Organization from session (login / navigate-to-org). */
  get organization(): AppShellOrgInfo | null {
    return this.auth.getOrganization();
  }
  /** Branch from session (set by navigate-to-branch). */
  get selectedBranch(): AppShellBranchInfo | null {
    return this.auth.getBranch();
  }

  get isOrgMode(): boolean {
    return this.auth.getMode() === 'ORG';
  }
  get isBranchMode(): boolean {
    return this.auth.getMode() === 'BRANCH';
  }
  isOrgOwner = true;
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
    this.auth.navigateToOrg().subscribe({
      error: () => {},
    });
  }

  /** Call when user selects a branch (e.g. from branch list). */
  selectBranch(branchId: number): void {
    this.auth.navigateToBranch(branchId).subscribe({
      error: () => {},
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
