import main from "./main";
import { config } from "dotenv";

config({
  path: ".env",
});

(async () => {
  await main(
    Number(process.env.FNM_FEATURESPERTIME) || 50,
    Number(process.env.FNM_REQUESTSPERTIME) || 4,
    process.env.BACKEND_ENDPOINT || "http://localhost:3000/trusted"
  );
})();
