import dayjs from 'dayjs'
import { navIcons, navLinks } from '../constants'

function NavBar() {
  return (
    <nav className='nav'>
        <div>
            <img src="/images/logo.svg" alt="this is the logo" />
            <p className='font-bold'>Ravi</p>
            <ul>
                {navLinks.map(({id, name}) => <li key={id}>{name}</li>)}
            </ul>
        </div>
        <div>
            <ul>
                {navIcons.map(({id, img}) => <li key={id}><img src={img} alt="icon" /></li>)}
            </ul>
            <time>{dayjs().format("ddd MMM D h:mm A")}</time>
        </div>
    </nav>
  )
}

export default NavBar