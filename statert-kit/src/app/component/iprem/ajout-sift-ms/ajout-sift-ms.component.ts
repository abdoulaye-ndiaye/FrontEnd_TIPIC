import { Component } from '@angular/core';
import { DropzoneModule } from "ngx-dropzone-wrapper";
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

@Component({
  selector: 'app-ajout-sift-ms',
  standalone: true,
  imports: [DropzoneModule],
  templateUrl: './ajout-sift-ms.component.html',
  styleUrl: './ajout-sift-ms.component.scss'
})
export class AjoutSiftMsComponent {

  public Config: DropzoneConfigInterface = {
    clickable: true,
    url: 'https://httpbin.org/post',
    autoProcessQueue: true,
    addRemoveLinks: true,
    parallelUploads: 1,
  };

  public text =' <div class="dz-message needsclick"><i class="icon-cloud-up"></i><p>Drop files here or click to upload.</p></div>';

  onUploadError(args: DropzoneConfigInterface): void {}

  onUploadSuccess(args: DropzoneConfigInterface): void {}

}
