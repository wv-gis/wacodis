import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class RequestTokenService {

  constructor(private http: HttpClient) { }
  
    _token: Observable<Object> = null;
    tokenCache: string;
    requestToken(): Observable<Object> {
      if (!this._token) {
        this._token = this.http.post('https://www.arcgis.com/sharing/rest/oauth2/token/', { 'client_id': 'your client_id', 'client_secret': 'your client secret', 'grant_type': 'client_credentials' },
          {
            headers: new HttpHeaders({
              'Content-Type': 'text/plain'
            }), withCredentials: true, params: { 'client_id': 'your client_id', 'client_secret': 'your client secret', 'grant_type': 'client_credentials' }
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
