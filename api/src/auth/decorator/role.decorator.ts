import { SetMetadata } from "@nestjs/common";

export const hasRole = (...roles: string[]) => SetMetadata('roles', roles);