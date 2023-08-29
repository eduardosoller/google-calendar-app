import React, { useState, useEffect } from 'react'
import { Link } from 'react-scroll'
import Scrollspy from 'react-scrollspy'
import './styles.css'
const PageNavigation = props => {
  const links = props.links
  const containers = props.containers
  const [scrollPosition, setScrollPosition] = useState(0)
  const [menuPosition, setMenuPosition] = useState(0)
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
      setMenuPosition(window.innerHeight)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return (
    <nav
    id="secondary-navigation"
    className={
      scrollPosition > menuPosition || window.innerWidth < 993
        ? 'sticky'
        : null
    }
    >
    <Scrollspy
    currentClassName="active"
    items={containers}
    >
    <li className="toHome" >
    <Link to="home" smooth duration={500}>
    <i className="material-icons">arrow_upward</i>
    </Link>
    </li>
    {links.map((item, index) =>
      <li key={index}>
      <Link to={item} smooth offset={5} duration={500}>
      {item.toUpperCase()}
      </Link>
      </li>
    )
    }
    </Scrollspy>
    </nav>)
}
export default PageNavigation
