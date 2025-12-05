import React, { useState, useEffect } from 'react';
import { Skeleton, Box } from '@mui/material';
import Bucket from '../../services/Bucket';

const BlogImage = ({ path, alt, height, sx = {}, ...props }) => {
  const [src, setSrc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      if (!path) {
        setSrc('https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?auto=format&fit=crop&w=800');
        setLoading(false);
        return;
      }
      if (path.startsWith('http')) {
        setSrc(path);
        setLoading(false);
        return;
      }

      try {
        const url = await Bucket.load(path, 'images'); 
        if (isMounted) setSrc(url);
      } catch (error) {
        console.error("Erro ao carregar imagem:", error);
        if (isMounted) setSrc('https://source.unsplash.com/random/800x600/?beer');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadImage();

    return () => { isMounted = false; };
  }, [path]);

  if (loading) {
    return (
      <Skeleton 
        variant="rectangular" 
        width="100%" 
        height={height || '100%'} 
        sx={{ bgcolor: 'rgba(255,255,255,0.1)', ...sx }} 
      />
    );
  }

  if (props.component === 'img') {
    return (
      <Box
        component="img"
        src={src}
        alt={alt}
        height={height}
        sx={{ objectFit: 'cover', width: '100%', ...sx }}
        {...props}
      />
    );
  }

  return (
    <Box
      sx={{
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: height || '100%',
        width: '100%',
        ...sx
      }}
      {...props}
    />
  );
};

export default BlogImage;