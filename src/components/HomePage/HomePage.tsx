import styles from "./HomePage.module.css";

const HomePage = () => {
    return (
        <main>
            <figure>
                <img src="/oak.png" alt="" className={styles.oak}/>
            </figure>
            <section>
                <p>Hello there! Welcome to the world of POKEMON!</p>
                <p>My name is OAK! People call me the POKEMON PROF!</p>
                <p>This world is inhabited by creatures called POKEMON!</p>
                <p>For some people, POKEMON are pets. Others use them for fights. Myself... I study POKEMON as profession.</p>
            </section>
        </main>
    )
}

export default HomePage;