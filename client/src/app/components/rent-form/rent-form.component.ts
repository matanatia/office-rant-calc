import { Component, OnInit } from '@angular/core';
import { RentService } from '../../services/rent.service';
import { RentData } from "../../modules/rent-data";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'rent-form',
  templateUrl: './rent-form.component.html',
  styleUrls: ['./rent-form.component.css']
})
export class RentFormComponent implements OnInit {

  rentData: RentData;
  year: number;
  month: number;
  submitted: boolean;
  current_year: number;

  rentForm: FormGroup;

  constructor( private rentService: RentService, private fb: FormBuilder) {
    this.year = null;
    this.month = null;
    this.rentData = null;
    this.submitted = false;

    let d = new Date();
    this.current_year = d.getFullYear();

    this.rentForm = this.fb.group({
      year: ['', [Validators.required, Validators.min(1980), Validators.max(this.current_year)]],
      month: ['', [Validators.required, Validators.min(1), Validators.max(12)]]
    })
   }

  ngOnInit() {
  }

  getRentInfo( year: number, month: number) {
    this.year = year;
    this.month = month;

    this.rentService.getRentData(year,month)
    .then((data) => {
      this.rentData = data;
    });
  }

  onSubmit() {
    let year: number = Number(this.rentForm.controls.year.value);
    let month: number = Number(this.rentForm.controls.month.value);
    this.getRentInfo(year,month);
    this.submitted = true;
  }

}
