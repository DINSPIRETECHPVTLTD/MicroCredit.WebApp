import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { AppShellComponent, AppShellOrgInfo, AppShellBranchInfo } from '../../../shared/components/app-shell';
import type { AppMode, AppRole } from '../../../shared/models/menu.model';

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
    return this.auth.getOrganization();
  }

  get selectedBranch(): AppShellBranchInfo | null {
    return this.auth.getBranch();
  }

  get mode(): AppMode {
    const m = this.auth.getMode();
    return (m === 'ORG' || m === 'BRANCH' ? m : 'ORG') as AppMode;
  }

  get role(): AppRole {
    const r = this.auth.getSession()?.role as AppRole | undefined;
    if (r === 'OWNER' || r === 'BRANCH_ADMIN' || r === 'STAFF' || r === 'BRANCH_USER') return r;
    return 'OWNER';
  }

  get userDisplayName(): string {
    return this.auth.getDisplayName();
  }

  returnToOrgMode(): void {
    this.auth.navigateToOrg().subscribe({ error: () => {} });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
