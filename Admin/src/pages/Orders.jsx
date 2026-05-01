import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currnecy } from '../App';
import { assets } from '../assets/assets';
// import { products } from '../../../../frontend/src/assets/assets';

export default function Orders() {
  const [orders, setOrders] = useState([]);
const status =async(e,orderId)=>{
   const token = localStorage.getItem("token");
  e.preventDefault()
  try {

    const {data}= await axios.post(backendUrl +"/api/order/update",{orderId,status:e.target.value},{headers:{token}})
    if(data.success){
      await fetchOrders();
    }
  } catch (error) {
    console.log(error)
  }

}
  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const { data } = await axios.post(
        backendUrl + "/api/order/all",
        {},
        { headers: { token } }
      );
      if (data.success) {
        console.log(data);
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Fetch orders error:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);
const handlePrint = (order) => {
  if (!order || !order.products) {
    console.error("Order or order.products is undefined");
    return;
  }

  const newWindow = window.open('', '_blank');
  if (!newWindow) {
    alert("Popup blocked! Please allow popups for this site.");
    return;
  }

 

  newWindow.document.write(`
    <html>
      <head>
        <title>Order Invoice #${order.orderNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { text-align: center;  }
             .header img { max-height: 60px; }
          .invoice-title { font-size: 24px; font-weight: bold; color: #2c3e50; }
          .invoice-info { text-align: right; }
          .company-info { margin-bottom: 30px; }
          .section-title { font-weight: bold; font-size: 16px; margin: 20px 0 10px; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 5px; }
          .address-box { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .address { background: #f9f9f9; padding: 15px; border-radius: 5px; width: 48%; }
          .table-container { margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; }
          th { background: #f5f5f5; text-align: left; padding: 10px; border-bottom: 2px solid #ddd; }
          td { padding: 10px; border-bottom: 1px solid #eee; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .total-box { background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 10px; }
          .status-badge { 
            display: inline-block; 
            padding: 5px 10px; 
            border-radius: 20px; 
            font-weight: bold; 
            font-size: 12px;
            background: ${order.status === 'Deliver' ? '#4CAF50' : '#2196F3'};
            color: white;
          }
        </style>
      </head>
      <body>
        <div class="header">
            <img src="${assets.logo}" alt="Company Logo">
         
          </div>
      
        <div class="address-box">
          <div class="address">
            <div class="section-title">SHIP TO</div>
            <div><strong>${order.address.firstName} ${order.address.lastName}</strong></div>
            <div>${order.address.street}</div>
            <div>${order.address.city}, ${order.address.state}</div>
            <div>${order.address.country}, ${order.address.zipcode}</div>
            <div>Phone: ${order.address.phone}</div>
          </div>
          <div class="address">
            <div class="section-title">SHIPPING INFO</div>
            <div><strong>Payment Method:</strong> ${order.paymentMethod}</div>
            <div><strong>Payment Status:</strong> ${order.payment ? "Paid" : "Pending"}</div>
             <div><strong>order no #:</strong> ${order.orderNumber}</div>
            <div><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</div>
            <div><strong>Amount:</strong> ${currnecy}${ order.amount}</div>
          </div>
        </div>

    
       

        <div class="footer">
        
          <div style="margin-top: 10px;">Website developed by MUHAMMAD TAHIR</div>
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 1000);
          }
        </script>
      </body>
    </html>
  `);

  newWindow.document.close();
};

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Orders</h2>
      <div>
        {
          orders.map((order, index) => (
            <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 item-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700  ' key={index}>
              <img className='w-12' src={assets.parcel_icon} alt="" />
              <div>

              <div>
                {order.products.map((product, pIndex) => {
                  if (pIndex === order.products.length - 1) {
                    return (
                      <p className='py-0.5  font-bold' key={pIndex}>
                        {product.name} x {product.quantity} <span>{product.size}</span>
                      </p>
                    );
                  }else{return <p className='py-0.5  font-bold' key={pIndex}>
                        {product.name} - Quantity:{product.quantity} - Size:<span>{product.size},</span>
                      </p>}
                
              })}
              </div>
              <b className='mt-3 mb-3 font-medium'>{order.address.firstName+" "+order.address.lastName}</b>
              <div>
                <p>{order.address.street+","}</p>
                <p>{order.address.city+"," +order.address.state+","+order.address.country+","+order.address.zipcode+","}</p>
              </div>
              <p>{order.address.phone}</p>
            </div>
            <div>
              <p className='text-sm sm:text-[15px]'>items :{order.products.length}</p>
              <p className='mt-3'>paymentMethod:{order.paymentMethod}</p>
              <p>payment:{order.payment?"done":"pending"}</p>
              <p>Date :{new Date(order.date).toDateString()}</p>
              <p>Order No : <span className='font-bold'>{order.orderNumber}</span></p>
              
              <p className='text-sm  sm:text-[15px]'>Amount : <span className='font-bold'>{currnecy}{order.amount}</span></p>
            </div>
            
            
               <button onClick={()=>{handlePrint(order)}} className=' px-3 rounded-md py-2 bg-gray-700 hover:cursor-pointer text-white h-10'>PRINT</button>
            <select onChange={(e) => status(e, order._id)} value={order.status} className='p-2 font-semibold h-10' >
              <option value="Order Place">Order Place</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out Of Delivery" >Out Of Delivery</option>
              <option value="Deliver">Order Deliver</option>
            </select>
         
              </div>
          ))
        }
      </div>
    </div>
  );
}
