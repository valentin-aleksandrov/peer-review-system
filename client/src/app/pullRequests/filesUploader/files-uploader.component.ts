import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: "files-uploader",
  templateUrl: "./files-uploader.component.html",
  styleUrls: ["./files-uploader.component.css"]
})
export class FilesUploaderComponent implements OnInit {
  public fileUrl: SafeResourceUrl;
  public files: NgxFileDropEntry[] = [];
  @Output() filesEmiter = new EventEmitter<NgxFileDropEntry[]>();
  public url2: string;
  public fileName: string;
  
  constructor(private sanitizer: DomSanitizer){
    
  }

  public areFilesUploaded(): boolean {
    return this.files.length > 0;
  }
 
  ngOnInit(): void {
    
  }
  public dropped(files: NgxFileDropEntry[]) {
     const filesData: File[] = [];
    this.filesEmiter.emit(files);
    console.log('before loop');
    
   // How to handle NgxFileDropEntry
    for (const droppedFile of files) {
      console.log('isFile',droppedFile.fileEntry.name, droppedFile.fileEntry.isFile);
      
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          filesData.push(file);

          console.log('testing file download',file.name,file.type);
          
          const blob = new Blob([file], { type: file.type });
          const url= window.URL.createObjectURL(blob);
          //window.open(url);
          
          console.log('blop',blob);
          
          const reader = new FileReader();
          console.log('try with FileReader()7');
          // reader.readAsDataURL(blob);
          reader.readAsDataURL(file);
          
          console.log('Did it work?');
          this.fileName = `testfile${blob.type}`;
          this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
          
      

     
          // Here you can access the real file 
         
          // You could upload it like this:
          // const formData = new FormData()
          // formData.append('logo', file, relativePath)
 
          // // Headers
          // const headers = new HttpHeaders({
          //   'security-token': 'mytoken'
          // })
 
          // this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
          // .subscribe(data => {
          //   // Sanitized logo returned from backend
          // })
         
 
        });
        
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log('It is not a file.ѝ');
        
      }
    }
  }
 
  public fileOver(event){
    console.log('2',event);
  }
 
  public fileLeave(event){
    console.log('3',event);
  }
 }
