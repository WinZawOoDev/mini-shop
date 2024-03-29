import React from 'react'
import { useImmer } from 'use-immer';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectProductFromCart, selectIsCartEmpty } from '../../app/cartSlice'
import CartTable from './CartTable';
import OrderSummary from './OrderSummary';


const mayLikeItem = [
  { id: 1, price: 5000, desc: "Men Flip Flops (leather)", img: "/may_like_itm/baby_clothes.png" },
  { id: 2, price: 7000, desc: "2-8-year-old Girls' shorts wear summer style children's clothes", img: "/may_like_itm/girl_pant.png" },
  { id: 3, price: 15000, desc: "Baby 3pk Zip-Up Sleep N' Play - Cloud Island™ Black/White", img: "/may_like_itm/slipper.png" },
  { id: 4, price: 3000, desc: "Women Winter Hat Thermal Windproof Hat Ribbed Knit Chunky Lined Beanie Hats", img: "/may_like_itm/winter_hat.png" }
];

export default function CartView() {

  const { items } = useSelector(selectProductFromCart);
  const isCartEmpty = useSelector(selectIsCartEmpty);

  const [tData, setTData] = useImmer([]);


  const findArrObjIndex = ({ id, name }, arr) => arr.findIndex(list => (list.id === id) && (list.name === name));

  const isStockOut = ({ id, name }) => {
    const index = findArrObjIndex({ id, name }, tData);
    return index !== -1 && tData[index].productDetail.stock === 0;
  }


  const navigate = useNavigate();

  if (isCartEmpty) navigate("empty-cart");


  return (
    <div className='container mx-auto'>

      <div className='grid grid-cols-6 gap-x-2'>
        <div className='col-span-4'>
          <CartTable isStockOut={isStockOut} />
        </div>
        <div className='col-span-2 bg-white rounded px-5'>
          <OrderSummary checkout={{ diable: false, to: "deli-info" }} />
        </div>
      </div>
      <div className='mt-2 text-center pt-3'>
        <span className='text-xl text-gray-700'>You may also like</span>
        <div className='grid grid-cols-4 gap-x-2 p-5 mt-3 bg-white rounded'>
          {
            mayLikeItem.map(d =>
              <div key={d.id} className='bg-gray-100 rounded p-5'>
                <div className='flex justify-between items-center mt-3 mb-5'>
                  <p className='text-sm text-gray-700 truncate'>{d.desc}</p>
                  <span className='bg-red-200 rounded-md px-5 ml-2 text-gray-800 fond-medium'>{d.price.toLocaleString('en-US')}</span>
                </div>
                <img className='h-[15em] mx-auto cursor-pointer' src={require(`../../images${d.img}`)} />
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
