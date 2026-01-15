import app from "./app";
import config from "./utils/env";


app.listen(config.PORT, () => {
  console.log(`🚀 Server running in ${config.NODE_ENV} mode`);
  
});