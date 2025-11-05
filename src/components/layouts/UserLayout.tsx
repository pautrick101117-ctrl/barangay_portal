import { Outlet, useLocation } from "react-router-dom"
import Header from "../UserComponents/Header"
import { useEffect, useState } from "react"

const UserLayout = () => {
  const location = useLocation()
  const [isHomePage, setIsHomePage] = useState(true)

  const homeStyle = "relative h-[calc(100vh-(120px))] sm:h-[calc(100vh-(144px))]"

  useEffect(() => {
    setIsHomePage(location.pathname === "/" || location.pathname === "/contact") 
  }, [location.pathname])

  return (
    <>
      {isHomePage && <Header />}
      <main className={`${isHomePage ? homeStyle : ""}`}>
        <Outlet />
      </main>
    </>
  )
}

export default UserLayout
