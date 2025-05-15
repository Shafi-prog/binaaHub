import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Assuming you have a LoginComponent and a HomeComponent
// Import them here if they exist, e.g.:
// import { LoginComponent } from './login/login.component';
// import { HomeComponent } from './home/home.component';

const routes: Routes = [
  // Redirect to login page by default or to a home page if preferred
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // Add a route for your login component
  // { path: 'login', component: LoginComponent },
  // Add a route for your home/dashboard component (after login)
  // { path: 'home', component: HomeComponent },
  // Add other routes here
  // Example of a wildcard route for 404 Not Found - place it last
  // { path: '**', redirectTo: '/login' } // Or a dedicated 404 component
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }