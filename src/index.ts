import app from "./app";
import config from "./utils/env"

app.listen( config.PORT, () => {
  console.log(`Server Erunning at ${config.HOST}:${config.PORT}`);
  console.log(`Jangan lupa kirim header: X-API-Key: secret-api-key-123`);
});