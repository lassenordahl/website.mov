import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import zipPng from "../../public/ZIP.png";
import { Button } from "../components/button";
import styles from "./index.module.scss";
import { downloadFile, listFiles } from "./api/s3";
import { S3 } from "aws-sdk";

interface HomeProps {
  s3Files: S3.Types.ObjectList;
}

const listVariants = {
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
      height: { when: "beforeChildren" },
    },
  },
  hidden: {
    opacity: 0,
    height: 120,
  },
};

const listItemVariants = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: 12 },
};

export default function Home(props: HomeProps) {
  const [extended, setExtended] = useState(false);

  const mostRecentZip = props.s3Files[0];

  return (
    <>
      <Head>
        <title>download.zip</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.header}>
            <h4>A nice collection of David&apos;s things</h4>
            {extended && <h5 className={styles.titleTag}>extended</h5>}
          </div>
          <AnimatePresence>
            {!extended && (
              <motion.a
                className={styles.link}
                href="cool.zip"
                target="_blank"
                rel="noopener noreferrer"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={listItemVariants}
              >
                <Image
                  src={zipPng}
                  height={50}
                  width={50}
                  alt={"Zip File Picture"}
                />
                <p>{mostRecentZip.Key}</p>
                <span>
                  last updated {mostRecentZip.LastModified?.toString()}
                </span>
              </motion.a>
            )}
            {extended && (
              <motion.ul
                className={styles.list}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={listVariants}
              >
                {props.s3Files.map((zipItem) => {
                  return (
                    <motion.a
                      key={zipItem.Key}
                      className={styles.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => downloadFile(zipItem.Key!)}
                      variants={listItemVariants}
                    >
                      <li className={styles.item}>
                        <Image
                          src={zipPng}
                          height={50}
                          width={50}
                          alt={"Zip File Picture"}
                        />
                        <div>
                          <p>{zipItem.Key}</p>
                          <span>{zipItem.LastModified?.toString()}</span>
                        </div>
                      </li>
                    </motion.a>
                  );
                })}
              </motion.ul>
            )}
          </AnimatePresence>
          <Button onClick={() => setExtended(!extended)}>
            see {!extended ? "more" : "less"}
          </Button>
        </div>
        <span className={styles.signature}>
          Made with ❤️ by{" "}
          <a href="https://davidimel.com" target="_blank">
            David Imel
          </a>
        </span>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  const data = await listFiles();
  console.log("DATA:", data.Contents);

  return {
    props: { s3Files: JSON.parse(JSON.stringify(data.Contents)) },
  };
}
