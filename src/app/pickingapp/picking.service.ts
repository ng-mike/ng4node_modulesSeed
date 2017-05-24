import { Injectable, OnInit } from '@angular/core';
import { PickCriteria, testPick } from "app/pickingapp/models/pickingapp.models";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Router } from "@angular/router";
import { environment } from "environments/environment";
import { Http, Response, RequestOptions } from "@angular/http";
import { AuthService } from "app/shared/auth.service";



@Injectable()
export class PickingService implements OnInit {
default: PickCriteria = {pickType: ['all'], pickFor: {for: 'all', val: 0}, pickUsing: {using: 'all'}, pickLocation: {location:'all'}, pickedBy: this.as.getUserName()};
pickCriteria$: BehaviorSubject<PickCriteria> = new BehaviorSubject<PickCriteria>(this.default);
pick$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  constructor(public router: Router, private http: Http, private as: AuthService) { }

  ngOnInit() {    
    console.log(`picking service created`)
  }

  next(value: PickCriteria): void {
    this.pickCriteria$.next(value);
  }
  pickCriteriaValue(): PickCriteria {
    return this.pickCriteria$.getValue();
  }

  startPicking(): void {    
      this.getPick();
}

getPick() {
  let d = { pickedBy: 'soddc'};
    let params = JSON.stringify(this.pickCriteriaValue()? this.pickCriteriaValue(): d);
    this.http.get(`${environment.nserver}/picking/${params}`)
              .map((r: Response) => r.json())
              .subscribe((value) => {
                //this.pick$.next(testPick);
                this.pick$.next(value);
                //console.log(value);
                this.router.navigate(['stockPicking/pickScreen']);
  });
    
}

postPick(valueObject: any) {
  console.log(`PickingService.postPick() received: `,valueObject)
  const opts = new RequestOptions();
  opts.body = valueObject
    this.http.post(`${environment.nserver}/picking/42`, opts)
              .map((r: Response) => r.json())
              .subscribe((value) => {
                console.log(`postPick() returned: `,value)
                if (value.length == 2 && value[1] == 0) {
                  console.log(`calling getPick from postPick`)
                this.getPick()             
              }
              
  },
  (err) => console.log(err),
  () => console.log(`postPick() completed`));

}




}