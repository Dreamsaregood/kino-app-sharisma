import styles from './Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footerBg}>
      <div className={styles.footerGrid}>
        <div className={styles.footerCol}>
          <span className={styles.footerTitle}>Регистрация и оплата</span>
          <span>Политика приватности</span>
          <span>Пользовательское соглашение</span>
        </div>
        <div className={styles.footerCol}>
          <span className={styles.footerTitle}>О нас</span>
          <span>Контакты</span>
          <span>Партнерам</span>
          <span>Акции</span>
        </div>
        <div className={styles.footerCol}>
          <span className={styles.footerTitle}>Подарить сертификат</span>
          <span>Служба поддержки</span>
          <span>Где смотреть</span>
          <span>Вопросы и ответы</span>
        </div>
        <div className={styles.footerCol}>
          <span className={styles.footerTitle}>SHARISMA на большом экране</span>
          <span>Samsung, LG, Sony, Philips, Haier, Panasonic, Xiaomi, Hisense, Google TV, TVIP, Rombica, HUAWEI</span>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <span>© 2025 SHARISMA. Все права защищены.</span>
        <div className={styles.footerIcons}>
          <span className={styles.footerIcon}>▶</span>
          <span className={styles.footerIcon}>⏺</span>
          <span className={styles.footerIcon}>✉</span>
          <span className={styles.footerIcon}>♫</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;