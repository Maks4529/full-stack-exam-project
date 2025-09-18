import { Link } from "react-router-dom";
import Badge from "./Badge/Badge";
import styles from "./Menu.module.sass";

function Menu({ badgeCount }) {
  return (
    <nav className={styles.menu}>
      <Link to="/">Home</Link>
      <div className={styles.eventsLink}>
        <Link to="/events">Events</Link>
        <Badge count={badgeCount} />
      </div>
    </nav>
  );
}

export default Menu;
