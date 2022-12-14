import { Request, Response } from "express";
import * as functions from "firebase-functions";
import db from "../../helpers/firebase";

const employeeCollection = "employee";

/**
 *  * A class that can validate cep and return object model.
 */
class Employee {
  name: string;
  email: string;
  phoneNumber: string;
  startDate: string;
  salary: string;
  role: string;
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
  specialty: string;
  crm: string;

  /**
   *  * A constructor model
   * @param {string} name The string.
   * @param {string} email The string.
   * @param {string} phoneNumber The string.
   * @param {string} startDate The string.
   * @param {string} salary The string.
   * @param {string} role The string.
   * @param {string} cep The string.
   * @param {string} logradouro The string.
   * @param {string} bairro The string.
   * @param {string} cidade The string.
   * @param {string} estado The string.
   * @param {string} specialty The string.
   * @param {string} crm The string.
   */
  constructor(
    name: string,
    email: string,
    phoneNumber: string,
    startDate: string,
    salary: string,
    role: string,
    cep: string,
    logradouro: string,
    bairro: string,
    cidade: string,
    estado: string,
    specialty: string = "",
    crm: string = ""
  ) {
    this.name = name;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.startDate = startDate;
    this.salary = salary;
    this.role = role;
    this.cep = cep;
    this.logradouro = logradouro;
    this.bairro = bairro;
    this.cidade = cidade;
    this.estado = estado;
    this.specialty = specialty;
    this.crm = crm;
  }

  /**
   * @return {Boolean}
   */
  validatorCep() {
    const rgxCep = /^[0-9]{5}-[0-9]{3}/;

    const isValidCepNumber = rgxCep.test(this.cep);

    return isValidCepNumber;
  }

  /**
   *  return object to save in db
   * @return {Object}
   */
  toObject() {
    return {
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
      startDate: this.startDate,
      salary: this.salary,
      role: this.role,
      cep: this.cep,
      logradouro: this.logradouro,
      bairro: this.bairro,
      cidade: this.cidade,
      estado: this.estado,
      specialty: this.specialty,
      crm: this.crm,
    };
  }
}

// Generic converter
const genericConverter = <T>() => ({
  toFirestore(data: Partial<T>) {
    return data;
  },
  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): T {
    return snapshot.data() as T;
  },
});

const employeeConverter = genericConverter<Employee>();

export default {
  // getById: async (request: Request, response: Response) => {
  //   const cepNumber = request.params.cep;
  //   functions.logger.info(`[GET] - CEP BY NUMBER: ${cepNumber}`);

  //   const document = await db
  //     .collection(cepCollection)
  //     .doc(cepNumber)
  //     .withConverter(cepConverter)
  //     .get();

  //   if (document.exists) {
  //     const cepData = document.data();

  //     response.status(200).send({ result: cepData });
  //   } else {
  //     response.status(404).send({ message: "Not Found" });
  //   }
  // },

  getAll: async (request: Request, response: Response) => {
    functions.logger.info(`[GET] - ALL`);

    const documents = await db
      .collection(employeeCollection)
      .withConverter(employeeConverter)
      .get();

    if (!documents.empty) {
      const employeeDatas = documents.docs.map((doc) => doc.data());

      response.status(200).send({ result: employeeDatas });
    } else {
      response.status(404).send({ message: "Not Found" });
    }
  },

  post: async (request: Request, response: Response) => {
    functions.logger.info("[POST] - Employee", { structuredData: true });

    const { body } = request;

    try {
      const {
        name,
        email,
        phoneNumber,
        startDate,
        salary,
        role,
        cep,
        logradouro,
        bairro,
        cidade,
        estado,
        specialty,
        crm,
      } = body;

      const employeeModel = new Employee(
        name,
        email,
        phoneNumber,
        startDate,
        salary,
        role,
        cep,
        logradouro,
        bairro,
        cidade,
        estado,
        specialty,
        crm
      );

      if (employeeModel.validatorCep()) {
        await db.collection(employeeCollection).add(employeeModel.toObject());

        response.status(201).send(`Created a new employee: ${email}`);
      } else {
        response.status(400).send("Error: Invalid Cep Number");
      }
    } catch (error) {
      response
        .status(400)
        .send(
          "Employee should cointain 'name', 'email', 'phoneNumber', 'startDate', 'salary', 'role', 'cep', 'logradouro', 'bairro', 'cidade' and 'estado'!"
        );
    }
  },

  // put: async (request: Request, response: Response) => {
  //   functions.logger.info("[PUT] - CEP", { structuredData: true });

  //   const { body } = request;

  //   try {
  //     const { cep, logradouro, bairro, cidade, estado } = body;

  //     const cepModel = new Cep(cep, logradouro, bairro, cidade, estado);

  //     if (cepModel.validatorCep()) {
  //       await db
  //         .collection(cepCollection)
  //         .doc(cepModel.getCepId())
  //         .update(cepModel.toObject());

  //       response.status(201).send(`Updated a cep: ${cep}`);
  //     } else {
  //       response.status(400).send("Error: Invalid Cep Number");
  //     }
  //   } catch (error) {
  //     response
  //       .status(400)
  //       .send(
  //         "Address should cointain 'cep', 'logradouro', 'bairro', 'cidade' and 'estado'!"
  //       );
  //   }
  // },

  // patch: async (request: Request, response: Response) => {
  //   functions.logger.info("[Patch] - CEP", { structuredData: true });

  //   const { body } = request;

  //   try {
  //     const { cep, logradouro, bairro, cidade, estado } = body;

  //     const cepModel = new Cep(cep, logradouro, bairro, cidade, estado);

  //     if (cepModel.validatorCep()) {
  //       await db
  //         .collection(cepCollection)
  //         .doc(cepModel.getCepId())
  //         .update(cepModel.toObject());

  //       response.status(201).send(`Updated a cep: ${cep}`);
  //     } else {
  //       response.status(400).send("Error: Invalid Cep Number");
  //     }
  //   } catch (error) {
  //     response
  //       .status(400)
  //       .send(
  //         "Address should cointain 'cep', 'logradouro', 'bairro', 'cidade' and 'estado'!"
  //       );
  //   }
  // },

  // delete: async (request: Request, response: Response) => {
  //   functions.logger.info("[Delete] - CEP", { structuredData: true });

  //   const { body } = request;

  //   try {
  //     const { cep, logradouro, bairro, cidade, estado } = body;

  //     const cepModel = new Cep(cep, logradouro, bairro, cidade, estado);

  //     if (cepModel.validatorCep()) {
  //       await db.collection(cepCollection).doc(cepModel.getCepId()).delete();

  //       response.status(201).send(`Delete a cep: ${cep}`);
  //     } else {
  //       response.status(400).send("Error: Invalid Cep Number");
  //     }
  //   } catch (error) {
  //     response
  //       .status(400)
  //       .send(
  //         "Address should cointain 'cep', 'logradouro', 'bairro', 'cidade' and 'estado'!"
  //       );
  //   }
  // },
};
