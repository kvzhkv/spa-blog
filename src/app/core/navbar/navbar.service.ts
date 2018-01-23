import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// import { URI } from '../../config/config';

// import { HttpService } from '../http.service';

@Injectable()
export class NavbarService {
  constructor(private http: HttpClient) { }

  getMenuItems() {
    return this.http.get('api/blog/menu').map((res) => {
      return res['menuItems'];
    }).catch((err) => {
      console.log(err);
      return err;
    });
  }

  getTags(): Observable<string[]> {
    return this.http.get('api/blog/tags').map(res => {
      const body = res['tags'];
      return body;
    }).catch(err => {
      return err;
    });
  }
}