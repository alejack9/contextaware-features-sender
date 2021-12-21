import { createConnection } from "typeorm";
import { RealNoise } from "./entity/real-noise";
import * as proj4 from "proj4";
import logger from "./logger";

export default async function getNoises() {
  const connection = await createConnection();
  const epsg4326 = "+proj=longlat +datum=WGS84 +no_defs";
  const epsg3857 =
    "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs";
  logger("Loading noises from the database...");
  const noises = await connection.manager.find(RealNoise, {
    order: {
      id: "ASC",
    },
  });
  await connection.close();
  for (const loc of noises)
    loc.location.coordinates = proj4(
      epsg3857,
      epsg4326,
      loc.location.coordinates
    );
  logger(`... done (collected ${noises.length} entries)`);
  return noises;
}
