import * as functions from "firebase-functions";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";

import CepController from "./cepController";
import { validateTokenId } from "./helpers";

const app = express();

app.use(cors());

app.use(bodyParser.json());

// Cep Routes
app.get("/", CepController.getAll);
app.get("/:cep", CepController.getById);
app.post("/", validateTokenId, CepController.post);
app.put("/", validateTokenId, CepController.put);
app.patch("/", validateTokenId, CepController.patch);
app.delete("/", validateTokenId, CepController.delete);

export const listener = functions.https.onRequest(app);
