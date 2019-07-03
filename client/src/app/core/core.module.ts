import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JWTDecoderService } from './services/jwt-decoder.service';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
    ],
    providers: [
        JWTDecoderService
    ],
  })
  export class CoreModule { }
  