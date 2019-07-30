import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';


@Component({
  selector: "files-uploader",
  templateUrl: "./files-uploader.component.html",
  styleUrls: ["./files-uploader.component.css"]
})
export class FilesUploaderComponent implements OnInit {
  public files: NgxFileDropEntry[] = [];
  @Output() filesEmiter = new EventEmitter<NgxFileDropEntry[]>();
  
  public areFilesUploaded(): boolean {
    return this.files.length > 0;
  }
 
  ngOnInit(): void {
    
  }
  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    const filesData: File[] = [];
    console.log('file->',this.files[0]);
    console.log('Should sent -> ',this.files[0]);
    
    this.filesEmiter.emit(this.files);
    for (const droppedFile of files) {
 
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          filesData.push(file);
          // Here you can access the real file
          console.log('1v0',droppedFile.relativePath, file);
 
          /**
          // You could upload it like this:
          const formData = new FormData()
          formData.append('logo', file, relativePath)
 
          // Headers
          const headers = new HttpHeaders({
            'security-token': 'mytoken'
          })
 
          this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
          .subscribe(data => {
            // Sanitized logo returned from backend
          })
          **/
 
        });
        
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log('1',droppedFile.relativePath, fileEntry);
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
