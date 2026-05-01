import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { backendUrl, currnecy } from '../App'
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function List() {
  const [list ,setList]=useState([])
  const handlefetch = async()=>{
try {
  const {data}= await axios.get(backendUrl + "/api/product/list" )
  setList(data.products)
  console.log(data.products)

} catch (error) {
  toast.error(error)
}
  }
  const handleDelete=async(id)=>{
   
    try {
         const token = localStorage.getItem("token");
      const {data} = await axios.post(backendUrl + "/api/product/remove",{id},{headers:{token}})
      console.log(data)
      toast.success("Product has deleted success fully")
      await handlefetch();
      
    } catch (error) {
      toast.error(error)
    }
  }
  useEffect(()=>{
    handlefetch()
  },[])
  return (
    <>
    <p className='mb-2'>All Products</p>
    <div className='flex flex-col gap-2 '>
      <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] iten-center py-1 px-2 bg-gray-100 text-sm '> 
        <b>Image</b>
        <b>Name</b>
        <b>Category</b>
        <b>Price</b>
        <b  className='text-center'>Action</b>
      </div>

      {
        list.map((product)=>(
          <div className='grid grid-cols-[1fr_3fr_1fr_1fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 text-sm  ' key={product._id}>
            <img className='w-12' src={product.image[0]} alt="" />
            <p >{product.name}</p>
            <p >{product.category}</p>
            <p >{product.price}</p>
            <p onClick={()=>handleDelete(product._id)} className='text-right  md:text-center cursor-pointer text-lg ' >X</p>
          </div>
        ))
      }
    </div>
    </>
  )
}
