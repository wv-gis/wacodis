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
      this._token = this.http.post('https://www.arcgis.com/sharing/rest/oauth2/token/', { 'client_id': 'nbWzj4cLu1iBIIdR', 'client_secret': 'ef51a52a1e76410ba3298e440bb14d4b', 'grant_type': 'client_credentials' },
        {
          headers: new HttpHeaders({
            // 'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers,content-type', 
            'Content-Type': 'text/plain'
          }), withCredentials: true, params: { 'client_id': 'nbWzj4cLu1iBIIdR', 'client_secret': 'ef51a52a1e76410ba3298e440bb14d4b', 'grant_type': 'client_credentials' }
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
