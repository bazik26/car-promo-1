import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, CarFile, getFileUrl } from '@/lib/api';
import styles from '@/styles/FullscreenGallery.module.css';

interface FullscreenGalleryProps {
  car: Car;
  onClose: () => void;
}

export default function FullscreenGallery({ car, onClose }: FullscreenGalleryProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showContact, setShowContact] = useState(false);

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 30;
    const velocity = Math.abs(info.velocity.x);
    const effectiveThreshold = velocity > 500 ? 20 : threshold;
    
    if (info.offset.x > effectiveThreshold && currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    } else if (info.offset.x < -effectiveThreshold && currentPhotoIndex < car.files.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const goToPhoto = (index: number) => {
    setCurrentPhotoIndex(index);
  };

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.carInfo}>
          <div className={styles.carName}>{car.brand} {car.model}</div>
          <div className={styles.photoCount}>{currentPhotoIndex + 1} / {car.files.length}</div>
        </div>
        <button onClick={onClose} className={styles.closeButton}>✕</button>
      </div>

      {/* Photo Container */}
      <div className={styles.photoContainer} onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhotoIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            className={styles.photo}
          >
            <img 
              src={getFileUrl(car.files[currentPhotoIndex])} 
              alt={`${car.brand} ${car.model} - фото ${currentPhotoIndex + 1}`}
              className={styles.photoImage}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {currentPhotoIndex > 0 && (
          <button
            className={`${styles.navArrow} ${styles.navLeft}`}
            onClick={() => goToPhoto(currentPhotoIndex - 1)}
          >
            ‹
          </button>
        )}
        {currentPhotoIndex < car.files.length - 1 && (
          <button
            className={`${styles.navArrow} ${styles.navRight}`}
            onClick={() => goToPhoto(currentPhotoIndex + 1)}
          >
            ›
          </button>
        )}
      </div>

      {/* Progress Indicators */}
      <div className={styles.indicators}>
        {car.files.map((_, index) => (
          <div
            key={index}
            className={`${styles.indicator} ${index === currentPhotoIndex ? styles.indicatorActive : ''} ${index < currentPhotoIndex ? styles.indicatorViewed : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              goToPhoto(index);
            }}
          />
        ))}
      </div>

      {/* Swipe Hint */}
      <div className={styles.swipeHint}>Свайпайте для просмотра фото</div>

      {/* Contact Button */}
      <div className={styles.footer}>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setShowContact(!showContact);
          }}
          className={styles.contactButton}
        >
          {showContact ? '✕ Закрыть' : '📞 Связаться по этому авто'}
        </button>

        {showContact && (
          <motion.div 
            className={styles.contactForm}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.contactOptions}>
              <a 
                href={`tel:+79991234567`}
                className={styles.contactOption}
              >
                <div className={styles.contactIcon}>📞</div>
                <div className={styles.contactText}>Позвонить</div>
              </a>

              <a 
                href={`https://wa.me/79991234567?text=Здравствуйте! Интересует ${car.brand} ${car.model} ${car.year} за ${new Intl.NumberFormat('ru-RU').format(car.price)} ₽`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactOption}
              >
                <div className={styles.contactIcon}>💬</div>
                <div className={styles.contactText}>WhatsApp</div>
              </a>

              <a 
                href={`https://t.me/+79991234567`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactOption}
              >
                <div className={styles.contactIcon}>✈️</div>
                <div className={styles.contactText}>Telegram</div>
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

