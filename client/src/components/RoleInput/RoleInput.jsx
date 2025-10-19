import React from 'react';
import styles from './RoleInput.module.sass';

function RoleInput({
  label, id, strRole, infoRole, field, type,
}) {
  return (
    <label htmlFor={id}>
      <div className={styles.roleContainer}>
        <input {...field} type={type} id={id} />
        <div className={styles.infoRoleContainer}>
          <span className={styles.role}>{strRole}</span>
          <span className={styles.infoRole}>{infoRole}</span>
        </div>
      </div>
    </label>
  );
}

export default RoleInput;
