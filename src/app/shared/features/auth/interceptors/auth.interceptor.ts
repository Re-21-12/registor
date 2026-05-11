import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const user = this.authService.getCurrentUserSync();

    if (user) {
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${user.id}`,
        },
      });
      return next.handle(clonedReq);
    }

    return next.handle(req);
  }
}
