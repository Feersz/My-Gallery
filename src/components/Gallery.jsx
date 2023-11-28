// src/components/Gallery.jsx

import { useEffect, useState } from 'react';
import { TextField, Container, Grid, Card, CircularProgress } from '@mui/material';
import '../App.css';

function Gallery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para cargar imágenes por defecto
  const fetchDefaultPictures = async () => {
    try {
      const REACT_APP_API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;

      const response = await fetch(
        `https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=${REACT_APP_API_KEY}&per_page=10&page=1&format=json&nojsoncallback=1`
      );

      const data = await response.json();

      if (data.photos && data.photos.photo) {
        let picArray = data.photos.photo.map((pic) => {
          const srcPath = `https://farm${pic.farm}.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}.jpg`;
          return <img key={pic.id} alt="dogs" src={srcPath} />;
        });

        setPictures(picArray);
      } else {
        console.error('Error fetching pictures: Photos not found in the response');
      }
    } catch (error) {
      console.error('Error fetching pictures:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Llama a la función de carga inicial al montar el componente
    fetchDefaultPictures();
  }, []);

  useEffect(() => {
    // Función para cargar imágenes basadas en la búsqueda actual
    const fetchPictures = async () => {
      try {
        const REACT_APP_API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;

        const response = await fetch(
          `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${REACT_APP_API_KEY}&text=${searchTerm}&per_page=10&page=1&format=json&nojsoncallback=1`
        );

        const data = await response.json();

        if (data.photos && data.photos.photo) {
          let picArray = data.photos.photo.map((pic) => {
            const srcPath = `https://farm${pic.farm}.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}.jpg`;
            return <img key={pic.id} alt="dogs" src={srcPath} />;
          });

          setPictures(picArray);
        } else {
          console.error('Error fetching pictures: Photos not found in the response');
        }
      } catch (error) {
        console.error('Error fetching pictures:', error);
      } finally {
        setLoading(false);
      }
    };

    // Llama a la función de búsqueda al cambiar el término de búsqueda
    fetchPictures();
  }, [searchTerm]);

  return (
    <Container>
      <div className="SearchBar">
        <TextField
          label="Search for images..."
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <br />
      <Grid container spacing={3}>
        {loading ? (
          <Grid item xs={12} textAlign="center">
            <CircularProgress />
          </Grid>
        ) : (
          pictures.map((pic, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
              <Card>
                <img src={pic.props.src} alt={pic.props.alt} style={{ maxWidth: '100%', height: 'auto' }} />
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
}

export default Gallery;
