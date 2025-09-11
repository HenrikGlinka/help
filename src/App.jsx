import { useRoutes } from "react-router"
import routes from "~react-pages"
import "./style/style.css"
import { useEffect } from "react";

function App() {

  useEffect(() => {
    const theme = localStorage.getItem("theme");

    if (theme === "dark") {
      document.body.classList.add("dark");
      document.querySelector('meta[name="theme-color"]').setAttribute("content", "#000000");
    } else {
      document.body.classList.remove("dark");
      document.querySelector('meta[name="theme-color"]').setAttribute("content", "#ffffff");
    }
  }, []);

  return (
    <>{useRoutes(routes)}</>
  )
}

export default App
