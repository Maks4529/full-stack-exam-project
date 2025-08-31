import queryString from 'query-string';
import http from '../interceptor';

export const registerRequest = data => http.post('users/registration', data);
export const loginRequest = data => http.post('users/login', data);
export const getUser = () => http.post('users/getUser');
export const updateContest = data => http.post('contests/updateContest', data);
export const setNewOffer = data => http.post('contests/setNewOffer', data);
export const setOfferStatus = data => http.post('contests/setOfferStatus', data);
export const downloadContestFile = data =>
  http.get(`contests/downloadFile/${data.fileName}`);
export const payMent = data => http.post('contests', data.formData);
export const changeMark = data => http.post('users/changeMark', data);
export const getPreviewChat = () => http.post('chat/getPreview');
export const getDialog = data => http.post('chat/getChat', data);
export const dataForContest = data => http.post('contests/dataForContest', data);
export const cashOut = data => http.post('users/cashout', data);
export const updateUser = data => http.post('users/updateUser', data);
export const newMessage = data => http.post('chat/newMessage', data);
export const changeChatFavorite = data => http.post('chat/favorite', data);
export const changeChatBlock = data => http.post('chat/blackList', data);
export const getCatalogList = data => http.post('chat/getCatalogs', data);
export const addChatToCatalog = data => http.post('chat/addNewChatToCatalog', data);
export const createCatalog = data => http.post('chat/createCatalog', data);
export const deleteCatalog = data => http.post('chat/deleteCatalog', data);
export const removeChatFromCatalog = data =>
  http.post('chat/removeChatFromCatalog', data);
export const changeCatalogName = data => http.post('chat/updateNameCatalog', data);
export const getCustomersContests = data =>
  http.get(`contests/byCustomer?${queryString.stringify(data)}`
);

export const getActiveContests = ({
  offset,
  limit,
  typeIndex,
  contestId,
  industry,
  awardSort,
  ownEntries,
}) =>
  http.post('contests/getAllContests', {
    offset,
    limit,
    typeIndex,
    contestId,
    industry,
    awardSort,
    ownEntries,
  });

export const getContestById = ({contestId}) => http.get(`contests/${contestId}`);
