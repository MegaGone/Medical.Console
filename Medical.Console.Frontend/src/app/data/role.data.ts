import { ROLE_ENUM } from 'app/enum';
import { SelectItem } from 'app/interfaces';

export const ROLES: Array<SelectItem> = [
    {
        key: 'Administrador',
        value: ROLE_ENUM.ADMIN,
    },
    {
        key: 'Médico',
        value: ROLE_ENUM.DOCTOR,
    },
    {
        key: 'Paciente',
        value: ROLE_ENUM.PATIENT,
    },
];
