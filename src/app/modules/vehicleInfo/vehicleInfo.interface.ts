import { vehicleInfovalidation } from "./vehicleInfo.validation";

export interface TVehicleInfo {
  firstName: string;
  lastName: string;
  email: string;
  mobileNo: string;
  carMake: string;
  carDetails: string;
  carImage?: string;
  aboutHear: string;
}
