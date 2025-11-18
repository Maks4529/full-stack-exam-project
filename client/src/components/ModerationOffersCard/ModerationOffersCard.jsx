import styles from './ModerationOffersCard.module.sass';
import classNames from 'classnames';
import CONSTANTS from './../../constants';
function ModerationOffersCard({ offer, onApprove, onReject, processing }) {
  return (
    <div key={offer.id} className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.id}>#{offer.id}</div>
        <div
          className={classNames(
            styles.contestType,
            {
              [styles.typeLogo]: offer.Contest?.contestType === 'logo',
            },
            {
              [styles.typeName]: offer.Contest?.contestType === 'name',
            }
          )}
        >
          {offer.Contest?.contestType}
        </div>
        <div className={styles.statusBadge}>{offer.status}</div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.contestTitle}>
          {offer.Contest?.title ?? <em>(Contest without title)</em>}
        </div>
        {offer.Contest?.contestType === 'logo' && offer.fileName ? (
          <>
            <div
              className={styles.resultStyle}
            >{`${offer.Contest?.brandStyle}:`}</div>
            <div className={styles.file}>
              <a
                href={`${CONSTANTS.publicURL}${offer.fileName}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {offer.originalFileName ?? offer.fileName}
              </a>
            </div>
          </>
        ) : offer.text ? (
          <>
            <div
              className={styles.resultStyle}
            >{`${offer.Contest?.styleName}:`}</div>
            <div className={styles.text}>{offer.text}</div>
          </>
        ) : (
          <em>(No content)</em>
        )}
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.actions}>
          <button
            disabled={processing}
            onClick={() => onApprove(offer.id)}
            className={styles.btnApprove}
          >
            Approve
          </button>
          <button
            disabled={processing}
            onClick={() => onReject(offer.id)}
            className={styles.btnReject}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModerationOffersCard;
