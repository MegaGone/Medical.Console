import { ROLE_ENUM } from "src/core/auth/enums";
import { IFuseNavigationItem } from "src/interfaces";

export const getMenuByRole = (role: number): Array<IFuseNavigationItem> => {
  const menuConfig: { [key: number]: IFuseNavigationItem[] } = {
    [ROLE_ENUM.ADMIN]: [
      {
        id: "apps.administrador",
        title: "Administración",
        type: "collapsable",
        icon: "heroicons_outline:clipboard-check",
        children: [
          {
            id: "apps.administrador.users",
            title: "Usuarios",
            type: "basic",
            link: "/administrador/usuarios",
          },
        ],
      },
      {
        id: "apps.doctor",
        title: "Médico",
        type: "collapsable",
        icon: "heroicons_outline:clipboard-check",
        children: [
          {
            id: "apps.doctor.medicament",
            title: "Medicamentos",
            type: "basic",
            link: "/administrador/medicamentos",
          },
        ],
      },
    ],
    [ROLE_ENUM.DOCTOR]: [
      {
        id: "apps.doctor",
        title: "Médico",
        type: "collapsable",
        icon: "heroicons_outline:clipboard-check",
        children: [
          {
            id: "apps.doctor.users",
            title: "Pacientes",
            type: "basic",
            link: "/doctor/pacientes",
          },
          {
            id: "apps.doctor.medicament",
            title: "Medicamentos",
            type: "basic",
            link: "/doctor/medicamentos",
          },
        ],
      },
    ],
    [ROLE_ENUM.PATIENT]: [],
  };

  return menuConfig[role] || [];
};
