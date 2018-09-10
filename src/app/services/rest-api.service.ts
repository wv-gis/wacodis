import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const REST_URL = '';

@Injectable()
export class RestApiService {

  constructor(private http: HttpClient) { }

  _token: Observable<Object> = null;
  tokenCache: string;
  requestToken(): Observable<Object> {
    if (!this._token) {
      this._token = this.http.post('https://www.arcgis.com/sharing/rest/oauth2/token/', { 'client_id': 'xy3kRucXy392s2dg', 'client_secret': 'c55f6b8434d244409b43f237faaa47a9', 'grant_type': 'client_credentials' },
        {
          headers: new HttpHeaders({
            // 'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers,content-type', 
            'Content-Type': 'text/plain'
          }), withCredentials: true, params: { 'client_id': 'xy3kRucXy392s2dg', 'client_secret': 'c55f6b8434d244409b43f237faaa47a9', 'grant_type': 'client_credentials' }
        });
    }

    return this._token;
  }
  setToken(token: string) {
    this.tokenCache = token;
  }
  getToken(): string {
    return this.tokenCache;
  }
  refreshToken(){
    
  }
}
