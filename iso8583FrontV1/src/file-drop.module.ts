import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxFileDropModule } from 'ngx-file-drop';

@NgModule({
  imports: [
    CommonModule,
    NgxFileDropModule
  ],
  exports: [
    NgxFileDropModule
  ]
})
export class FileDropModule {}
