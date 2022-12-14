import * as functions from "firebase-functions";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";

import EmployeeController from "./employeeController";
import { validateTokenId } from "./helpers";

const app = express();

app.use(cors());

app.use(bodyParser.json());

// Employee Routes
app.get("/", EmployeeController.getAll);
// app.get("/:cep", EmployeeController.getById);
app.get("/", EmployeeController.getAll);
// app.get("/:customer", EmployeeController.getById);
app.post("/", validateTokenId, EmployeeController.post);
// app.put("/", validateTokenId, EmployeeController.put);
// app.patch("/", validateTokenId, EmployeeController.patch);
// app.delete("/", validateTokenId, EmployeeController.delete);

export const listener = functions.https.onRequest(app);
