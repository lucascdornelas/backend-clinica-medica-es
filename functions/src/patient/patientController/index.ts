import { Request, Response } from "express";
import * as functions from "firebase-functions";
import db from "../../helpers/firebase";

const patientController = "patient";

/**
 *  * A class that can validate patient and return object model.
 */
class Patient {
  cep: string;
  avatarUrl: string;
  createdAt: string;
  email: string;
  id: string;
  name: string;
  phone: string;
  weigth: number;
  heigth: number;
  bloodType: string;

  /**
   *  * A constructor model
   * @param {string} cep The 1st string.
   * @param {string} avatarUrl The 2nd string.
   * @param {string} createdAt The 3rd string.
   * @param {string} email The 4th string.
   * @param {string} id The 5th string.
   * @param {string} name The 6th string.
   * @param {string} phone The 7th string.
   * @param {string} weigth The 8th string.
   * @param {string} heigth The 9th string.
   * @param {string} bloodType The 10th string.
   */
  constructor(
    cep: string,
    avatarUrl: string,
    createdAt: string,
    email: string,
    id: string,
    name: string,
    phone: string,
    weigth: number,
    heigth: number,
    bloodType: string
  ) {
    (this.cep = cep),
      (this.avatarUrl = avatarUrl),
      (this.createdAt = createdAt),
      (this.email = email),
      (this.id = id),
      (this.name = name),
      (this.phone = phone),
      (this.weigth = weigth),
      (this.heigth = heigth),
      (this.bloodType = bloodType);
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
      cep: this.cep,
      avatarUrl : this.avatarUrl,
      createdAt: this.createdAt,
      email: this.email,
      id: this.id,
      name: this.name,
      phone: this.phone,
      weigth: this.weigth,
      heigth: this.heigth,
      bloodType: this.bloodType,
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

const patientConverter = genericConverter<Patient>();

export default {
  // getById: async (request: Request, response: Response) => {
  //   const cepNumber = request.params.cep;
  //   functions.logger.info(`[GET] - CEP BY NUMBER: ${cepNumber}`);

  //   const document = await db
  //     .collection(patientController)
  //     .doc(cepNumber)
  //     .withConverter(patientConverter)
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
      .collection(patientController)
      .withConverter(patientConverter)
      .get();

    if (!documents.empty) {
      const patientDatas = documents.docs.map((doc) => doc.data());

      response.status(200).send({ result: patientDatas });
    } else {
      response.status(404).send({ message: "Not Found" });
    }
  },

  post: async (request: Request, response: Response) => {
    functions.logger.info("[POST] - CEP", { structuredData: true });

    const { body } = request;

    try {
      const {
        cep,
        avatarUrl,
        createdAt,
        email,
        id,
        name,
        phone,
        weigth,
        heigth,
        bloodType
      } = body;

      const patientModel = new Patient(cep, avatarUrl, createdAt, email, id, name, phone, weigth, heigth, bloodType);

      if (patientModel.validatorCep()) {
        await db
          .collection(patientController)
          .doc(id)
          .create(patientModel.toObject());

        response.status(201).send(`Created a new patient: ${id}`);
      } else {
        response.status(400).send("Error: Invalid Patient CEP!");
      }
    } catch (error) {
      response
        .status(400)
        .send(
          "Could not create patient. Please check the request body and try again."
        );
    }
  },

  // put: async (request: Request, response: Response) => {
  //   functions.logger.info("[PUT] - CEP", { structuredData: true });

  //   const { body } = request;

  //   try {
  //     const { cep, logradouro, bairro, cidade, estado } = body;

  //     const patientModel = new Cep(cep, logradouro, bairro, cidade, estado);

  //     if (patientModel.validatorCep()) {
  //       await db
  //         .collection(patientController)
  //         .doc(patientModel.getCepId())
  //         .update(patientModel.toObject());

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

  //     const patientModel = new Cep(cep, logradouro, bairro, cidade, estado);

  //     if (patientModel.validatorCep()) {
  //       await db
  //         .collection(patientController)
  //         .doc(patientModel.getCepId())
  //         .update(patientModel.toObject());

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

  //     const patientModel = new Cep(cep, logradouro, bairro, cidade, estado);

  //     if (patientModel.validatorCep()) {
  //       await db
  //         .collection(patientController)
  //         .doc(patientModel.getCepId())
  //         .delete();

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
