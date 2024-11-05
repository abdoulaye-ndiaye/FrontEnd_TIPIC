import { ApplicationModule, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FromageService } from "../../../services/fromage.service";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-details-echantillon",
    standalone: true,
    imports: [CommonModule, ApplicationModule],
    templateUrl: "./details-echantillon.component.html",
    styleUrl: "./details-echantillon.component.scss",
})
export class DetailsEchantillonComponent implements OnInit {
    id_echantillon: string;
    echantillon: any;
    production: any;
    affinage: any;
    fabrication: any;

    constructor(
        private route: ActivatedRoute,
        private fromageService: FromageService
    ) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            this.id_echantillon = params["id"];
        });
        this.fromageService
            .getEchantillonById(this.id_echantillon)
            .subscribe((data) => {
                this.echantillon = data;
                this.fromageService
                    .getProductionByIdEchantilon(this.id_echantillon)
                    .subscribe((data1) => {
                        this.production = data1[0];
                        this.fromageService
                            .getAffinageByIdEchantilon(this.id_echantillon)
                            .subscribe((data2) => {
                                this.affinage = data2[0];
                                this.fromageService
                                    .getFabricationByIdEchantilon(
                                        this.id_echantillon
                                    )
                                    .subscribe((data3) => {
                                        this.fabrication = data3[0];
                                    });
                            });
                    });
            });
    }
}
