import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { BsListUl } from 'react-icons/bs';
import ProductCard from './ProductCard';
import { selectItems } from '../app/itemSlice';
import { useCategory } from '../hooks'
import { BsChevronLeft, BsChevronRight, BsArrowDownShort } from 'react-icons/bs'


const discount_items = [
    {
        id: 1,
        img_src: "discount_itm/dis_facial_form.png",
        normal_prc: "20000",
        dis_prc: "17000"
    },
    {
        id: 2,
        img_src: "discount_itm/dis_lipstick.png",
        normal_prc: "30000",
        dis_prc: "27000"
    },
    {
        id: 3,
        img_src: "discount_itm/dis_slim_bag.png",
        normal_prc: "60000",
        dis_prc: "57000"
    }
];


const clearance_items = [
    {
        id: 1,
        img_src: "clearance_sale/clr_pant.png",
        prc: "13000",
        dsc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
    },
    {
        id: 2,
        img_src: "clearance_sale/clr_clipper.png",
        prc: "20000",
        dsc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. "
    }
];

export default function Body() {

    const items = useSelector(selectItems);

    const { category, mapWithIcon } = useCategory();
    const categories = mapWithIcon(category);

    function topMostSection() {
        return (
            <div className='relative grid grid-cols-5 gap-1'>

                <CategoryList data={categories} />

                <DiscountSale items={discount_items} />

                <div className='bg-gradient-to-t from-[#57513100] to-[#c7724e] rounded my-2 shadow mx-2'>
                    <div className='h-40 text-center pt-3'>
                        <span className='text-white text-xl font-medium capitalize'>clearance sale</span>
                        <p className='capitalize mt-5 text-gray-700 font-light text-sm'>explore fast, for clearance sale promotion items</p>
                        <button className='float-right mt-4 text-sm mr-2 text-white'>explore more...</button>
                    </div>
                    {
                        clearance_items.map(item => (
                            <div key={item.id} className='h-48 m-2 flex justify-between items-center bg-white rounded'>
                                <div className='w-[50em]'>
                                    <img alt='sale item' src={require("../images/" + item.img_src)} />
                                </div>
                                <div className='text-center px-3 -ml-2'>
                                    <p className='text-xs font-light text-gray-700'>{item.dsc}</p>
                                    <button className='bg-gray-100 rounded px-1 py-1 mt-2'>
                                        <span className='text-sm text-gray-800'>{item.prc}</span>
                                        <span className='text-sm mx-2'>MMK</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

        )
    }

    function productCardSection() {

        let itmArr = [];
        for (let i = 1; i <= 10; i++)
            itmArr.push(items[0]);

        return (
            <>
                <div className='relative grid grid-cols-5 gap-1'>
                    {itmArr.map((itm, index) => <ProductCard key={index} product={itm} />)}
                </div>
                <div className='flex justify-center my-2 items-center'>
                    <button className='px-5 py-2 bg-gray-300 rounded-full flex justify-around items-center shadow hover:shadow-md'>
                        <span className='mr-2 text-sm text-gray-700 capitalize'>view more...</span>
                        <span className='text-xl text-gray-700'><BsArrowDownShort /></span>
                    </button>
                </div>
            </>
        )
    }


    return (
        <div className='container mx-auto'>
            {topMostSection()}
            {items ? productCardSection() : ""}
        </div>
    )
}


function CategoryList({ data }) {

    const [catActive, setCatActive] = useState({ status: false, index: null, des_act: false });

    const isCatActive = (index) => {
        if ((catActive.status && (catActive.index === index) && !catActive.des_act) ||
            (catActive.status && (catActive.index === index) && catActive.des_act))
            return true;
        else if (!catActive.status && !catActive.des_act)
            return false;
    }


    return (
        <div className="inline-flex">
            {/* <div className='relative'> */}
            <div className='relative w-full m-2 p-4 border border-gray-200 bg-white rounded-md shadow-sm'>
                {/* List title */}
                <div className='flex items-center my-2'>
                    <span className='text-2xl text-gray-900 font-semibold mx-2'><BsListUl /></span>
                    <span className='capitalize font-medium text-gray-600 text-lg'>categories</span>
                </div>
                <ul className='list-inside'>
                    {
                        data.map((category, index) => (
                            <li key={category.id}
                                onMouseEnter={(e) => setCatActive(prev => ({ ...prev, status: true, index }))}
                                onMouseLeave={(e) => setCatActive(prev => ({ ...prev, status: prev.des_act ? true : false, index: prev.des_act ? index : null }))}
                                className={`flex items-center my-1 py-1 cursor-pointer ${isCatActive(index) ? "border-b border-gray-200" : ""}`}
                            >
                                <span className={`mx-4 ${isCatActive(index) ? "text-orange-500 text-xl" : " text-gray-500 text-lg"} `}><category.Icon /></span>
                                <span className={`capitalize truncate ${isCatActive(index) ? 'text-orange-500 font-normal' : 'text-gray-800 font-light'}`}>{category.name}</span>
                                <div
                                    onMouseEnter={(e) => setCatActive(prev => ({ ...prev, status: true, index, des_act: true }))}
                                    // onMouseLeave={(e) => setCatActive(prev => ({ ...prev, index, des_act: false }))}
                                    className={`absolute -right-4 transition ease-in-out duration-100 opacity-0 ${isCatActive(index) && "opacity-100"} bg-white h-6 w-6 z-40 border-b border-b-gray-200 border-l border-gray-200 -translate-x-3 -translate-y-0 rotate-45`}>
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
            {/* </div> */}
            <div
                onMouseLeave={(e) => setCatActive(prev => ({ ...prev, status: false, index: null, des_act: false }))}
                className={`absolute z-30 top-12 left-[288px] transition ease-in-out duration-100 opacity-0 ${catActive.status && 'opacity-100'}`}
            >
                <div className='shadow-lg border border-gray-200 rounded p-8 bg-white min-h-[35.9em]  min-w-[30em]'>
                    <div className='grid grid-cols-3 gap-x-10 gap-y-3'>
                        {
                            data[catActive?.index]?.sub_cat.map((d, index1) => (
                                <div key={index1 + 1} className='px-4 py-2'>
                                    {/* title */}
                                    <span className='font-medium text-gray-700 text-sm'>{d.name}</span>
                                    {/* item */}
                                    <ul className='mt-1'>
                                        {
                                            d.products.map((product, index2) => <li key={index2 + 1} className='text-gray-700 font-light text-sm my-1 hover:underline cursor-pointer hover:text-orange-500'>
                                                <Link to={`category/${data[catActive?.index].name + "/" + d.slug + "/" + product}`}>
                                                    {product}
                                                </Link>
                                            </li>)
                                        }
                                    </ul>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}


function DiscountSale({ items }) {
    return (
        <div className='col-span-3 relative my-2'>
            <div className='w-full relative h-80 flex items-center justify-between mb-1 bg-contain rounded shadow'>
                <div className='p-2 bg-gray-500 opacity-60 rounded-r-md'>
                    <span className='text-xl font-bold'><BsChevronLeft /></span>
                </div>
                <div className='place-self-end mb-2 inline-flex items-center'>
                    <div className='w-2 h-2 bg-gray-700 rounded-full mx-1'></div>
                    <div className='w-2 h-2 bg-gray-700 rounded-full mx-1'></div>
                    <div className='w-3 h-2 bg-gray-700 rounded-full m-1'></div>
                    <div className='w-2 h-2 bg-gray-700 rounded-full m-1'></div>
                </div>
                <div className='p-2 bg-gray-500 opacity-60 rounded-l-md'>
                    <span className='text-xl'><BsChevronRight /></span>
                </div>
                <img className='h-full w-full absolute -z-10' src={require("../images/slide_img.jpg")} />
            </div>
            <div className='relative w-full h-64 flex justify-between rounded mt-1 bg-gradient-to-r from-[#25560600] via-[#395c1f67]  via-[#4d6139d1] to-[#637151] shadow-md'>
                <div className='w-72 text-center px-3 py-2 my-auto'>
                    <span className='capitalize font-semibold text-2xl text-gray-800 my-1'>discount sales</span>
                    <p className='text-gray-700 font-light my-1'>get discount items for winter promotion !</p>
                    <button className='bg-white rounded-md py-2 px-2 my-3'>
                        <span className='mx-1 font-medium text-gray-700'>MMK</span>
                        <span className='mx-1 font-medium text-red-600'>30%</span>
                    </button>
                </div>
                <div className='relative mx-2 flex items-center my-3'>
                    {
                        items.map((item, index) => (
                            <div key={item.id} className='w-44 bg-white h-full rounded mx-3 hover:cursor-pointer'>
                                <div className='flex justify-end mt-2 mr-2'>
                                    <span className=' text-white bg-red-500 rounded-lg text-xs font-medium p-1'>{item.dis_prc} MMK</span>
                                </div>
                                <div className='flex items-center justify-center mt-2'>
                                    <img alt='discount item' className='h-40' src={require("../images/" + item.img_src)} />
                                </div>
                                <div className='flex items-center justify-center mt-1'>
                                    <span className='mx-1 text-gray-500 text-sm line-through'>{item.normal_prc}</span>
                                    <span className='mx-1  text-gray-700 text-sm font-medium'>MMK</span>
                                </div>
                            </div>
                        ))
                    }

                </div>
            </div>
        </div>
    );
}