import React, { useState, useEffect, useRef } from 'react';
import * as nsfwjs from 'nsfwjs';

const ImageWithBlur = ({ content }) => {
  const [isSensitive, setIsSensitive] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const imageRef = useRef(null);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  useEffect(() => {
    const detectSensitiveContent = async () => {
      try {
        const model = await nsfwjs.load();
        if (imageRef.current) {
          const predictions = await model.classify(imageRef.current);
          const nsfwPrediction = predictions.find((pred) => pred.className !== 'Neutral');
          const isNSFW = nsfwPrediction && nsfwPrediction.probability > 0.7;
          setIsSensitive(isNSFW);
        }
      } catch (error) {
        console.error('Error detecting NSFW content:', error);
      }
    };

    if (isImageLoaded) {
      detectSensitiveContent();
    }
  }, [isImageLoaded]);

  return (
    <div>
      <img
        ref={imageRef}
        src={content}
        alt="uploaded"
        className={`max-w-[300px] mt-4 h-auto rounded-md object-cover ${
          isSensitive ? 'filter blur-md' : ''
        }`}
        crossOrigin="Anonymous"
        onLoad={handleImageLoad}
      />
      {isSensitive && (
        <p className="text-red-500 mt-2">This content has been flagged as sensitive.</p>
      )}
    </div>
  );
};

export default ImageWithBlur;