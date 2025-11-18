import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getModeratorOffers } from '../../api/rest/restController';
import { approveOffer, rejectOffer } from '../../api/rest/restController';
import styles from './ModeratorOffersPage.module.sass';
import ModerationOffersCard from '../../components/ModerationOffersCard/ModerationOffersCard';

const ModeratorOffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [processing, setProcessing] = useState({});
  const navigate = useNavigate();

  const fetchOffers = useCallback(async (pageNum, showPageLoader = true) => {
    if (showPageLoader) {
      setLoading(true);
    }
    setError(null);
    try {
      const res = await getModeratorOffers({ page: pageNum });
      const data = res && res.data ? res.data : res;
      const safeOffers = Array.isArray(data?.offers) ? data.offers : [];

      setOffers(safeOffers);
      setTotalPages(data.totalPages || 1);
      setPage(data.currentPage || 1);
    } catch (err) {
      console.error('Error fetching moderator offers:', err);
      setError('Failed to load offers');
    } finally {
      if (showPageLoader) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchOffers(page, true);
  }, [page, fetchOffers]);

  const onApprove = async (offerId) => {
    try {
      setProcessing((prev) => ({ ...prev, [offerId]: true }));
      await approveOffer({ offerId });

      if (offers.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        await fetchOffers(page, false);
      }
    } catch (e) {
      console.error('approve error', e);
      setError('Failed to approve offer');
    } finally {
      setProcessing((prev) => {
        const copy = { ...prev };
        delete copy[offerId];
        return copy;
      });
    }
  };

  const onReject = async (offerId) => {
    try {
      setProcessing((prev) => ({ ...prev, [offerId]: true }));
      await rejectOffer({ offerId });

      if (offers.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        await fetchOffers(page, false);
      }
    } catch (e) {
      console.error('reject error', e);
      setError('Failed to reject offer');
    } finally {
      setProcessing((prev) => {
        const copy = { ...prev };
        delete copy[offerId];
        return copy;
      });
    }
  };
  const handlePrevPage = () => {
    if (page > 1) {
      setPage((p) => p - 1);
    }
  };
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((p) => p + 1);
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
              Home
            </button>
            <div className={styles.titleContainer}>
              <h2 className={styles.title}>Offers for moderation</h2>
              <span className={styles.sub}>
                Showing offers with status "pending"
              </span>
            </div>
          </div>
        </div>

        {offers.length === 0 && !loading ? (
          <div className={styles.empty}>No offers for moderation.</div>
        ) : (
          <div className={styles.grid}>
            {offers.map((offer) => (
              <ModerationOffersCard
                key={offer.id}
                offer={offer}
                onApprove={onApprove}
                onReject={onReject}
                processing={processing[offer.id]}
              />
            ))}
          </div>
        )}

        {(offers.length > 0 || page > 1) && !loading && (
          <div className={styles.paginationButtons}>
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className={styles.btnPagination}
            >
              Previous
            </button>
            <span className={styles.paginationInfo}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page >= totalPages}
              className={styles.btnPagination}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModeratorOffersPage;
