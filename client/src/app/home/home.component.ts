import { Component, OnInit } from '@angular/core';
import { WorkItemDataService } from '../core/services/work-item-data.service';
import { AuthenticationService } from '../core/services/authentication.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
  })
  export class HomeComponent implements OnInit{
    constructor(
      private readonly workItemDataService: WorkItemDataService,
      private readonly authenticationService: AuthenticationService,
      ){
      
    }
    ngOnInit(): void {
      this.configEngagespotNotificator();
    }
    private configEngagespotNotificator(): void {
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
               const currentUserName = this.authenticationService.currentUserValue.user.username;
               scripts[i].innerHTML = `window.Engagespot={},q=function(e){return function(){(window.engageq=window.engageq||[]).push({f:e,a:arguments})}},f=["captureEvent","subscribe","init","showPrompt","identifyUser","clearUser"];for(k in f)Engagespot[f[k]]=q(f[k]);var s=document.createElement("script");s.type="text/javascript",s.async=!0,s.src="https://cdn.engagespot.co/EngagespotSDK.2.0.js";var x=document.getElementsByTagName("script")[0];x.parentNode.insertBefore(s,x); Engagespot.init('zmE3Keawnraz8VGfNP2MNFcNxiw7FG');Engagespot.identifyUser('${currentUserName}');`;
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