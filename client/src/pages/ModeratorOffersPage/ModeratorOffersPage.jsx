import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getModeratorOffers } from '../../api/rest/restController';
import { approveOffer, rejectOffer } from '../../api/rest/restController';
import styles from './ModeratorOffersPage.module.sass';

const ModeratorOffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    getModeratorOffers({ page: 1 })
      .then(res => {
        const data = res && res.data ? res.data : res;
        const safeOffers = Array.isArray(data?.offers) ? data.offers : [];
        const pendingOffers = safeOffers.filter(o => o.status === 'pending');
        setOffers(pendingOffers);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching moderator offers:', err);
        setError('Failed to load offers');
        setLoading(false);
      });
  }, []);

  const onApprove = async offerId => {
    try {
      setProcessing(prev => ({ ...prev, [offerId]: true }));
      await approveOffer({ offerId });
      setOffers(prev => prev.filter(o => o.id !== offerId));
      setProcessing(prev => {
        const copy = { ...prev };
        delete copy[offerId];
        return copy;
      });
    } catch (e) {
      console.error('approve error', e);
      setError('Failed to approve offer');
      setProcessing(prev => {
        const copy = { ...prev };
        delete copy[offerId];
        return copy;
      });
    }
  };

  const onReject = async offerId => {
    try {
      setProcessing(prev => ({ ...prev, [offerId]: true }));
      await rejectOffer({ offerId });
      setOffers(prev => prev.filter(o => o.id !== offerId));
      setProcessing(prev => {
        const copy = { ...prev };
        delete copy[offerId];
        return copy;
      });
    } catch (e) {
      console.error('reject error', e);
      setError('Failed to reject offer');
      setProcessing(prev => {
        const copy = { ...prev };
        delete copy[offerId];
        return copy;
      });
    }
  };

  if (loading)
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.status}>Loading...</div>
        </div>
      </div>
    );
  if (error)
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.status}>{error}</div>
        </div>
      </div>
    );

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerRow}>
            <button className={styles.backButton} onClick={() => navigate('/')}>
              Back to home
            </button>
            <div className={styles.titleContainer}>
              <h2 className={styles.title}>Offers for moderation</h2>
              <span className={styles.sub}>
                Showing offers with status "pending"
              </span>
            </div>
          </div>
        </div>

        {offers.length === 0 ? (
          <div className={styles.empty}>No offers for moderation.</div>
        ) : (
          <div className={styles.grid}>
            {offers.map(offer => (
              <div key={offer.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.id}>#{offer.id}</div>
                  <div className={styles.statusBadge}>{offer.status}</div>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.row}>
                    <span className={styles.label}>User:</span>{' '}
                    <span className={styles.value}>{offer.userId}</span>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.label}>Contest:</span>{' '}
                    <span className={styles.value}>{offer.contestId}</span>
                  </div>
                  <div className={styles.text}>
                    {offer.text ?? <em>(no text)</em>}
                  </div>
                </div>
                <div className={styles.cardFooter}>
                  <div className={styles.creator}>
                    Creator:{' '}
                    {offer.User && offer.User.email
                      ? offer.User.email.split('@')[0]
                      : `#${offer.id}`}
                  </div>
                  <div className={styles.actions}>
                    <button
                      disabled={processing[offer.id]}
                      onClick={() => onApprove(offer.id)}
                      className={styles.btnApprove}
                    >
                      Approve
                    </button>
                    <button
                      disabled={processing[offer.id]}
                      onClick={() => onReject(offer.id)}
                      className={styles.btnReject}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModeratorOffersPage;
