import { ReaderComponent } from './components/reader/reader.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LibraryComponent } from 'app/components/library/library.component';

const routes: Routes = [
    {
        path: 'read/:id',
        component: ReaderComponent
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
