import { Component } from '@angular/core';
 
@Component({
  selector: 'file-upload-demo-app',
  templateUrl: './fileupload-demo.component.html'
})
export class FileUploadDemoComponent  {
  uploadFile: any;
  hasBaseDropZoneOver: boolean = false;
  options: Object = {
    url: 'http://localhost/upload/'//the path to your upload folder
  };
 
  handleUpload(data): void {
    if (data && data.response) {
      data = JSON.parse(data.response);
      this.uploadFile = data;
    }
  }
 
  fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }
}