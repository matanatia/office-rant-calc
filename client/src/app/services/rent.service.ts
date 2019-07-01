import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RentService {

  service_url: string;

  constructor() { 
    this.service_url ='http://localhost:5000/';
  }


  async getRentData(year: number, month: number) {
    try {
      const res = await fetch(`${this.service_url}rent?year=${year}&month=${month}`)
      const data = await res.json();
      return data;

    } catch (err) {
      console.error(err);
      return null
    }
  }


  
}