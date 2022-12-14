import * as V1Controler from "./v1";
import * as CepController from "./cep";
import * as PatientController from "./patient";
import * as EmployeeController from "./employee";

export const v1 = V1Controler.listener;
export const cep = CepController.listener;
export const patient = PatientController.listener;
export const employee = EmployeeController.listener;
