import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  imports: [CommonModule,FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
users:any[]=[];
loading = true;
editingUserId:string|null = null;

  constructor(private authService:AuthService) {}
  async ngOnInit() {
    this.loadusers();
  }

  async loadusers(){
    this.loading = true;
    this.users = await this.authService.getAllUsers();
    this.loading = false;
  }
  startEditing(user:any){
    this.editingUserId = user.id;
  }

  cancelEditing(){
    this.editingUserId = null;
  }
  async saveUser(user:any){
    await this.authService.updateUserData(user.id,{
      plan: user.plan,
      trainer: user.trainer
  });
    this.editingUserId = null;
    await this.loadusers();
}
}
