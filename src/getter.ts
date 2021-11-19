import { createConnection } from "typeorm";
import { Noise } from "./entity/Noise";

export default async function getNoises() {
  const connection = await createConnection();

  console.log("Loading noises from the database...");
  const noises = await connection.manager.find(Noise, {
    order: {
      id: "ASC",
    },
  });
  console.log("... done");
  await connection.close();
  return noises;
}
