import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  readonly MAIN_PATH = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public get(path: string, params?: HttpParams) {

    if (params) {
      return this.http.get(this.MAIN_PATH + path, { params });
    } else {
      return this.http.get(this.MAIN_PATH + path);
    }
  }

  public post(path: string, body: any): Observable<any> {
    return this.http.post(this.MAIN_PATH + path, body);
  }

  public put(path: string, body: any): Observable<any> {
    return this.http.put(this.MAIN_PATH + path, body);
  }
}
