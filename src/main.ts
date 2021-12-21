import { FeatureCollection } from "geojson";
const axios = require("axios");
import "reflect-metadata";
import getNoises from "./getter";
import waitForPromises from "./sender";
import logger from "./logger";

export default async function main(
  featuresPerTime: number,
  requestsPerTime: number,
  endpoint: string
) {
  const noises = await getNoises();

  const proms = [];

  const featureCollection: FeatureCollection = {
    type: "FeatureCollection",
    features: [],
  };

  for (const [requestNumber, noise] of noises.entries()) {
    featureCollection.features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: noise.location.coordinates,
      },
      properties: {
        dummyLocation: true,
        dummyUpdatesCount: 10,
        dummyUpdatesRadiusMax: 0,
        dummyUpdatesRadiusMin: 0,
        perturbatorDecimals: 0,
        gpsPerturbated: true,
        timeStamp: noise.timestamp.getTime(),
        noiseLevel: noise.noise,
      },
    });

    if (featureCollection.features.length % featuresPerTime === 0) {
      // send
      logger(`Sending ${featureCollection.features.length} features...`);
      proms.push(axios.post(endpoint, featureCollection));
      featureCollection.features.splice(0, featureCollection.features.length);
      logger(
        `${new Date().toLocaleTimeString()} - Sent: ${
          Math.round(((requestNumber + 1) / noises.length) * 100 * 1000) / 1000
        }%`
      );
      if (proms.length === requestsPerTime) {
        await waitForPromises(proms);
        proms.splice(0, proms.length);
        featureCollection.features.splice(0, featureCollection.features.length);
      }
    }
  }
  if (featureCollection.features) {
    // send and wait
    logger(`Sending ${featureCollection.features.length} features...`);
    proms.push(axios.post(endpoint, featureCollection));
  }
  await waitForPromises(proms);
}
