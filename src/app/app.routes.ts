import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AdminComponent } from './pages/admin/admin.component';
import { authGuard } from './core/auth.guard';
import { UserComponent } from './pages/user/user.component';

export const routes: Routes = [
   
    /* { path: 'about', component: AboutComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'contact', component: ContactComponent }, */
    {
        path:'login',
        component:LoginComponent
    },
    {path:'admin',
        loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
        canActivate:[authGuard]
    },
    {path:'user',
        loadComponent: () => import('./pages/user/user.component').then(m => m.UserComponent),
        canActivate:[authGuard]
    },
   /*  {path:'admin',component:AdminComponent,canActivate:[authGuard]},
    {path:'user',component:UserComponent,canActivate:[authGuard]}, */
    {path:'**',redirectTo:'',pathMatch:'full'}

];
