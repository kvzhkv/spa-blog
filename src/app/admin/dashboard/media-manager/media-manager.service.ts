import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MediaManagerService {

  constructor(public http: HttpClient) { }

  getList(): Observable<any> {
    return this.http.get('api/admin/list').map(res => {
      return res;
    }).catch(err => {
      return err;
    });
  }

  uploadFile(file: FormData): Observable<any> {
    return this.http.put('api/admin/file', file).map(res => {
      console.log(res);
      return res;
    }).catch(err => {
      // console.log(err);
      return err;
    });
  }
}
