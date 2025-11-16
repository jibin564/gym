import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-user',
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  useremail: string | null = null;
  userplan: string = 'free';
  trainer: string = 'none';
  loading: boolean = true;
  userData$: any;
  constructor(private auth: AuthService, private route: Router) { }
  ngOnInit() {
    this.userData$ = this.auth.user$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.useremail = user.email;
        this.auth.getuserDoc(user.uid).pipe(take(1)).subscribe((data:any) => {
          console.log(data);
          if(data){
            this.userplan = data.plan;
           this.trainer = data.trainer;
          } 
        });
        this.loading = false;
      }
    });

  }
  logout() {
    this.auth.logout().then(() => {
      this.route.navigate(['/login']);
    });
  }

}
