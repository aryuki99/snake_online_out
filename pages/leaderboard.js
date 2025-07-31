import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Leaderboard.module.css';
import { getCookie } from '../utils/cookies';

export default function Leaderboard() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从Cookie中获取游戏记录
    const loadRecords = () => {
      try {
        const recordsStr = getCookie('snakeGameRecords');
        if (recordsStr) {
          const parsedRecords = JSON.parse(recordsStr);
          // 按分数降序排序
          parsedRecords.sort((a, b) => b.score - a.score);
          setRecords(parsedRecords);
        }
      } catch (error) {
        console.error('加载游戏记录失败:', error);
      } finally {
        setLoading(false);
      }
    };

    // 在客户端渲染时加载记录
    if (typeof window !== 'undefined') {
      loadRecords();
    }
  }, []);

  // 格式化时间显示
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 格式化日期显示
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>贪吃蛇游戏 - 排行榜</title>
        <meta name="description" content="贪吃蛇游戏排行榜" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>排行榜</h1>

        <Link href="/" className={styles.backLink}>
          ← 返回游戏
        </Link>

        <div className={styles.leaderboard}>
          {loading ? (
            <div className={styles.loading}>加载中...</div>
          ) : records.length === 0 ? (
            <div className={styles.noRecords}>暂无游戏记录</div>
          ) : (
            <>
              <div className={styles.tableHeader}>
                <div className={styles.rank}>排名</div>
                <div className={styles.score}>分数</div>
                <div className={styles.time}>游戏时间</div>
                <div className={styles.date}>日期</div>
              </div>
              {records.map((record, index) => (
                <div key={index} className={styles.scoreItem}>
                  <div className={styles.rank}>{index + 1}</div>
                  <div className={styles.score}>{record.score}</div>
                  <div className={styles.time}>{formatTime(record.time)}</div>
                  <div className={styles.date}>{formatDate(record.date)}</div>
                </div>
              ))}
            </>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>贪吃蛇游戏 - 排行榜</p>
      </footer>
    </div>
  );
}