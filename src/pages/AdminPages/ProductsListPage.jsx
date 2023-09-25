import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function AddProductPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    'product-image': null,
  });

  const [products, setProducts] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

 
  const [filterCategory, setFilterCategory] = useState('todas');

  function productsFiltered(){
    let response = products

    if(filterCategory !== "todas"){
      response = response.filter(prod => prod.categoria === filterCategory)
    }

    return response
  }

   

  const clearForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      categoria: '',
      'product-image': null,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const backendUrl = 'http://localhost:5005';

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        formDataToSend.append(key, formData[key]);
      }
    }

    axios
      .post(`${backendUrl}/api/products/create`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log('Product created:', response.data);
        axiosProducts();
        clearForm();
        setSuccessMessage('Producto creado correctamente');
        setErrorMessage('');
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      })
      .catch((error) => {
        console.error('Error creating product:', error);
        setSuccessMessage('');
        setErrorMessage('Error al crear el producto');
      });
  };

  const axiosProducts = () => {
    const backendUrl = 'http://localhost:5005';

    axios
      .get(`${backendUrl}/api/products`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleDeleteProduct = (productId) => {
    const backendUrl = 'http://localhost:5005';

    axios
      .delete(`${backendUrl}/api/products/${productId}`)
      .then((response) => {
        console.log('Producto eliminado:', response.data);
        axiosProducts();
        setSuccessMessage('Se ha borrado el producto exitosamente');
        setErrorMessage('');
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      })
      .catch((error) => {
        console.error('Error al eliminar el producto:', error);
        setSuccessMessage('');
        setErrorMessage('Error al borrar el producto');
      });
  };

  useEffect(() => {
    axiosProducts();
  }, []);


  return (
    <div>
    
    <div className="message-container">
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        
      </div>

      <Container> 

        <div className='listaProductos'>
          <h2>Lista de Productos</h2>
        </div>

        <Row>
        <Col lg={3}>

        Select Category

          <ul class="list-group">
            <li class={`list-group-item ${filterCategory === 'todas' ? 'active':''}` } onClick={()=>setFilterCategory("todas")}>Todas</li>
            <li class={`list-group-item ${filterCategory === 'ramos' ? 'active':''}` } onClick={()=>setFilterCategory("ramos")}>Ramos</li>
            <li class={`list-group-item ${filterCategory === 'planta' ? 'active':''}` } onClick={()=>setFilterCategory("planta")}>Plantas</li> 
          </ul>
          
          <div class="d-grid gap-2 m-3">
            <Link to={"/admin/add-product"}>
              <a class="btn btn-success" href="#" role="button">Crear Producto</a>
            </Link>
            <Link to={"/admin/orders"}> 
               <a class="btn btn-info" href="#" role="button">Ver ordenes</a>
            </Link>
              
        </div>

        </Col>
        <Col lg={9}>
        <Row>
          {productsFiltered().map((product) => (
            <Col key={product._id} xs={12} sm={4} md={4} lg={4}>
              <Card>
                <Card.Img
                  variant="top"
                  src={product.imagen}
                  alt={product.nombre}
                  style={{ maxWidth: '100%', height: 'auto', objectFit: 'cover' }}
                />
                <Card.Body className='card'>
                  <Card.Title>{product.nombre}</Card.Title>
                  <Card.Text className='cardText'>{product.descripcion}</Card.Text>
                  <Card.Text>Precio: {product.precio}</Card.Text>
                  <Card.Text>Categoría: {product.categoria}</Card.Text>
                  <Link to={`/admin/products/${product._id}`} className="mr-3 btn-info text-light btn">
                    Detalles
                  </Link>
                  <button
                    className="btn btn-danger mr-3"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    Borrar
                  </button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        </Col>
        </Row>

       
      </Container>
    </div>
  );
}

export default AddProductPage;
