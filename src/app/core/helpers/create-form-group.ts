import { FormBuilder, FormGroup } from '@angular/forms';

export const createFormGroup = <T extends {}>(controls: any): FormGroup => {
    return new FormBuilder().group<T>(controls);
};
