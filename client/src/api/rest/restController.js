import queryString from 'query-string';
import http from '../interceptor';

export const registerRequest = data => http.post('users/registration', data);
export const loginRequest = data => http.post('users/login', data);
export const getUser = () => http.get('users/me');
export const updateUser = data => http.patch('users/me', data);
export const changeMark = data => http.post('users/marks', data);
export const cashOut = data => http.post('users/cashout', data);

export const payMent = data => http.post('contests', data.formData);
export const getCustomersContests = data =>
  http.get(`contests/byCustomer?${queryString.stringify(data)}`);
export const getContestById = ({ contestId }) =>
  http.get(`contests/${contestId}`);
export const dataForContest = data =>
  http.get('contests/data', { params: data });
export const getActiveContests = params => http.get('contests', { params });
export const updateContest = ({ id, ...data }) =>
  http.patch(`contests/${id}`, data);
export const downloadContestFile = ({ fileName }) =>
  http.get(`contests/download/${fileName}`);

export const setNewOffer = payload => {
  if (typeof FormData !== 'undefined' && payload instanceof FormData) {
    const contestId = payload.get('contestId');
    payload.delete('contestId');
    return http.post(`contests/${contestId}/offers`, payload);
  }

  const { contestId, ...data } = payload || {};
  return http.post(`contests/${contestId}/offers`, data);
};
export const setOfferStatus = data =>
  http.patch(`offers/${data.offerId}/status`, data);
export const getModeratorOffers = data =>
  http.get('offers/moderation', { params: data });
export const approveOffer = ({ offerId }) =>
  http.patch(`offers/moderation/${offerId}`, { status: 'approved' });
export const rejectOffer = ({ offerId }) =>
  http.patch(`offers/moderation/${offerId}`, { status: 'rejected' });

export const getPreviewChat = () => http.get('chat/preview');
export const getDialog = ({ id }) => http.get(`chat/dialogs/${id}`);
export const newMessage = ({ id, participantsConversationId, ...data }) =>
  http.post(`chat/dialogs/${id || participantsConversationId}/messages`, data);
export const changeChatFavorite = ({
  id,
  participantsConversationId,
  ...data
}) =>
  http.patch(`chat/dialogs/${id || participantsConversationId}/favorite`, data);
export const changeChatBlock = ({ id, participantsConversationId, ...data }) =>
  http.patch(
    `chat/dialogs/${id || participantsConversationId}/blackList`,
    data
  );

export const getCatalogList = data =>
  http.get('chat/catalogs', { params: data });
export const createCatalog = data => http.post('chat/catalogs', data);
export const addChatToCatalog = ({ id, ...data }) =>
  http.post(`chat/catalogs/${id}/chats`, data);
export const deleteCatalog = ({ id, catalogId }) =>
  http.delete(`chat/catalogs/${id || catalogId}`);
export const removeChatFromCatalog = ({ catalogId, chatId }) =>
  http.delete(`chat/catalogs/${catalogId}/chats/${chatId}`);
export const changeCatalogName = ({ id, catalogId, ...data }) =>
  http.patch(`chat/catalogs/${id || catalogId}`, data);
