import { Routes } from '@angular/router';
import {UploadViewComponent} from './components/upload-view/upload-view.component';

export const routes: Routes = [
  { path: 'upload', component: UploadViewComponent },
  { path: '', redirectTo: 'upload', pathMatch: 'full' },
  { path: '**', redirectTo: 'upload' }
];
