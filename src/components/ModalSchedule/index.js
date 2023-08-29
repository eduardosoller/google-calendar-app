import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Link } from 'react-scroll'
import useScrollBlock from '../../hooks/useScrollBlock'
import './style.css'
export const ModalSchedule = props => {
  const [blockScroll, allowScroll] = useScrollBlock()
  const { pathname } = useLocation()

  if (!props.show) {
    allowScroll()
    return null
  }
  blockScroll()
  return (
    <div id="modal" onClick={props.onClose} className="ModalScheduleBackground">
    <div className="ModalSchedule" onClick={e => e.stopPropagation()}>
    <header>
    <span>MARCAR HORÁRIO</span>
    <button onClick={props.onClose}>
    <i className="material-icons">close</i>
    </button>
    </header>
    <ul onClick={props.onClose}>
    <li>
      {pathname === '/estudios/sala01'
        ? <Link to="marcar" smooth onClick={props.onClose} className="text-blue"><div><span>ensaiar na</span>SALA 01</div></Link>
        : <NavLink to="/estudios/sala01#marcar" className="text-blue">
    <div><span>ensaiar na</span>SALA 01</div></NavLink>
}
    </li>
    <li>
    {pathname === '/estudios/sala02'
      ? <Link to="marcar" smooth offset={5} onClick={props.onClose} className="text-red"><div><span>ensaiar na</span>SALA 01</div></Link>
      : <NavLink to="/estudios/sala02#marcar" className="text-red">
    <div>
    <span>ensaiar na</span>SALA 02
    </div>
    </NavLink>
}
    </li>
    <li>

     {pathname === '/gravacao'
       ? <Link to="gravar" offset={5} smooth onClick={props.onClose} className="text-pink"><div><span>ensaiar na</span>SALA 01</div></Link>
       : <NavLink to="/gravacao#gravar" className="text-pink">
    <div>
    <span>quero</span>GRAVAR
    </div>
    </NavLink>
}
    </li>
    </ul>
    </div>
    </div>
  )
}
