import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

import Title from "../components/Title";
import Productitem from './Productitem';

export default function RelatedProduct({ catogory, subCatogory }) {
  const { products } = useContext(AuthContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productCopy = products.slice();
      productCopy = productCopy.filter(product => catogory === product.category);
      productCopy = productCopy.filter(product => subCatogory === product.subCategory);

      setRelated(productCopy.slice(0, 5));
    }
  }, [products, catogory, subCatogory]);

  return (
    <div className='my-24'>
      <div className='text-center text-3xl py-2'>
        <Title text1={'RELATED'} text2={'PRODUCTS'} />
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {
          related.map((product) => (
            <Productitem
              key={product._id}
              id={product._id}
              image={product.image}
              price={product.price}
              name={product.name}
            />
          ))
        }
      </div>
    </div>
  );
}
