import styles from './styles.module.css';
import React from 'react';

export default function ThemeSwitcher() {

    const [theme, setTheme] = React.useState('light')

    return (
        <>
            <label
                htmlFor="switcher"
                onClick={() => {
                    setTheme(theme === 'light' ? 'dark' : 'light')
                }}
                className={`${styles['switcher-container']} bg-primary-dark`}
            >

                <input
                    checked={theme === 'dark'}
                    name="switcher"
                    type="checkbox"
                    readOnly
                    className={styles['switcher-checkbox']}
                />

                <div className={styles['switcher-trigger']} />
            </label>
        </>
    );
}
