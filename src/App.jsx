import { useRoutes } from "react-router"
import routes from "~react-pages"
import "./style/style.css"
import { useEffect } from "react";

function App() {

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    
    if (theme === "dark") document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, []);

  return (
    <>{useRoutes(routes)}</>
  )
}

export default App
