import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
@Component({
    selector: 'create-work-item',
    templateUrl: './create-work-item.component.html',
    styleUrls: ['./create-work-item.component.css']
  })
  export class CreateWorkItemComponent {
    public options: Object = {
      placeholderText: 'Edit Your Content Here!',
      charCounterCount: false,
      events : {
        'froalaEditor.focus' : function(e, editor) {
          console.log(editor.selection.get());
        }
      }
    }
    
    public editorContent: string;

    constructor(){
      console.log(this.options);
      
    }

    public showValue(){
      console.log(this.editorContent);
    }

  }