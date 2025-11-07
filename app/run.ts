import { readOffset, incrementOffset } from "../shared/firebase.js";

const run = async () => {
  const offset = await readOffset();

  await incrementOffset(3);

  const offsetNew = await readOffset();

  console.log("offset", offset, offsetNew);
};

run();
