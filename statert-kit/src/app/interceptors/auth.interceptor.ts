import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { catchError, switchMap, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";
import { inject } from "@angular/core";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = (localStorage.getItem("token") as string) || "";
    const refreshToken = (localStorage.getItem("refreshToken") as string) || "";
    const authService = inject(AuthService);

    // Clone the request and add the authorization header
    const authReq = req.clone({
        setHeaders: {
            Authorization: `${token}`,
            refreshToken: `${refreshToken}`,
        },
    });

    // Pass the cloned request with the updated header to the next handler
    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                // Handle 401 error by refreshing the token
                return authService.refreshToken().pipe(
                    switchMap((newToken: string) => {
                        // Clone the request again with the new token
                        const newAuthReq = req.clone({
                            setHeaders: {
                                Authorization: `${newToken}`,
                            },
                        });

                        // Retry the request with the new token
                        return next(newAuthReq);
                    })
                );
            } else {
                return throwError(() => error);
            }
        })
    );
};
