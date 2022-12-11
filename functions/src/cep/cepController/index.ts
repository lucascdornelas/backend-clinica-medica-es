import { Request, Response } from "express";
import * as functions from "firebase-functions";
import db from "../../helpers/firebase";

const cepCollection = "cep";

/**
 *  * A class that can validate cep and return object model.
 */
class Cep {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;

  /**
   *  * A constructor model
   * @param {string} cep The first string.
   * @param {string} logradouro The second string.
   * @param {string} bairro The third string.
   * @param {string} cidade The fourth string.
   * @param {string} estado The fifth string.
   */
  constructor(
    cep: string,
    logradouro: string,
    bairro: string,
    cidade: string,
    estado: string
  ) {
    this.cep = cep;
    this.logradouro = logradouro;
    this.bairro = bairro;
    this.cidade = cidade;
    this.estado = estado;
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
   * @return {String}
   */
  getCepId() {
    return this.cep.replace("-", "");
  }

  /**
   *  return object to save in db
   * @return {Object}
   */
  toObject() {
    return {
      cep: this.cep,
      logradouro: this.logradouro,
      bairro: this.bairro,
      cidade: this.cidade,
      estado: this.estado,
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

const cepConverter = genericConverter<Cep>();

export default {
  getById: async (request: Request, response: Response) => {
    const cepNumber = request.params.cep;
    functions.logger.info(`[GET] - CEP BY NUMBER: ${cepNumber}`);

    const document = await db
      .collection(cepCollection)
      .doc(cepNumber)
      .withConverter(cepConverter)
      .get();

    if (document.exists) {
      const cepData = document.data();

      response.status(200).send({ result: cepData });
    } else {
      response.status(404).send({ message: "Not Found" });
    }
  },

  getAll: async (request: Request, response: Response) => {
    functions.logger.info(`[GET] - ALL`);

    const documents = await db
      .collection(cepCollection)
      .withConverter(cepConverter)
      .get();

    if (!documents.empty) {
      const cepDatas = documents.docs.map((doc) => doc.data());

      response.status(200).send({ result: cepDatas });
    } else {
      response.status(404).send({ message: "Not Found" });
    }
  },

  post: async (request: Request, response: Response) => {
    functions.logger.info("[POST] - CEP", { structuredData: true });

    const { body } = request;

    try {
      const { cep, logradouro, bairro, cidade, estado } = body;

      const cepModel = new Cep(cep, logradouro, bairro, cidade, estado);

      if (cepModel.validatorCep()) {
        await db
          .collection(cepCollection)
          .doc(cepModel.getCepId())
          .create(cepModel.toObject());

        response.status(201).send(`Created a new cep: ${cep}`);
      } else {
        response.status(400).send("Error: Invalid Cep Number");
      }
    } catch (error) {
      response
        .status(400)
        .send(
          "Address should cointain 'cep', 'logradouro', 'bairro', 'cidade' and 'estado'!"
        );
    }
  },

  put: async (request: Request, response: Response) => {
    functions.logger.info("[PUT] - CEP", { structuredData: true });

    const { body } = request;

    try {
      const { cep, logradouro, bairro, cidade, estado } = body;

      const cepModel = new Cep(cep, logradouro, bairro, cidade, estado);

      if (cepModel.validatorCep()) {
        await db
          .collection(cepCollection)
          .doc(cepModel.getCepId())
          .update(cepModel.toObject());

        response.status(201).send(`Updated a cep: ${cep}`);
      } else {
        response.status(400).send("Error: Invalid Cep Number");
      }
    } catch (error) {
      response
        .status(400)
        .send(
          "Address should cointain 'cep', 'logradouro', 'bairro', 'cidade' and 'estado'!"
        );
    }
  },

  patch: async (request: Request, response: Response) => {
    functions.logger.info("[Patch] - CEP", { structuredData: true });

    const { body } = request;

    try {
      const { cep, logradouro, bairro, cidade, estado } = body;

      const cepModel = new Cep(cep, logradouro, bairro, cidade, estado);

      if (cepModel.validatorCep()) {
        await db
          .collection(cepCollection)
          .doc(cepModel.getCepId())
          .update(cepModel.toObject());

        response.status(201).send(`Updated a cep: ${cep}`);
      } else {
        response.status(400).send("Error: Invalid Cep Number");
      }
    } catch (error) {
      response
        .status(400)
        .send(
          "Address should cointain 'cep', 'logradouro', 'bairro', 'cidade' and 'estado'!"
        );
    }
  },

  delete: async (request: Request, response: Response) => {
    functions.logger.info("[Delete] - CEP", { structuredData: true });

    const { body } = request;

    try {
      const { cep, logradouro, bairro, cidade, estado } = body;

      const cepModel = new Cep(cep, logradouro, bairro, cidade, estado);

      if (cepModel.validatorCep()) {
        await db.collection(cepCollection).doc(cepModel.getCepId()).delete();

        response.status(201).send(`Delete a cep: ${cep}`);
      } else {
        response.status(400).send("Error: Invalid Cep Number");
      }
    } catch (error) {
      response
        .status(400)
        .send(
          "Address should cointain 'cep', 'logradouro', 'bairro', 'cidade' and 'estado'!"
        );
    }
  },
};
