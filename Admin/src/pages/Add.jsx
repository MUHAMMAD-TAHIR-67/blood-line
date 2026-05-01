import React, { useState } from 'react'
import {assets} from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
export default function Add() {
   const [loading, setLoading] = useState(false);
  const [image1,setimage1]=useState(null)
  const [image2,setimage2]=useState(null)
  const [image3,setimage3]=useState(null)
  const [image4,setimage4]=useState(null)
  const [name,setName]=useState("")
  const [description,setDescription]=useState("")
  const [price,setPrice]=useState("")
  const [category,setCategory]=useState("Men")
  const [subCategory,setSubCategory]=useState("topwear")
  const [bestSeller,setBestseller]=useState(false)
  const [sizes,setSizes]=useState([])
  const onSubmit=async(e)=>{
    e.preventDefault()
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData()
        formData.append("name",name)
        formData.append("description",description)
        formData.append("price",price)
        formData.append("category",category)
        formData.append("subCategory",subCategory)
        formData.append("bestSeller",bestSeller)
        formData.append("sizes",JSON.stringify(sizes))
       image1 && formData.append("image1",image1)
       image2 &&   formData.append("image2",image2)
        image3 &&  formData.append("image3",image3)
        image4 &&  formData.append("image4",image4)
const { data } = await axios.post(backendUrl + "/api/product/add", formData, {
  headers: {
    token: token, 
  },
});
toast.success("Product Add successfully ")

 setLoading(false);
 setimage1(null);
setimage2(null);
setimage3(null);
setimage4(null);
setName("");
setDescription("");
setPrice("");
 
setBestseller(false);
setSizes([]);

console.log(data)
      
    } catch (error) {
      toast.error(error)
      console.log(error)
    }
  }
  return (
   <form onSubmit={onSubmit} className='flex flex-col w-full  gap-3' >
    <div className=''>
      <p className='mb-2'>Upload Image</p>
    
<div className="flex flex-row gap-2">
  {/* Image 1 */}
  <div className="flex gap-2">
    <label htmlFor="image1">
      <img
        className="w-20 h-20 object-cover border rounded"
        src={image1 instanceof File ? URL.createObjectURL(image1) : assets.upload_area}
        alt="Upload 1"
      />
      <input
        onChange={(e) => setimage1(e.target.files[0])}
        type="file"
        id="image1"
        required
        hidden
      />
    </label>
  </div>

  {/* Image 2 */}
  <div className="flex gap-2">
    <label htmlFor="image2">
      <img
        className="w-20 h-20 object-cover border rounded"
        src={image2 instanceof File ? URL.createObjectURL(image2) : assets.upload_area}
        alt="Upload 2"
      />
      <input
        onChange={(e) => setimage2(e.target.files[0])}
        type="file"
        id="image2"

        hidden
      />
    </label>
  </div>

  {/* Image 3 */}
  <div className="flex gap-2">
    <label htmlFor="image3">
      <img
        className="w-20 h-20 object-cover border rounded"
        src={image3 instanceof File ? URL.createObjectURL(image3) : assets.upload_area}
        alt="Upload 3"
      />
      <input
        onChange={(e) => setimage3(e.target.files[0])}
        type="file"
        id="image3"
        hidden
      />
    </label>
  </div>

  {/* Image 4 */}
  <div className="flex gap-2">
    <label htmlFor="image4">
      <img
        className="w-20 h-20 object-cover border rounded"
        src={image4 instanceof File ? URL.createObjectURL(image4) : assets.upload_area}
        alt="Upload 4"
      />
      <input
        onChange={(e) => setimage4(e.target.files[0])}
        type="file"
        id="image4"
        hidden
      />
    </label>
  </div>
</div>


    </div>
    <div className='w-full'>
      <p className='mb-2'>Product Name</p>
      <input onChange={e=>setName(e.target.value)}value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required />
    </div>
     <div className='w-full'>
      <p className='mb-2'>Product description</p>
      <textarea onChange={e=>setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Write Contant Here' required />
    </div>
    <div className='flex flex-col sm:flex-row gap-2  w-full sm:gap-8'>
      <div>
        <p className='mb-2'>Product Category</p>
        <select onChange={e=>setCategory(e.target.value)} className='w-full px-3 py-2' >
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Kids">Kids</option>
        </select>
      </div>
        <div>
        <p className='mb-2 '> Sub Category</p>
        <select onChange={e=>setSubCategory(e.target.value)} className='w-full px-3 py-2' >
          <option value="topwear">Topwear</option>
          <option value="bottomwear">Bottomwear</option>
          <option value="winterwear">Winterwear</option>
        </select>
      </div>
      <div>
        <p className='mb-2'>Product Price</p>
        <input onChange={e=>setPrice(e.target.value)} value={price} className='px-3 py-2 w-full sm:w-[120px]' type="number" placeholder='25' />
      </div>
    </div>
    <div>
      <p onch className='mb-2'>Product Sizes</p>
      <div className='flex gap-3'>
        <div className='flex gap-3'>
  <div onClick={() => setSizes(prev => prev.includes("S") ? prev.filter(s => s !== "S") : [...prev, "S"])}>
    <p className={`${sizes.includes("S") ? "bg-pink-100" : "bg-slate-300"} px-3 py-1 cursor-pointer rounded`}>S</p>
  </div>
  <div onClick={() => setSizes(prev => prev.includes("M") ? prev.filter(s => s !== "M") : [...prev, "M"])}>
    <p className={`${sizes.includes("M") ? "bg-pink-100" : "bg-slate-300"} px-3 py-1 cursor-pointer rounded`}>M</p>
  </div>
  <div onClick={() => setSizes(prev => prev.includes("L") ? prev.filter(s => s !== "L") : [...prev, "L"])}>
    <p className={`${sizes.includes("L") ? "bg-pink-100" : "bg-slate-300"} px-3 py-1 cursor-pointer rounded`}>L</p>
  </div>
  <div onClick={() => setSizes(prev => prev.includes("XL") ? prev.filter(s => s !== "XL") : [...prev, "XL"])}>
    <p className={`${sizes.includes("XL") ? "bg-pink-100" : "bg-slate-300"} px-3 py-1 cursor-pointer rounded`}>XL</p>
  </div>
  <div onClick={() => setSizes(prev => prev.includes("XXL") ? prev.filter(s => s !== "XXL") : [...prev, "XXL"])}>
    <p className={`${sizes.includes("XXL") ? "bg-pink-100" : "bg-slate-300"} px-3 py-1 cursor-pointer rounded`}>XXL</p>
  </div>
</div>

      </div>
    </div>
    <div className='flex gap-2 mt-2 '>
      <input onChange={()=>setBestseller(prev=>!prev)} checked={bestSeller} type="checkbox" id='brstSeller' />
      <label className='cursor-pointer' htmlFor="bestSeller">Add to Best Seller</label>
    </div>
    <button  type='submit'  className={`px-4 w-28 py-2 rounded text-white ${
        loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:cursor-pointer"
      }`}> Add</button>
   </form>
  )
}
