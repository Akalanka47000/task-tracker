import { type EmployeeDepartment, UserRole } from "@shared/constants"

declare global {
    type EmployeeDetails = {
        department: EmployeeDepartment
    };
    type UserDetails = {
        [UserRole.Employee]: EmployeeDetails;
        [UserRole.Administrator]: Record<string, any>;
    };
}

export { };
