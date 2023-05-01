import { AnimatePresence, motion } from "framer-motion";

import styles from "./infoPanel.module.scss";

export const InfoPanel = ({ visible }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div className={styles.infoPanel}>
          <h2>What is this?</h2>
          <p>
            Just a site where you can view some of David Imel&apos;s videos on
            Youtube!
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
