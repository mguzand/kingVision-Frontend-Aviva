import { Pipe, PipeTransform } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Pipe({
  name: 'encrypt'
})
export class EncryptPipe implements PipeTransform {

  transform(value: string, key: string): string {
    const encrypted = CryptoJS.AES.encrypt(value, key).toString();
    const urlSafe = encrypted
    .replace(/\+/g, '-')   // reemplaza '+' con '-'
    .replace(/\//g, '_')   // reemplaza '/' con '_'
    .replace(/=+$/, '');   // remueve '=' del final

    return urlSafe;

    //return encodeURIComponent(encrypted);
  }

}
