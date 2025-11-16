import { Component, inject } from '@angular/core';
import { AuthService } from './core/auth.service';


// 👇 Import the specific Material modules we are using
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

// 👇 Important: Also import CommonModule (for *ngIf, *ngFor, etc.)
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,      // gives access to directives like *ngIf, *ngFor
    MatButtonModule,   // gives access to <button mat-raised-button>
    MatCardModule ,
    RouterOutlet,
    RouterModule  // gives access to <mat-card>
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  {
  ngOnInit() {
    this.auth.firebaseintializer();
  }

  auth = inject(AuthService);
  private route = inject(Router)
  currentYear = new Date().getFullYear();

  logout() {
  this.auth.logout().then(() => {
    this.route.navigate(['/login']);
  });
}


}
