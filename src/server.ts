import app from "./app"
import environmentVariables from "./configs/environmentVariables"

app.listen(environmentVariables.port, () => {
  console.log(`Server is listening on port ${environmentVariables.port}`)
})
