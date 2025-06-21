import styles from "./styles.module.css";
import React from "react";

export default function ThemeSwitcher({ theme, toggleTheme }: { theme: string, toggleTheme: () => void }) {

  return (
    <>
      <label
        htmlFor="switcher"
        onClick={() => {
          toggleTheme();
        }}
        className={`${styles["switcher-container"]} bg-gray-200 dark:bg-app-background`}
      >
        <input
          checked={theme === "dark"}
          name="switcher"
          type="checkbox"
          readOnly
          className={styles["switcher-checkbox"]}
        />

        <div className={styles["switcher-trigger"]} />
      </label>
    </>
  );
}
