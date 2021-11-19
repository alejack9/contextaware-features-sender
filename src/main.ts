import { FeatureCollection } from "geojson";
const axios = require("axios");
import "reflect-metadata";
import getNoises from "./getter";
import waitForPromises from "./sender";

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
        dummyUpdatesCount: noise.dummyUpdatesCount,
        dummyUpdatesRadiusMax: noise.dummyUpdatesRadiusMax,
        dummyUpdatesRadiusMin: noise.dummyUpdatesRadiusMin,
        perturbatorDecimals: noise.perturbatorDecimals,
        gpsPerturbated: true,
        timeStamp: noise.timestamp.getTime(),
        noiseLevel: noise.noise,
      },
    });

    if ((requestNumber + 1) % featuresPerTime === 0) {
      // send
      console.log(`Sending ${featureCollection.features.length} features...`);
      proms.push(axios.post(endpoint, featureCollection));
      console.log(
        `Sent: ${
          Math.round((requestNumber / noises.length) * 100 * 1000) / 1000
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
    await axios.post(endpoint, featureCollection);
    console.log(
      `Sent and confirmed last ${featureCollection.features.length} features.`
    );
  }
}
