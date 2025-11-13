import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import { getCars, getFileUrl, Car as ApiCar } from '@/lib/api';
import PhotoGallery from '@/components/PhotoGallery';
import styles from '@/styles/TikTok.module.css';

interface Stats {
  totalCars: number;
  remainingCars: number;
  soldCars: number;
  saleEndDate: Date;
}

export default function Home() {
  const [cars, setCars] = useState<ApiCar[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalCars: 0,
    remainingCars: 0,
    soldCars: 0,
    saleEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Загружаем машины из API
  useEffect(() => {
    const loadCars = async () => {
      setIsLoading(true);
      const fetchedCars = await getCars({ limit: 24, random: true });
      const availableCars = fetchedCars.filter(car => !car.isSold);
      setCars(availableCars);
      
      // Обновляем статистику
      setStats({
        totalCars: 67,
        remainingCars: availableCars.length,
        soldCars: 67 - availableCars.length,
        saleEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });
      
      setIsLoading(false);
    };

    loadCars();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = stats.saleEndDate.getTime() - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Scroll handler для TikTok-style навигации
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        const scrollTop = containerRef.current!.scrollTop;
        const windowHeight = window.innerHeight;
        const newIndex = Math.round(scrollTop / windowHeight);
        
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < cars.length) {
          setCurrentIndex(newIndex);
          containerRef.current!.scrollTo({
            top: newIndex * windowHeight,
            behavior: 'smooth'
          });
        }
      }, 100);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [currentIndex]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('ru-RU').format(mileage);
  };

  const calculateDiscount = (price: number) => {
    // Примерная скидка для промо (15-30%)
    const discountPercent = Math.floor(15 + Math.random() * 15);
    return {
      discount: discountPercent,
      oldPrice: Math.round(price / (1 - discountPercent / 100)),
      savings: Math.round(price / (1 - discountPercent / 100)) - price
    };
  };

  if (isLoading) {
    return (
      <div className={styles.app}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <div className={styles.loadingText}>Загружаем автомобили...</div>
        </div>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className={styles.app}>
        <div className={styles.loading}>
          <div className={styles.loadingText}>Нет доступных автомобилей</div>
        </div>
      </div>
    );
  }

  const scrollToNext = () => {
    if (currentIndex < cars.length - 1) {
      setCurrentIndex(currentIndex + 1);
      containerRef.current?.scrollTo({
        top: (currentIndex + 1) * window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  const scrollToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      containerRef.current?.scrollTo({
        top: (currentIndex - 1) * window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={styles.app}>
      {/* Фиксированный Header с акцией и таймером */}
      <motion.div 
        className={styles.header}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <div className={styles.badge}>РАСПРОДАЖА СКЛАДА</div>
            <div className={styles.stockInfo}>
              Осталось <span className={styles.highlight}>{stats.remainingCars}</span> из {stats.totalCars}
            </div>
          </div>
          <div className={styles.headerTimer}>
            <div className={styles.timerCompact}>
              <span className={styles.timerValue}>{timeLeft.days.toString().padStart(2, '0')}</span>:
              <span className={styles.timerValue}>{timeLeft.hours.toString().padStart(2, '0')}</span>:
              <span className={styles.timerValue}>{timeLeft.minutes.toString().padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Вертикальная лента карточек */}
      <div className={styles.scrollContainer} ref={containerRef}>
        {cars.map((car, index) => {
          const priceInfo = calculateDiscount(car.price);
          
          return (
          <div key={car.id} className={styles.slide}>
            {/* Галерея фотографий с свайпом */}
            <PhotoGallery photos={car.files} getFileUrl={getFileUrl} />
            
            {/* Градиентный оверлей */}
            <div className={styles.slideOverlay} />

            {/* Контент карточки */}
            <div className={styles.slideContent}>
              {/* Левая сторона - основная информация */}
              <div className={styles.mainInfo}>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: currentIndex === index ? 1 : 0, x: currentIndex === index ? 0 : -50 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className={styles.carTags}>
                    {car.promo && <span className={styles.tag}>ПРОМО</span>}
                    <span className={styles.tag}>{car.year} ГОД</span>
                    <span className={styles.tag}>{car.fuel.toUpperCase()}</span>
                  </div>
                  
                  <h2 className={styles.carBrand}>{car.brand}</h2>
                  <h1 className={styles.carModel}>{car.model}</h1>
                  
                  <div className={styles.priceBlock}>
                    <div className={styles.oldPrice}>
                      {formatPrice(priceInfo.oldPrice)} ₽
                    </div>
                    <div className={styles.newPrice}>
                      {formatPrice(car.price)} ₽
                    </div>
                    <div className={styles.saveAmount}>
                      Экономия {formatPrice(priceInfo.savings)} ₽
                    </div>
                  </div>

                  <a href="tel:+79991234567" className={styles.ctaButton}>
                    УЗНАТЬ ЦЕНУ ПОД КЛЮЧ
                  </a>
                </motion.div>
              </div>

              {/* Правая сторона - иконки характеристик (TikTok style) */}
              <div className={styles.sidePanel}>
                <motion.div
                  className={styles.feature}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: currentIndex === index ? 1 : 0, x: currentIndex === index ? 0 : 50 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className={styles.featureIcon}>📅</div>
                  <div className={styles.featureValue}>{car.year}</div>
                  <div className={styles.featureLabel}>год</div>
                </motion.div>

                <motion.div
                  className={styles.feature}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: currentIndex === index ? 1 : 0, x: currentIndex === index ? 0 : 50 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className={styles.featureIcon}>🛣️</div>
                  <div className={styles.featureValue}>{formatMileage(car.mileage)}</div>
                  <div className={styles.featureLabel}>км</div>
                </motion.div>

                <motion.div
                  className={styles.feature}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: currentIndex === index ? 1 : 0, x: currentIndex === index ? 0 : 50 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <div className={styles.featureIcon}>⚙️</div>
                  <div className={styles.featureValue}>{car.gearbox}</div>
                  <div className={styles.featureLabel}>КПП</div>
                </motion.div>

                <motion.div
                  className={styles.feature}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: currentIndex === index ? 1 : 0, x: currentIndex === index ? 0 : 50 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className={styles.featureIcon}>⛽</div>
                  <div className={styles.featureValue}>{car.engine}L</div>
                  <div className={styles.featureLabel}>{car.fuel}</div>
                </motion.div>

                <motion.div
                  className={styles.feature}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: currentIndex === index ? 1 : 0, x: currentIndex === index ? 0 : 50 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <div className={styles.featureIcon}>🏎️</div>
                  <div className={styles.featureValue}>{car.powerValue}</div>
                  <div className={styles.featureLabel}>л.с.</div>
                </motion.div>

                <motion.div
                  className={styles.feature}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: currentIndex === index ? 1 : 0, x: currentIndex === index ? 0 : 50 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <div className={styles.featureIcon}>-{priceInfo.discount}%</div>
                  <div className={styles.featureLabel}>скидка</div>
                </motion.div>
              </div>

              {/* Нижний индикатор прогресса */}
              <div className={styles.progressIndicator}>
                {cars.map((_, idx) => (
                  <div
                    key={idx}
                    className={`${styles.progressDot} ${idx === currentIndex ? styles.progressDotActive : ''}`}
                    onClick={() => {
                      setCurrentIndex(idx);
                      containerRef.current?.scrollTo({
                        top: idx * window.innerHeight,
                        behavior: 'smooth'
                      });
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Скидочный бейдж */}
            <div className={styles.discountBadge}>
              -{priceInfo.discount}%
            </div>
          </div>
        );
        })}
      </div>

      {/* Навигационные стрелки */}
      {currentIndex > 0 && (
        <button className={styles.navButton} style={{ top: '50%' }} onClick={scrollToPrev}>
          ↑
        </button>
      )}
      {currentIndex < cars.length - 1 && (
        <button className={styles.navButton} style={{ bottom: '100px' }} onClick={scrollToNext}>
          ↓
        </button>
      )}
    </div>
  );
}
