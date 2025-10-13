import React from 'react';
import classNames from 'classnames';
import styles from './DialogBox.module.sass';
import CONSTANTS from '../../../../constants';

function DialogBox(props) {
  const {
    chatPreview,
    userId,
    getTimeStr,
    changeFavorite,
    changeBlackList,
    catalogOperation,
    goToExpandedDialog,
    chatMode,
    interlocutor,
  } = props;

  const { favoriteList = [], participants = [], blackList = [], _id, text, createAt } = chatPreview || {};
  const participantIndex = participants.indexOf(userId);
  const isFavorite = Boolean(favoriteList?.[participantIndex]);
  const isBlocked = Boolean(blackList?.[participantIndex]);

  return (
    <div
      className={styles.previewChatBox}
      onClick={() =>
        goToExpandedDialog({
          interlocutor,
          conversationData: {
            participants,
            _id,
            blackList,
            favoriteList,
          },
        })
      }
    >
      <img
        src={
          interlocutor?.avatar === 'anon.png'
            ? CONSTANTS.ANONYM_IMAGE_PATH
            : `${CONSTANTS.publicURL}${interlocutor?.avatar ?? 'anon.png'}`
        }
        alt="user"
      />

      <div className={styles.infoContainer}>
        <div className={styles.interlocutorInfo}>
          <span className={styles.interlocutorName}>{interlocutor?.firstName ?? 'Anonimous'}</span>
          <span className={styles.interlocutorMessage}>{text}</span>
        </div>
        <div className={styles.buttonsContainer}>
          <span className={styles.time}>{getTimeStr(createAt)}</span>

          <i
            onClick={(event) =>
              changeFavorite(
                {
                  participants,
                  participantsConversationId: _id,
                  favoriteFlag: !isFavorite,
                },
                event
              )
            }
            className={classNames({
              'far fa-heart': !isFavorite,
              'fas fa-heart': isFavorite,
            })}
          />

          <i
            onClick={(event) =>
              changeBlackList(
                {
                  participants,
                  participantsConversationId: _id,
                  blackListFlag: !isBlocked,
                },
                event
              )
            }
            className={classNames({
              'fas fa-user-lock': !isBlocked,
              'fas fa-unlock': isBlocked,
            })}
          />

          <i
            onClick={(event) => catalogOperation(event, _id)}
            className={classNames({
              'far fa-plus-square': chatMode !== CONSTANTS.CATALOG_PREVIEW_CHAT_MODE,
              'fas fa-minus-circle': chatMode === CONSTANTS.CATALOG_PREVIEW_CHAT_MODE,
            })}
          />
        </div>
      </div>
    </div>
  );
}

export default DialogBox;
                            })}
                          />

                          <i
                            onClick={(event) =>
                              changeBlackList(
                                {
                                  participants,
                                  participantsConversationId: _id,
                                  blackListFlag: !isBlocked,
                                },
                                event
                              )
                            }
                            className={classNames({
                              'fas fa-user-lock': !isBlocked,
                              'fas fa-unlock': isBlocked,
                            })}
                          />

                          <i
                            onClick={(event) => catalogOperation(event, _id)}
                            className={classNames({
                              'far fa-plus-square': chatMode !== CONSTANTS.CATALOG_PREVIEW_CHAT_MODE,
                              'fas fa-minus-circle': chatMode === CONSTANTS.CATALOG_PREVIEW_CHAT_MODE,
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  );
                }

                export default DialogBox;
