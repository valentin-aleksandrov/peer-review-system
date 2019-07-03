import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';


@NgModule({
    declarations: [],
    imports: [
      CommonModule, 
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule
    ],
    exports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule

    ]
  })
  export class SharedModule {}
  