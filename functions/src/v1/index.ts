import * as functions from "firebase-functions";
import * as express from "express";
import * as bodyParser from "body-parser";

import AddressController from "./addressesController";

const app = express();
app.use(bodyParser.json());

// Addresses Routes
app.get("/addresses", AddressController.getAll);
app.get("/addresses/:id", AddressController.getById);
app.post("/addresses", AddressController.post);
app.put("/addresses/:id", AddressController.put);
app.patch("/addresses/:id", AddressController.patch);
app.delete("/addresses/:id", AddressController.delete);

export const listener = functions.https.onRequest(app);
