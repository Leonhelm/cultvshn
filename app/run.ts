import { readOffset, updateOffset } from "../shared/firebase.js";

const run = async () => {
  const offset = await readOffset();

  await updateOffset(3);

  const offsetNew = await readOffset();

  console.log("offset", offset, offsetNew);
};

run();
