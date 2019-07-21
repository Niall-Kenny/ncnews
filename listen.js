const { PORT = 9090 } = process.env;
const { app } = require("./server/app");

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
