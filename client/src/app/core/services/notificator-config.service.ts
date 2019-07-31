import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';

@Injectable({
    providedIn: "root"
  })
  export class NotificatorConfigService {
    constructor(
        private readonly authenticationService: AuthenticationService,
    ) {}
    // tslint:disable-next-line: no-unused-expression
    public configEngagespotNotificator(): void {
        const foundScripts = document.getElementsByTagName("script");
         let foundScript;
         for (let i = 0; i < foundScripts.length; i++) {
          //  console.log(foundScripts[i].src);
           if(foundScripts[i].src.toLowerCase().includes('engagespot')){
             foundScript = foundScripts[i];
             const scripts = document.getElementsByTagName("script");
             for(let i = 0; i < scripts.length; i++){
               if(scripts[i].innerHTML.toString().includes('window.Engagespot')){
                 console.log('found.');
                 if(!this.authenticationService.currentUserValue){
                  scripts[i].innerHTML = '';
                 } else {
                  const currentUserName = this.authenticationService.currentUserValue.user.username;
                  scripts[i].innerHTML = `window.Engagespot={},q=function(e){return function(){(window.engageq=window.engageq||[]).push({f:e,a:arguments})}},f=["captureEvent","subscribe","init","showPrompt","identifyUser","clearUser"];for(k in f)Engagespot[f[k]]=q(f[k]);var s=document.createElement("script");s.type="text/javascript",s.async=!0,s.src="https://cdn.engagespot.co/EngagespotSDK.2.0.js";var x=document.getElementsByTagName("script")[0];x.parentNode.insertBefore(s,x); Engagespot.init('zmE3Keawnraz8VGfNP2MNFcNxiw7FG');Engagespot.identifyUser('${currentUserName}');`;
                 }
                 
               }
             }
           }
         }
         if(!!this.authenticationService.currentUserValue && !foundScript){
          const currentUserName = this.authenticationService.currentUserValue.user.username;
          const script = document.createElement("script");
          script.innerHTML = `window.Engagespot={},q=function(e){return function(){(window.engageq=window.engageq||[]).push({f:e,a:arguments})}},f=["captureEvent","subscribe","init","showPrompt","identifyUser","clearUser"];for(k in f)Engagespot[f[k]]=q(f[k]);var s=document.createElement("script");s.type="text/javascript",s.async=!0,s.src="https://cdn.engagespot.co/EngagespotSDK.2.0.js";var x=document.getElementsByTagName("script")[0];x.parentNode.insertBefore(s,x); Engagespot.init('zmE3Keawnraz8VGfNP2MNFcNxiw7FG');Engagespot.identifyUser('${currentUserName}');`;
          document.head.appendChild(script);
         }
      }
  }
  