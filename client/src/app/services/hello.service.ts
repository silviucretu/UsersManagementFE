import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HelloService {
  url = 'http://localhost:5258/api/hello';

  constructor(private authService: AuthService) { }

  async getHello(text: string = 'Authenticated'): Promise<string> {
    const token = this.authService.getAccessToken();
    const data = await fetch(`${this.url}/${text}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!data.ok) {
      throw new Error(`API error: ${data.status}`);
    }

    const result = await data.json();
    return result;
  }
}