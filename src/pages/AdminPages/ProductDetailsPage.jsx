import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

function ProductDetailsPage() {
  const { id } = useParams();

  const [product, setProduct] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);

  useEffect(() => {
    const backendUrl = 'http://localhost:5005';

    axios
      .get(`${backendUrl}/api/products/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [id]);

  const handleEditClick = () => {
    setIsEditing(true);
    setIsEditingImage(false);
  };

  const handleSaveClick = () => {
    const updatedProduct = {
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      categoria: product.categoria,
      imagen: product.imagen,
    };

    const backendUrl = 'http://localhost:5005';

    axios
      .put(`${backendUrl}/api/products/${id}`, updatedProduct)
      .then((response) => {
        const updatedProductData = response.data;
        setProduct(updatedProductData);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error('Error al guardar los cambios:', error);
      });
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setIsEditingImage(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('new-product-image', file);

      const backendUrl = 'http://localhost:5005';

      axios
        .put(`${backendUrl}/api/products/${id}/update-image`, formData)
        .then((response) => {
          const updatedImageUrl = response.data.imagen;
          setProduct({ ...product, imagen: updatedImageUrl });
          setIsEditingImage(false);
        })
        .catch((error) => {
          console.error('Error al cambiar la imagen:', error);
        });
    }
  };

  const handleEditImageClick = () => {
    setIsEditingImage(true);
    setIsEditing(false);
  };

  const handleImageSaveClick = () => {
    setIsEditingImage(false);
  };

  const handleCancelImageClick = () => {
    setIsEditingImage(false);
  };

  return (
    <Container className="contenedorEditor d-flex align-items-center justify-content-center vh-100">
      <Card>
        <Card.Img
          variant="top"
          src={product.imagen}
          alt={product.nombre}
          style={{ width: '400px', height: '400px', objectFit: 'cover' }}
        />
        <Card.Body>
          <Card.Title>
            {isEditing ? (
              <input
                type="text"
                value={product.nombre}
                onChange={(e) => setProduct({ ...product, nombre: e.target.value })}
              />
            ) : (
              product.nombre
            )}
          </Card.Title>
          <Card.Text>
            {isEditing ? (
              <textarea
                value={product.descripcion}
                onChange={(e) => setProduct({ ...product, descripcion: e.target.value })}
              />
            ) : (
              product.descripcion
            )}
          </Card.Text>
          <Card.Text>
            Precio:{' '}
            {isEditing ? (
              <input
                type="number"
                value={product.precio}
                onChange={(e) => setProduct({ ...product, precio: e.target.value })}
              />
            ) : (
              product.precio
            )}
          </Card.Text>
          <Card.Text>Categoría: {product.categoria}</Card.Text>
          {isEditing ? (
            <div>
              <Button className="btn-info text-light mr-3 mb-3" onClick={handleSaveClick}>
                Guardar Cambios
              </Button>
              <Button variant="danger" className=" mb-3" onClick={handleCancelClick}>
                Cancelar
              </Button>
            </div>
          ) : (
            <div>
              {!isEditingImage ? (
                <div>
                <Button  className="btn-info text-light mr-3 mb-3" onClick={handleEditClick}>
                  Editar
                </Button>

                <Button  className=" btn-info text-light mb-3" onClick={handleEditImageClick}>
                    Cambiar Imagen
                  </Button>

                  </div>
              ) : (
                <div className="d-flex">
                  <Button  className="btn-info text-light mb-3" onClick={handleImageSaveClick}>
                    Guardar Nueva Imagen
                  </Button>
                  <Button variant="danger" className="ml-3 mb-3" onClick={handleCancelImageClick}>
                    Cancelar
                  </Button>
                </div>
              )}
              {!isEditingImage && (
                <div>
                  <Link to={`/admin/product`} className="mb-3 btn btn-danger">
                  Volver
                  </Link>
                </div>
              )}
            </div>
          )}
          {isEditingImage && (
            <div className='custom-input-file col-md-6 col-sm-6 col-xs-6'>
              <input type="file" accept="image/*" className="input-file" onChange={handleImageChange} />
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ProductDetailsPage;
