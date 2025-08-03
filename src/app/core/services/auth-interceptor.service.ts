import { HttpInterceptorFn } from "@angular/common/http";
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem("token") || "";
  if (token) {
    const reqCLone = req.clone({ setHeaders: { token } });
    return next(reqCLone);
  }
  return next(req);
};
