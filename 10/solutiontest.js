import axios from "axios"

try {
  const response = await axios.get("https://adventofcode.com/2023/day/10/input", {
    headers: {
        Accept: "text/javascript"
    }
  })
  console.log(response.data)

} catch(e) {
    console.log(e.response.data);
}