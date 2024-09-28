import { ROLE_ENUM } from "src/core/auth/enums";
import { IFuseNavigationItem } from "src/interfaces";

export const getMenuByRole = (role: number): Array<IFuseNavigationItem> => {
  const menu: Array<IFuseNavigationItem> = [];

  switch (role) {
    case ROLE_ENUM.ADMIN:
      menu.push({
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
      });
      break;

    case ROLE_ENUM.DOCTOR:
      menu.push({
        id: "apps.doctor",
        title: "Administración",
        type: "collapsable",
        icon: "heroicons_outline:clipboard-check",
        children: [
          {
            id: "apps.doctor.users",
            title: "Usuarios",
            type: "basic",
            link: "/doctor/usuarios",
          },
        ],
      });
      break;

    case ROLE_ENUM.PATIENT:
      break;
  }

  return menu;
};
