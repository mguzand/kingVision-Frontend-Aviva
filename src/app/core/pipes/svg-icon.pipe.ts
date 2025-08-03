import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Pipe({
  name: 'svgIcon',
  standalone: true,
})
export class SvgIconPipe implements PipeTransform {
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  transform(data: {
    svg: string;
    text: string;
    class: string;
    ruta: string;
    w?: number;
    h?: number;
  }): Observable<SafeHtml> {
    const url = `${data.ruta}/${data.svg}.svg`; //`assets/membership/${data.svg}.svg`;

    return this.http.get(url, { responseType: 'text' }).pipe(
      map((svg) => {
        // Agrega el atributo `color` al SVG root
        const coloredSvg = svg.replace(
          '<svg',
          `<svg class="w-[${data.w || 32}px] h-[${
            data.h || 32
          }px]" color="var(--${data.class})"`
        );
        const finalSvg = coloredSvg.replace('</svg>', `</svg>${data.text}`);
        return this.sanitizer.bypassSecurityTrustHtml(finalSvg);
      }),
      catchError(() => of('<span>Icon not found</span>'))
    );
  }
}
