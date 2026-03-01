import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-placeholder',
  template: `
    <ion-content class="ion-padding">
      <h2>{{ title }}</h2>
      <p>This section is not implemented yet.</p>
    </ion-content>
  `,
  standalone: true,
  imports: [IonContent],
})
export class PlaceholderPage {
  private readonly route = inject(ActivatedRoute);
  title = this.route.snapshot.data['title'] ?? 'Coming soon';
}
