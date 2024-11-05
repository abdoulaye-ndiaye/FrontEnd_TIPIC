import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { DropzoneModule } from "ngx-dropzone-wrapper";
import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";
import Swal from "sweetalert2";
import { SiftMsService } from "../../../services/sift-ms.service";

@Component({
    selector: "app-ajout-sift-ms",
    standalone: true,
    imports: [DropzoneModule, ReactiveFormsModule, CommonModule],
    templateUrl: "./ajout-sift-ms.component.html",
    styleUrl: "./ajout-sift-ms.component.scss",
})
export class AjoutSiftMsComponent implements OnInit {
    siftMsForm: FormGroup;
    validate = false;

    constructor(
        private formBuilder: FormBuilder,
        private siftMsService: SiftMsService
    ) {}

    ngOnInit(): void {
        this.siftMsForm = this.formBuilder.group({
            blanc_positif: ["", Validators.required],
            blanc_negatif: ["", Validators.required],
            fromage_positif: ["", Validators.required],
            fromage_negatif: ["", Validators.required],
            file: [null, Validators.required],
        });
    }

    onSubmit() {}

    public Config: DropzoneConfigInterface = {
        clickable: true,
        url: "https://httpbin.org/post",
        autoProcessQueue: true,
        addRemoveLinks: true,
        parallelUploads: 1,
    };

    public text =
        ' <div class="dz-message needsclick"><i class="icon-cloud-up"></i><p>Déposez les fichiers ici ou cliquez pour les ajouter.</p></div>';

    onUploadError(args: DropzoneConfigInterface): void {}

    onUploadSuccess(args: DropzoneConfigInterface): void {}

    get blanc_positif() {
        return this.siftMsForm.get("blanc_positif");
    }
    get blanc_negatif() {
        return this.siftMsForm.get("blanc_negatif");
    }
    get fromage_positif() {
        return this.siftMsForm.get("fromage_positif");
    }
    get fromage_negatif() {
        return this.siftMsForm.get("fromage_negatif");
    }
    get file() {
        return this.siftMsForm.get("file");
    }
}
