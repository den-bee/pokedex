import styles from "./Root.module.css";
import {Outlet, NavLink} from "react-router-dom";

const Root = () => {
    return (
        <div>
            <header>
                <nav className={styles.topNavigation}>
                    <ul>
                        <li><NavLink className={({isActive}) => isActive ? styles.active : styles.notactive} to="/">Home</NavLink></li>
                        <li><NavLink className={({isActive}) => isActive ? styles.active : styles.notactive} to="pokemon">Pokemon</NavLink></li>
                    </ul>
                </nav>
            </header>
            <Outlet/>
        </div>
    )
}

export default Root;