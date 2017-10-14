import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LibraryComponent } from 'app/components/library/library.component';

const routes: Routes = [
    {
        path: 'read/:id',
        component: HomeComponent
    },
    {
        path: '',
        component: LibraryComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
