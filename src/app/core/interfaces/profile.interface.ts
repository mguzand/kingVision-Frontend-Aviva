import { MenuItem } from 'primeng/api';

export interface Profile {
    firstName: string;
    lastName: string;
    email: string;
    menu: MenuItem[];
}

export class User {
    private _people_id: string = '';
    private _names: string = '';
    private _surname: string = '';
    private _email: string = '';
    private _phone: string = '';


    constructor(
        people_id: string,
        names?: string,
        surname?: string,
        email?: string,
        phone?: string) {
        Object.assign(this, people_id)
    }
    ////////////////////////////////////////////////////////////////////////////////////////
    //============================= INICIO GET SET people_id =============================//
    get people_id(): string {
        return this._people_id;
    }
    set people_id(value: string) {
        this._people_id = value;
    }
    //============================== FIN GET SET people_id ==============================//
    ///////////////////////////////////////////////////////////////////////////////////////
    //============================== INICIO GET SET NOMBRE ==============================//
    get names(): string {
        return this._names;
    }
    set names(value: string) {
        this._names = value;
    }
    //================================ FIN GET SET NOMBRE ================================//
    ////////////////////////////////////////////////////////////////////////////////////////
    //============================= INICIO GET SET APELLIDO ==============================//
    get surname(): string {
        return this._surname;
    }
    set surname(value: string) {
        this._surname = value;
    }
    //=============================== FIN GET SET APELLIDO ===============================//
    ////////////////////////////////////////////////////////////////////////////////////////
    //======================== INICIO GET SET CORREO ELECTRONICO =========================//
    get email(): string {
        return this._email;
    }
    set email(value: string) {
        this._email = value;
    }
    //========================= FIN GET SET CORREO ELECTRONICO ===========================//
    ////////////////////////////////////////////////////////////////////////////////////////
    //============================== INICIO GET SET phone ==============================//
    get phone(): string {
        return this._phone;
    }
    set phone(value: string) {
        this._phone = value;
    }
}