import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CarFile } from '@/lib/api';
import styles from '@/styles/PhotoGallery.module.css';

interface PhotoGalleryProps {
  photos: CarFile[];
  getFileUrl: (file: CarFile) => string;
}

export default function PhotoGallery({ photos, getFileUrl }: PhotoGalleryProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [dragDirection, setDragDirection] = useState(0);

  if (!photos || photos.length === 0) {
    return (
      <div className={styles.noPhotos}>
        <div className={styles.noPhotosIcon}>📷</div>
        <div className={styles.noPhotosText}>Фото скоро появятся</div>
      </div>
    );
  }

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 30; // Снизил порог для более легкого свайпа
    const velocity = Math.abs(info.velocity.x);
    
    // Если быстрый свайп - достаточно меньшего расстояния
    const effectiveThreshold = velocity > 500 ? 20 : threshold;
    
    if (info.offset.x > effectiveThreshold && currentPhotoIndex > 0) {
      // Swipe right - предыдущее фото
      setCurrentPhotoIndex(currentPhotoIndex - 1);
      setDragDirection(-1);
    } else if (info.offset.x < -effectiveThreshold && currentPhotoIndex < photos.length - 1) {
      // Swipe left - следующее фото
      setCurrentPhotoIndex(currentPhotoIndex + 1);
      setDragDirection(1);
    }
  };

  const goToPhoto = (index: number) => {
    setDragDirection(index > currentPhotoIndex ? 1 : -1);
    setCurrentPhotoIndex(index);
  };

  return (
    <div className={styles.gallery}>
      <div className={styles.photoContainer}>
        <AnimatePresence mode="wait" custom={dragDirection}>
          <motion.div
            key={currentPhotoIndex}
            custom={dragDirection}
            initial={{ opacity: 0, x: dragDirection > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dragDirection > 0 ? -100 : 100 }}
            transition={{ 
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            className={styles.photo}
            style={{
              backgroundImage: `url(${getFileUrl(photos[currentPhotoIndex])})`
            }}
          >
            {/* Индикатор свайпа */}
            {photos.length > 1 && (
              <div className={styles.swipeHint}>← Свайпните →</div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Навигационные стрелки */}
        {currentPhotoIndex > 0 && (
          <button
            className={`${styles.navArrow} ${styles.navArrowLeft}`}
            onClick={() => goToPhoto(currentPhotoIndex - 1)}
          >
            ‹
          </button>
        )}
        {currentPhotoIndex < photos.length - 1 && (
          <button
            className={`${styles.navArrow} ${styles.navArrowRight}`}
            onClick={() => goToPhoto(currentPhotoIndex + 1)}
          >
            ›
          </button>
        )}
      </div>

      {/* Точки индикатора */}
      {photos.length > 1 && (
        <div className={styles.photoIndicators}>
          {photos.map((_, index) => (
            <div
              key={index}
              className={`${styles.photoDot} ${index === currentPhotoIndex ? styles.photoDotActive : ''}`}
              onClick={() => goToPhoto(index)}
            />
          ))}
        </div>
      )}

      {/* Счетчик фото */}
      <div className={styles.photoCounter}>
        {currentPhotoIndex + 1} / {photos.length}
      </div>
    </div>
  );
}

