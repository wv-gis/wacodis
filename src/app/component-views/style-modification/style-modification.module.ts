import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StyleModificationComponent } from './style-modification.component';
import { MatFormFieldModule, MatCheckboxModule, MatCardModule, MatButtonModule, MatDialogModule, MatSelectModule } from '@angular/material';
import { HelgolandModificationModule } from '@helgoland/modification';
import { FormsModule } from '@angular/forms';





@NgModule({
  imports: [
    CommonModule,
    MatCardModule, 
    MatButtonModule, 
    MatDialogModule, 
    MatCheckboxModule, 
    MatSelectModule,MatFormFieldModule, HelgolandModificationModule, FormsModule
  ],
  declarations: [StyleModificationComponent],exports: [StyleModificationComponent],

})
export class StyleModificationModule { }