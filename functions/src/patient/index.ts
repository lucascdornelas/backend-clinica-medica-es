import * as functions from "firebase-functions";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";

import PatientController from "./patientController";
import { validateTokenId } from "./helpers";

const app = express();

app.use(cors());

app.use(bodyParser.json());

// Cep Routes
app.get("/", PatientController.getAll);
// app.get("/:cep", PatientController.getById);
app.get("/", PatientController.getAll);
// app.get("/:patient", PatientController.getById);
app.post("/", validateTokenId, PatientController.post);
// app.put("/", validateTokenId, PatientController.put);
// app.patch("/", validateTokenId, PatientController.patch);
// app.delete("/", validateTokenId, PatientController.delete);

export const listener = functions.https.onRequest(app);
