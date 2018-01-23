import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MediaManagerService {

  constructor(public http: HttpClient) { }

  getTree(): Observable<any> {
    return this.http.get('api/admin/tree').map(res => {
      return res;
    }).catch(err => {
      return err;
    });
  }

  uploadFile(file: FormData, path: string): Observable<any> {
    return this.http.post(`api/admin/file?path=${path}`, file).map(res => {
      return res;
    }).catch(err => {
      console.log(err);
      return err;
    });
  }
}
