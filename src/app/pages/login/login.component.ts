import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  error = '';
  loading = false;

  async loginWithEmail() {
    try {
      this.loading = true;
      this.error = '';
      await this.auth.emailSignIn(this.email, this.password);
      this.afterLogin();
    }
    catch (err: any) {
      this.error = err.message || 'Login failed';
    } finally {
      this.loading = false;
    }
  }

  async loginWithGoogle() {
    try {
      this.loading = true;
      this.error = '';
      await this.auth.googleSignIn();
      this.afterLogin();
    } catch (err: any) {
      this.error = err.message || 'Login failed';
    } finally {
      this.loading = false;
    }
  }
  private afterLogin() {
    this.auth.user$.pipe(take(1)).subscribe(user =>{
      if(!user){
        return
      }
        if (!user.emailVerified) {
      this.error = "Please verify your email before logging in.";
      this.auth.sendemailverification(user);
      this.auth.logout();
      return;
    }
    this.auth.isAdmin$.pipe(take(1)).subscribe(isAdmin => {
      this.router.navigate([isAdmin ? '/admin' : '/user']);
    });
    })
     
   
   
  }
  closeLogin() {
    this.router.navigate(['']);
  }
  async signUp() {
    if (!this.email || !this.password) {
      this.error = 'please provide email and password to sign up';
      return;
    }
    try {
      this.loading = true;
      const cred = await this.auth.emailSignUp(this.email, this.password);
      await this.auth.sendemailverification(cred.user);
      await this.auth.ensureuserdoc({
        uid: cred.user.uid,
        email: cred.user.email,
      });
      this.error = "Sign up successful! Please verify your email before logging in.";
    } catch (error: any) {
      this.error = error.message || 'Sign up failed';
    } finally {
      this.loading = false;
      this.auth.logout();
    }
   // this.loginWithEmail();
  }
  async forgotPassword() {
    if (!this.email) {
      this.error = "Enter your email to reset password.";
      return;
    }
    try {
      this.loading = true;
      await this.auth.resetPassword(this.email);
      this.error = "Password reset link sent to your email.";
    } catch (error: any) {
      this.error = error.message || 'Password reset failed';

    } finally {
      this.loading = false;
    }
  }
}
