// import { CatForm } from 'src/app/forms/cat-form/cat-model';
import { Component, OnInit, ViewChild } from "@angular/core";
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatDialog,
} from "@angular/material";
import { NgForm } from "@angular/forms";
import { AdoptionService } from "src/app/shared/services/adoption.service";
import { CatForm } from 'src/app/forms/cat-form/cat-model';

@Component({
  selector: "app-cat-rejected",
  templateUrl: "./cat-rejected.component.html",
  styleUrls: ["./cat-rejected.component.css"],
})
export class CatRejectedComponent implements OnInit {
  application: any;
  catArray = [];
  isLoading: boolean = false;
  applicationID: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("form", { static: false }) form: NgForm;

  dataSource = new MatTableDataSource();

  displayedColumns: string[] = [
    "submissionDate",
    "nameOfCat",
    "applicant",
    "email",
    "phone",
    "address",
    "rejected",
  ];
  constructor(
    public dialog: MatDialog,
    private adoptionService: AdoptionService
  ) {}

  //Load table
  ngOnInit() {
    this.isLoading = true;
    this.catArray = [];
    this.adoptionService.loadCats().subscribe((rejectedCatApp) => {
      rejectedCatApp.forEach((cats: CatForm) => {
        if (cats.rejected) {
          this.catArray.push(cats);
          this.dataSource = new MatTableDataSource(this.catArray);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.isLoading = false;
        }
      });
    });
  }
  //Using Angular material to apply filter for every applications
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //Method to get data when a person click on a row (passing catID)
  getRecord(id: number) {
    this.isLoading = true;
    this.catArray.forEach(
      (element) => {
        if (element.id === id) {
          this.isLoading = false;
          this.application = element;
          this.applicationID = id;
        }
      },
      (error: any) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }
  deleteApplication() {
    this.adoptionService
      .getCatApplication(this.applicationID)
      .subscribe((cat: CatForm) => {
        if (cat != null) {
          this.adoptionService
            .deleteApplication(this.applicationID)
            .subscribe((result: any) => {
              this.ngOnInit();
            });
        }
      });
  }
}
