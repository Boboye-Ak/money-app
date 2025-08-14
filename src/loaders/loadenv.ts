import dotenv from "dotenv"

const loadenv = () => {
  console.log("Loading Configurations")
  dotenv.config()
}

export default loadenv
