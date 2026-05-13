import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

const ERROR_MESSAGES: Record<number, string> = {
  400: 'Parámetro inválido o recurso no encontrado.',
  401: 'API Key inválida o no proporcionada.',
  403: 'La API Key no tiene acceso al endpoint solicitado.'
};

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message = ERROR_MESSAGES[error.status] ?? 'Error inesperado al realizar la petición.';
      return throwError(() => ({ ...error, friendlyMessage: message }));
    })
  );
};
