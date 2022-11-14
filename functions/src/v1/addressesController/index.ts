import { Request, Response } from "express";
import * as functions from "firebase-functions";
import db from "../helpers";

const addressCollection = "endereco";

interface Endereco {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export default {
  getAll: async (request: Request, response: Response) => {
    functions.logger.info("[GET] - ALL ADDRESS", { structuredData: true });

    try {
      const { docs, empty, size } = await db
        .collection(addressCollection)
        .get();

      response
        .status(201)
        .send({ docs: docs.map((d) => d.data()), empty, size });
    } catch (error) {
      response.status(400).send("Error: Not found collection");
    }
  },

  getById: async (request: Request, response: Response) => {
    const addressId = request.params.id;
    functions.logger.info(`[GET] - ADDRESS BY ID: ${addressId}`);

    response.status(200).send("ok");
  },

  post: async (request: Request, response: Response) => {
    functions.logger.info("[POST] - ENDERECO", { structuredData: true });

    const { body } = request;

    try {
      const endereco: Endereco = {
        cep: body["cep"],
        logradouro: body["logradouro"],
        bairro: body["bairro"],
        cidade: body["cidade"],
        estado: body["estado"],
      };

      const newDoc = await db.collection(addressCollection).add(endereco);

      response.status(201).send(`Created a new address: ${newDoc.id}`);
    } catch (error) {
      response
        .status(400)
        .send(
          "Address should cointain 'cep', 'logradouro', 'bairro', 'cidade' and 'estado'!"
        );
    }
  },

  put: async (request: Request, response: Response) => {
    const addressId = request.params.id;
    functions.logger.info(`[PUT] - ADDRESS BY ID: ${addressId}`);

    response.status(200).send("ok");
  },

  patch: async (request: Request, response: Response) => {
    const addressId = request.params.id;
    functions.logger.info(`[PATCH] - ADDRESS BY ID: ${addressId}`);

    response.status(200).send("ok");
  },

  delete: async (request: Request, response: Response) => {
    const addressId = request.params.id;
    functions.logger.info(`[DELETE] - ADDRESS BY ID: ${addressId}`);

    response.status(200).send("ok");
  },
};
