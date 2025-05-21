import { useRoutes } from "react-router"
import routes from "~react-pages"
import "./style/style.css"

function App() {

  return (
    <>{useRoutes(routes)}</>
  )
}

export default App
