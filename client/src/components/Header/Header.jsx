import React from 'react';
import { connect } from 'react-redux';
import NotificationsDropdown from '../NotificationsDropdown/NotificationsDropdown';
import { Link } from 'react-router-dom';
import styles from './Header.module.sass';
import CONSTANTS from '../../constants';
import { clearUserStore, getUser, setEventBadgeCount } from '../../store/slices/userSlice';
import withRouter from '../../hocs/withRouter';

class Header extends React.Component {
  constructor (props) {
    super(props);
    this.emailIconRef = React.createRef();
    this.state = { showNotifications: false };
    this.eventTimer = null;
  }

  checkEvents = () => {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const now = Date.now();
    let notifyCount = 0;

    if (events.length === 0) {
      this.props.setEventBadgeCount(0);
      return;
    }

    events.forEach(ev => {
      const notifyMs = ev.notifyBefore * 60 * 1000;
      const notifyTime = ev.datetime - notifyMs;
      
      if (now >= notifyTime && !ev.notified) {
        notifyCount++;
      }
    });

    this.props.setEventBadgeCount(notifyCount);
  };

  componentDidMount () {
    if (!this.props.data) {
      this.props.getUser();
    }

    this.checkEvents();
    this.eventTimer = setInterval(this.checkEvents, 30000);
  }

  componentWillUnmount() {
    clearInterval(this.eventTimer);
  }

  logOut = () => {
    localStorage.clear();
    this.props.clearUserStore();
    this.props.navigate('/login', { replace: true });
  };

  startContests = () => {
    this.props.navigate('/startContest');
  };

  renderLoginButtons = () => {
    if (this.props.data) {
      return (
        <>
          <div className={styles.userInfo}>
            <img
              src={
                this.props.data.avatar === 'anon.png'
                  ? CONSTANTS.ANONYM_IMAGE_PATH
                  : `${CONSTANTS.publicURL}${this.props.data.avatar}`
              }
              alt='user'
            />
            <span>{`Hi, ${this.props.data.displayName}`}</span>
            <img
              src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`}
              alt='menu'
            />
            <ul>
              {this.props.data && this.props.data.role !== CONSTANTS.MODERATOR &&<li>
                <Link to='/dashboard' style={{ textDecoration: 'none' }}>
                  <span>View Dashboard</span>
                </Link>
              </li>}
               {this.props.data && this.props.data.role === 'moderator' && (
                  <li className={styles.moderatorNavItem}>
                    <Link
                      to='/moderator-offers'
                      style={{ textDecoration: 'none' }}
                    >
                      <span>Moderation offers</span>
                    </Link>
                  </li>
                )}
              <li>
                <Link to='/account' style={{ textDecoration: 'none' }}>
                  <span>My Account</span>
                </Link>
              </li>
              {this.props.data && this.props.data.role === CONSTANTS.CUSTOMER && (
                <li className={styles.eventsLinkContainer}>
                      <Link to='/events' style={{ textDecoration: 'none' }}><span>Events</span></Link>
                      {this.props.eventBadgeCount > 0 && (
                        <div className={styles.badge}>
                          {this.props.eventBadgeCount}
                        </div>
                      )}
                    </li>
              )}
              <li>
                <Link
                  to='http:/www.google.com'
                  style={{ textDecoration: 'none' }}
                >
                  <span>Messages</span>
                </Link>
              </li>
              {this.props.data && this.props.data.role !== CONSTANTS.MODERATOR && <li>
                <Link
                  to='http:/www.google.com'
                  style={{ textDecoration: 'none' }}
                >
                  <span>Affiliate Dashboard</span>
                </Link>
              </li>}
              <li>
                <span onClick={this.logOut}>Logout</span>
              </li>
            </ul>
          </div>
          <div>
            <img
              ref={this.emailIconRef}
              src={`${CONSTANTS.STATIC_IMAGES_PATH}email.png`}
              className={styles.emailIcon}
              alt='email'
              onClick={() =>
                this.setState({
                  showNotifications: !this.state.showNotifications,
                })
              }
            />
            {this.props.notificationsUnread > 0 && (
              <div className={styles.emailBadge}>
                {this.props.notificationsUnread}
              </div>
            )}
            {this.state && this.state.showNotifications && (
              <NotificationsDropdown
                anchorRef={this.emailIconRef}
                onClose={() => this.setState({ showNotifications: false })}
              />
            )}
          </div>
        </>
      );
    }
    return (
      <>
        <Link to='/login' style={{ textDecoration: 'none' }}>
          <span className={styles.btn}>LOGIN</span>
        </Link>
        <Link to='/registration' style={{ textDecoration: 'none' }}>
          <span className={styles.btn}>SIGN UP</span>
        </Link>
      </>
    );
  };

  render () {
    if (this.props.isFetching) {
      return null;
    }
    return (
      <div className={styles.headerContainer}>
        <div className={styles.fixedHeader}>
          <span className={styles.info}>
            Squadhelp recognized as one of the Most Innovative Companies by Inc
            Magazine.
          </span>
          <a href='http://www.google.com'>Read Announcement</a>
        </div>
        <div className={styles.loginSignnUpHeaders}>
          <div className={styles.numberContainer}>
            <a
              href={`tel:${CONSTANTS.CONTACTS.phone}`}
              className={styles.phoneLink}
            >
              <img
                src={`${CONSTANTS.STATIC_IMAGES_PATH}phone.png`}
                alt='phone'
              />
              <span className={styles.phoneLinkSpan}>
                {CONSTANTS.CONTACTS.phone}
              </span>
            </a>
          </div>
          <div className={styles.userButtonsContainer}>
            {this.renderLoginButtons()}
          </div>
        </div>
        <div className={styles.navContainer}>
          <Link to='/' className={styles.logoLink}>
            <img
              src={`${CONSTANTS.STATIC_IMAGES_PATH}blue-logo.png`}
              className={styles.logo}
              alt='blue_logo'
            />
          </Link>
          <div className={styles.leftNav}>
            <div className={styles.nav}>
              <ul>
                <li>
                  <span>NAME IDEAS</span>
                  <img
                    src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`}
                    alt='menu'
                  />
                  <ul>
                    <li>
                      <a href='http://www.google.com'>Beauty</a>
                    </li>
                    <li>
                      <a href='http://www.google.com'>Consulting</a>
                    </li>
                    <li>
                      <a href='http://www.google.com'>E-Commerce</a>
                    </li>
                    <li>
                      <a href='http://www.google.com'>Fashion & Clothing</a>
                    </li>
                    <li>
                      <a href='http://www.google.com'>Finance</a>
                    </li>
                    <li>
                      <a href='http://www.google.com'>Real Estate</a>
                    </li>
                    <li>
                      <a href='http://www.google.com'>Tech</a>
                    </li>
                    <li className={styles.last}>
                      <a href='http://www.google.com'>More Categories</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <span>CONTESTS</span>
                  <img
                    src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`}
                    alt='menu'
                  />
                  <ul>
                    <li>
                      <Link to='/how-it-works'>HOW IT WORKS</Link>
                    </li>
                    <li>
                      <a href='http://www.google.com'>PRICING</a>
                    </li>
                    <li>
                      <a href='http://www.google.com'>AGENCY SERVICE</a>
                    </li>
                    <li>
                      <a href='http://www.google.com'>ACTIVE CONTESTS</a>
                    </li>
                    <li>
                      <a href='http://www.google.com'>WINNERS</a>
                    </li>
                    <li>
                      <a href='http://www.google.com'>LEADERBOARD</a>
                    </li>
                    <li className={styles.last}>
                      <a href='http://www.google.com'>BECOME A CREATIVE</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <span>Our Work</span>
                  <img
                    src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`}
                    alt='menu'
                  />
                  <ul>
                    <li>
                      <a href='http://www.google.com'>NAMES</a>
                    </li>
                    <li>
                      <a href='http://www.google.com'>TAGLINES</a>
                    </li>
                    <li>
                      <a href='http://www.google.com'>LOGOS</a>
                    </li>
                    <li className={styles.last}>
                      <a href='http://www.google.com'>TESTIMONIALS</a>
                    </li>
                  </ul>
                </li>
               
                <li>
                  <span>Names For Sale</span>
                  <img
                    src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`}
                    alt='menu'
                  />
                  <ul>
                    <li>
                      <a href='http://www.google.com'>POPULAR NAMES</a>
                    </li>
                    <li>
                      <a href='http://www.google.com'>SHORT NAMES</a>
                    </li>
                    <li>
                      <a href='http://www.google.com'>INTRIGUING NAMES</a>
                    </li>
                    <li>
                      <a href='http://www.google.com'>NAMES BY CATEGORY</a>
                    </li>
                    <li>
                      <a href='http://www.google.com'>VISUAL NAME SEARCH</a>
                    </li>
                    <li className={styles.last}>
                      <a href='http://www.google.com'>SELL YOUR DOMAINS</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <span>Blog</span>
                  <img
                    src={`${CONSTANTS.STATIC_IMAGES_PATH}menu-down.png`}
                    alt='menu'
                  />
                  <ul>
                    <li>
                      <a href='http://www.google.com'>ULTIMATE NAMING GUIDE</a>
                    </li>
                    <li>
                      <a href='http://www.google.com'>
                        POETIC DEVICES IN BUSINESS NAMING
                      </a>
                    </li>
                    <li>
                      <a href='http://www.google.com'>CROWDED BAR THEORY</a>
                    </li>
                    <li className={styles.last}>
                      <a href='http://www.google.com'>ALL ARTICLES</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            {this.props.data && this.props.data.role !== CONSTANTS.CREATOR && this.props.data.role !== CONSTANTS.MODERATOR && (
              <div
                className={styles.startContestBtn}
                onClick={this.startContests}
              >
                START CONTEST
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state.userStore,
  eventBadgeCount: state.userStore.eventBadgeCount,
  notificationsUnread: state.notifications
    ? state.notifications.unreadCount
    : 0,
});
const mapDispatchToProps = dispatch => ({
  getUser: () => dispatch(getUser()),
  clearUserStore: () => dispatch(clearUserStore()),
  setEventBadgeCount: (count) => dispatch(setEventBadgeCount(count)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
