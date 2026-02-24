import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';


export interface AppError {
  message: string;
  statusCode?: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorHandler {
  /**
   * Handle HTTP errors and return user-friendly messages
   */
  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;
    let statusCode: number | undefined;

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Network error: ${error.error.message}`;
      console.error('Client-side error:', error.error.message);
    } else {
      statusCode = error.status;
      errorMessage = this.getErrorMessage(error.status, error.message);
      console.error(`Backend error ${error.status}:`, error.message);
    }

    const appError: AppError = {
      message: errorMessage,
      statusCode: statusCode,
      timestamp: new Date()
    };

    return throwError(() => appError);
  }


  /**
   * Map HTTP status codes to user-friendly messages
   */
  private getErrorMessage(statusCode: number, defaultMessage: string): string {
    switch (statusCode) {
      case 400:
        return 'Bad Request: The data you provided is invalid. Please check and try again.';

      case 401:
        return 'Unauthorized: You need to log in to access this resource.';

      case 403:
        return 'Forbidden: You do not have permission to access this resource.';

      case 404:
        return 'Not Found: The requested resource could not be found.';

      case 500:
        return 'Server Error: Something went wrong on our end. Please try again later.';

      case 503:
        return 'Service Unavailable: The server is temporarily unavailable. Please try again later.';

      case 0:
        return 'Connection Error: Unable to connect to the server. Please check your internet connection.';

      default:
        return `Error ${statusCode}: ${defaultMessage || 'An unexpected error occurred.'}`;
    }
  }


  /**
   * Get short error message for display
   */
  getShortErrorMessage(error: AppError): string {
    if (error.statusCode === 404) return 'Not Found';
    if (error.statusCode === 500) return 'Server Error';
    if (error.statusCode === 0) return 'Connection Error';
    return 'Error';
  }
  
}
