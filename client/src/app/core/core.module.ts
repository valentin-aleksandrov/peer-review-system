import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JWTDecoderService } from './services/jwt-decoder.service';
import { AuthenticationService } from './services/authentication.service';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
    ],
    providers: [
        JWTDecoderService,
        AuthenticationService
    ],
  })
  export class CoreModule { }
  