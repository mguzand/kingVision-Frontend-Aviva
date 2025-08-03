import { Person } from "../../../core/interfaces/manage-person.interface";

export interface ResponsePerson {
    person?: Person;
    rnp?: RnpPerson;
    InternalRNP: InternalRNP;
}

interface InternalRNP{
  numeroIdentidad: string,
  primerNombre: string,
  segundoNombre: string,
  primerApellido: string,
  segundoApellido: string,
  codigoSexo: number,
  fechaNacimiento: string
}



export interface RnpPerson {
    NumInscripcion: string;
    Nombres: string;
    PrimerApellido: string;
    SegundoApellido: string;
    Sexo: string;
    FechaDeNacimiento: string;
    EstadoCivil: number;
    DescrEstadoCivil: string;
    EstadoVivencia: number;
    DescrEstadoVivencia: string;
    FechaDeDefuncion: string;
    PaisNacimiento: number;
    DescrPaisNacimiento: string;
    DeptoNacimiento: number;
    DescrDeptoNacimiento: string;
    MunicNacimiento: number;
    DescrMunicNacimiento: string;
    BarrioNacimiento: number;
    DescrBarrioNacimiento: string;
    PaisResidencia: number;
    DescrPaisResidencia: string;
    DeptoResidencia: number;
    DescrDeptoResidencia: string;
    MunicResidencia: number;
    DescrMunicResidencia: string;
    BarrioResidencia: number;
    DescrBarrioResidencia: string;
    DireccionResidencia: string;
    OcupacionLaboral: number;
    DescrOcupacionLaboral: string;
    NumeroTelefono: string;
    TelefonoCelular: string;
    CorreoElectronico: string;
    Madre: any;
    Padre: any;
    ErrorMsg: any;
    Foto?: string;
    FotoError?: any;
    InscripcionesNac: InscripcionesNac[];
    NumeroIdentidad: string;
    DetalleError?: any;
    CertificadoMatrimonio: CertificadoMatrimonio[];
}

interface CertificadoMatrimonio {
    NumInscripcion: string;
    NumeroTomo: number;
    NumeroFolio: number;
    NombresVaron: string;
    PrimerApellidoVaron: string;
    SegundoApellidoVaron: string;
    TipoIdentidadVaron: string;
    NumeroIdentidadVaron: string;
    NombresMujer: string;
    PrimerApellidoMujer: string;
    SegundoApellidoMujer: string;
    TipoIdentidadMujer: string;
    NumeroIdentidadMujer: string;
    FechaDeMatrimonio: string;
    PaisMatrimonio: string;
    DeptoMatrimonio: string;
    MuniMatrimonio: string;
    LugarMatrimonio: string;
    ErrorMsg: ErrorMsg;
}

interface InscripcionesNac {
    NumInscripcion: string;
    Nombres: string;
    PrimerApellido: string;
    SegundoApellido: string;
    Sexo: string;
    FechaDeNacimiento: string;
    EstadoCivil: number;
    EstadoVivencia: number;
    FechaDeDefuncion: string;
    ErrorMsg: ErrorMsg;
}

interface ErrorMsg {
    TipoDeError: string;
    DescripcionError: string;
}