import type React from 'react';
import styles from './Auth.module.css'

export function Auth({children}:{children:React.ReactNode}){
    return <div className={styles.Auth}>{children}</div>
}