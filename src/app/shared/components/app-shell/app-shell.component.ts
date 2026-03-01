import { Component, EventEmitter, Input, Output, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { IonHeader, IonButton, IonIcon } from '@ionic/angular/standalone';

import { AppMenuItem, AppMode, AppRole } from '../../models/menu.model';
import {
  APP_MENU,
  DASHBOARD_BASE,
  getFilteredMenu,
  getExpandedKeyForUrl,
} from '../../config/app-menu.config';
import { OrgResponse } from 'src/app/features/auth/models/org-response.model';
import { BranchResponse } from 'src/app/features/auth/models/branch-response.model';

/** Re-export for consumers that expect shell types. */
export type AppShellOrgInfo = OrgResponse;
export type AppShellBranchInfo = BranchResponse;

@Component({
  selector: 'app-app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  standalone: true,
  imports: [IonHeader, IonButton, IonIcon, NgIf, NgFor, RouterLink, RouterLinkActive],
})
export class AppShellComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private routeSub?: Subscription;

  @Input() organization: OrgResponse | null = null;
  @Input() selectedBranch: BranchResponse | null = null;
  @Input() mode: AppMode = 'ORG';
  @Input() role: AppRole = 'OWNER';
  @Input() userDisplayName = 'User';

  @Output() returnToOrgMode = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  /** Which parent menu key has its submenu expanded (or from URL). */
  expandedMenuKey: string | null = null;

  get filteredMenu(): AppMenuItem[] {
    return getFilteredMenu(APP_MENU, this.mode, this.role);
  }

  get isOrgMode(): boolean {
    return this.mode === 'ORG';
  }

  get isBranchMode(): boolean {
    return this.mode === 'BRANCH';
  }

  get showReturnToOrg(): boolean {
    return this.mode === 'BRANCH' && this.role === 'OWNER';
  }

  ngOnInit(): void {
    this.syncExpandedFromUrl(this.router.url);
    this.routeSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.syncExpandedFromUrl(e.url));
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  private syncExpandedFromUrl(url: string): void {
    const key = getExpandedKeyForUrl(this.filteredMenu, url, DASHBOARD_BASE);
    if (key) this.expandedMenuKey = key;
  }

  /** Build routerLink array from route relative to DASHBOARD_BASE. */
  getLink(route: string | undefined): string[] {
    if (route == null || route === '') return [DASHBOARD_BASE];
    return [DASHBOARD_BASE, ...route.split('/')];
  }

  isDashboardRoot(route: string | undefined): boolean {
    return route == null || route === '';
  }

  toggleExpanded(key: string): void {
    this.expandedMenuKey = this.expandedMenuKey === key ? null : key;
  }

  isExpanded(key: string): boolean {
    return this.expandedMenuKey === key;
  }

  onReturnToOrgMode(): void {
    this.returnToOrgMode.emit();
  }

  onLogout(): void {
    this.logout.emit();
  }
}
