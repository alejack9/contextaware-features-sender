export default async function waitForPromises(proms: Promise<any>[]) {
  let progress = 0;
  proms.forEach((p) =>
    p.then(() => console.log(`Received: ${++progress} / ${proms.length}`))
  );
  await Promise.all(proms);
}
