import { SetMetadata } from "@nestjs/common";
import { ROLE_ENUM } from "../enums";

export const ROLES_KEY = "roles";
export const Roles = (role: ROLE_ENUM) => SetMetadata(ROLES_KEY, role);
