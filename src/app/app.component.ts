import { Component, OnInit, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SupabaseAuthService } from './core/services/supabase-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private readonly auth = inject(SupabaseAuthService);

  ngOnInit(): void {
    // Inicia la escucha de cambios de estado de autenticación
    this.auth.stateAuthChanges();
  }
}
