import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ButtonsComponent } from './buttons/buttons.component';
import { ComponentsComponent } from './components/components.component';
import { DatagridComponent } from './datagrid/datagrid.component';
import { GetStartedComponent } from './get-started/get-started.component';
import { ServicesComponent } from './services/services.component';
import { TreeviewComponent } from './treeview/treeview.component';

const routes: Routes = [
  { path: '', redirectTo: 'get-started', pathMatch: 'full' },
  { path: 'get-started', component: GetStartedComponent },
  { path: 'components', component: ComponentsComponent },
  { path: 'datagrid', component: DatagridComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'buttons', component: ButtonsComponent },
  { path: 'treeview', component: TreeviewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
