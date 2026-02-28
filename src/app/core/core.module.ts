import { NgModule, Optional, SkipSelf } from '@angular/core';

/**
 * Optional CoreModule: register app-wide singletons (services, interceptors, guards)
 * here or provide them in main.ts / AppComponent for standalone apps.
 */
@NgModule({
  imports: [],
  providers: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parent?: CoreModule) {
    if (parent) {
      throw new Error('CoreModule is already loaded. Import it only in AppModule or main.ts.');
    }
  }
}
