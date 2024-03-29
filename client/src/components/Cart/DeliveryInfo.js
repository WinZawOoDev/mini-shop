import React, { Fragment, useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Form, useNavigate } from 'react-router-dom'
import { BsHouse, BsChevronExpand, BsCheck2, BsPencilSquare } from 'react-icons/bs'
import { HiOutlineBuildingOffice, HiUser } from 'react-icons/hi2'
import { Combobox, Transition } from '@headlessui/react'
import { v4 as uuidv4 } from 'uuid'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useImmer } from 'use-immer'

import { selectIsCartEmpty } from '../../app/cartSlice'
import OrderSummary from './OrderSummary'
import CartTable from './CartTable'
import { MMRegions } from '../../dummyData/MMstate&township'
import Stepper from './Stepper'
import { CartViewContext } from './index'


export default function DeliveryInfo() {

  const { deliInfo, setDeliInfo, changeStepperState, stepNames } = useContext(CartViewContext)

  const isCartEmpty = useSelector(selectIsCartEmpty);
  const navigate = useNavigate();

  const [houseOrOffice, setHouseOrOffice] = useState({ house: true, office: false });
  const handleHouseOrOffice = ({ house, office }) => setHouseOrOffice(prev => ({ ...prev, house, office }));

  const [showFormResult, setShowFormResult] = useState(false);

  const form = useFormik({
    initialValues: deliInfo,
    validationSchema: Yup.object().shape({
      fullName: Yup.string().min(4).max(20).required(),
      phoneNumber: Yup.string().min(10).max(10).required(),
      building: Yup.string().min(5).max(30).required(),
      colony: Yup.string().min(5).max(30).required(),
      region: Yup.object({ eng: Yup.string().required('region is a required field') }),
      city: Yup.object({ eng: Yup.string().required('city is a required field') }),
      township: Yup.object({ eng: Yup.string().required('township is a required field') }),
      address: Yup.string().required()
    }),
    onSubmit: handleFormSubmit
  });


  function handleFormSubmit(values) {
    console.log({ ...values, region: values.region.eng, city: values.city.eng, township: values.township.eng })
    setDeliInfo(prev => {
      prev.fullName = values.fullName;
      prev.phoneNumber = values.phoneNumber;
      prev.building = values.building;
      prev.colony = values.colony;
      prev.region = values.region.eng;
      prev.city = values.city.eng;
      prev.township = values.township.eng;
      prev.address = values.address;
      prev.houseOrOffice = houseOrOffice;
    })
    setShowFormResult(true);
    changeStepperState({ name: stepNames.deli, isFinished: true });
  }



  const [regionOptions, setRegionOptions] = useImmer([]);
  const [cityOptions, setCityOptions] = useImmer([]);
  const [townshipOptions, setTownshipOptions] = useImmer([]);

  const getRegions = () => {
    const regions = MMRegions.map(region => ({ id: uuidv4(), eng: region.eng, mm: region.mm }));
    setRegionOptions(regions);
  }

  useEffect(() => {
    if (isCartEmpty) navigate("empty-cart");
    getRegions();
  }, [])

  const handleComboChange = ({ formField, value }) => {

    form.setFieldValue(formField, value);

    if ((formField === "region") && (form.values.region.eng !== value.eng)) {
      let arr = [];
      for (let i = 0; i < MMRegions.length; i++) {
        if (MMRegions[i].eng === value.eng) {
          for (let j = 0; j < MMRegions[i].districts.length; j++) {
            let district = MMRegions[i].districts[j];
            arr.push({ id: uuidv4(), eng: district.eng, mm: district.mm });
          }
          break;
        }
      }
      form.setFieldValue("city", "");
      form.setFieldValue("township", "");
      setCityOptions(arr);
    }

    if (formField === "city" && (form.values.city.eng !== value.eng)) {
      let arr = [];
      let found;
      for (let i = 0; i < MMRegions.length; i++) {
        for (let j = 0; j < MMRegions[i].districts.length; j++) {
          if (MMRegions[i].districts[j].eng === value.eng) {
            found = true;
            for (let x = 0; x < MMRegions[i].districts[j].townships.length; x++) {
              let township = MMRegions[i].districts[j].townships[x];
              arr.push({ id: uuidv4(), eng: township.eng, mm: township.mm });
            }
            break;
          }
        }
        if (found) break;
      }
      form.setFieldValue("township", "");
      setTownshipOptions(arr);
    }
  }

  const isValEmpt = (values) => values.length === 0 ? true : false;

  function renderForm() {
    return (
      <>
        <div className='grid grid-cols-2 gap-2 content-center max-h-[60em]'>
          <div className='mx-5'>
            <Input
              id="fullName"
              label="Full Name"
              name="fullName"
              type="text"
              placeholder="Enter your first name and last name"
              value={form.values.fullName}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={(form.touched.fullName && form.errors.fullName) && form.errors.fullName}
            />
            <Input
              id="phoneNumber"
              label="Phone Number"
              name="phoneNumber"
              type="number"
              placeholder="Please enter your phone number"
              value={form.values.phoneNumber}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={(form.touched.phoneNumber && form.errors.phoneNumber) && form.errors.phoneNumber}
            />
            <Input
              id="building"
              label="Building / House Number / Floor / Street"
              name="building"
              type="text"
              placeholder="Please Enter"
              value={form.values.building}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={(form.touched.building && form.errors.building) && form.errors.building}
            />
            <Input
              id="colony"
              label="Colony / Suburb / Locality / Landmark"
              name="colony"
              type="text"
              placeholder="Please Enter"
              value={form.values.colony}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={(form.touched.colony && form.errors.colony) && form.errors.colony}
            />
          </div>
          <div className='mx-5'>
            <SelectComboBox
              label="State / Region"
              name="region"
              type="text"
              placeholder="Please choose your region"
              selectedValue={form.values.region}
              onChange={(value) => handleComboChange({ formField: "region", value })}
              onBlur={() => form.setFieldTouched("region", true)}
              options={regionOptions}
              error={(form.touched.region && form.errors.region) && form.errors.region}
            />
            <SelectComboBox
              label="City"
              name="city"
              type="text"
              placeholder="Please choose your city"
              selectedValue={form.values.city}
              onChange={(value) => handleComboChange({ formField: "city", value })}
              onBlur={() => form.setFieldTouched("city", true)}
              options={cityOptions}
              disabled={isValEmpt(form.values.region)}
              error={(form.touched.city && form.errors.city) && form.errors.city}
            />
            <SelectComboBox
              label="Township"
              name="township"
              type="text"
              placeholder="Please choose your township"
              selectedValue={form.values.township}
              onChange={(value) => handleComboChange({ formField: "township", value })}
              onBlur={() => form.setFieldTouched("township", true)}
              options={townshipOptions}
              disabled={isValEmpt(form.values.city)}
              error={(form.touched.township && form.errors.township) && form.errors.township}
            />
            <Input
              id="address"
              label="Address"
              name="address"
              type="text"
              placeholder="Please enter your address"
              value={form.values.address}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={(form.touched.address && form.errors.address) && form.errors.address}
            />
          </div>
        </div>
        <div className='relative flex w-full items-center justify-between my-5'>
          <div className='w-1/2'>
            <div className='max-w-[25em] flex justify-end items-center mx-5'>
              <button onClick={() => handleHouseOrOffice({ house: true, office: false })} className={`flex items-center justify-between border border-gray-200 px-4 py-2 rounded-md bg-gray-50 mx-5 ${houseOrOffice.house && " border-cyan-200 focus:border-cyan-400"}`}>
                <BsHouse className='text-xl text-gray-700' />
                <span className='ml-2 text-xs font-medium text-gray-700'>House</span>
              </button>
              <button onClick={() => handleHouseOrOffice({ office: true, house: false })} className={`flex items-center justify-between border border-gray-200 px-4 py-2 rounded-md bg-gray-50 ${houseOrOffice.office && " border-cyan-200 focus:border-cyan-400"}`}>
                <HiOutlineBuildingOffice className='text-xl text-gray-700' ariaHidden={true} />
                <span className='ml-2 text-xs font-medium text-gray-700'>office</span>
              </button>
            </div>
          </div>
          <div className='w-1/2'>
            <div className='max-w-[25em] mx-5'>
              <button type='submit' onClick={() => form.handleSubmit()} className='bg-cyan-600 w-full rounded-md py-2 outline-none'>
                <span className='uppercase text-white text-sm font-medium'>save</span>
              </button>
            </div>
          </div>
        </div>
      </>

    )
  }


  function renderFormResult() {

    const datas = [
      [
        { id: 1, label: "Fullname", value: deliInfo.fullName },
        { id: 2, label: "PhoneNumber", value: deliInfo.phoneNumber },
        { id: 3, label: "Building / House Number / Floor / Street", value: deliInfo.building },
        { id: 4, label: "Colony / Suburb / Locality / Landmark", value: deliInfo.colony }
      ],
      [
        { id: 5, label: "Region", value: deliInfo.region },
        { id: 6, label: "City", value: deliInfo.city },
        { id: 7, label: "Township", value: deliInfo.township },
        { id: 8, label: "Address", value: deliInfo.address }
      ]
    ]

    const FormData = ({ label, value }) => (
      <div className='flex items-center my-5'>
        <div className='w-1/2 pr-3'>
          <span className='block text-gray-500 text-sm font-light truncate'>{label}</span>
        </div>
        <div className='w-1/2 flex items-center'>
          <span className='mr-5 text-gray-500'>:</span>
          <span className='block text-gray-900 text-sm font-medium truncate'>{value}</span>
        </div>
      </div>
    )

    return (
      <>
        <div className='grid grid-cols-2 gap-2 content-center max-h-[60em] mx-5 my-5'>
          <div className='relative'>
            {datas[0].map(data => <FormData key={data.id} label={data.label} value={data.value} />)}
            <div className='flex items-center'>
              {houseOrOffice.house ? <BsHouse className='mr-2 text-lg text-gray-500' /> : <HiOutlineBuildingOffice className='mr-2 text-xl text-gray-400' />}
              <span className='text-sm text-gray-900'>{houseOrOffice.house ? "House" : "Office"}</span>
            </div>
          </div>
          <div className='relative'>
            {datas[1].map(data => <FormData key={data.id} label={data.label} value={data.value} />)}
          </div>
        </div>
        <div className='flex justify-end items-center mx-10'>
          <button onClick={() => setShowFormResult(false)} className='outline-none'>
            <BsPencilSquare className='text-cyan-600 text-xl' />
          </button>
        </div>
      </>
    )
  }

  return (
    <div className='container mx-auto'>
      <div className='grid grid-cols-6 gap-x-2'>
        <div className='col-span-4'>
          <div className='h-24 pt-3 bg-whit rounded-t'>
            <Stepper />
          </div>
          <div className='bg-white rounded py-7 px-5 mb-2'>
            <span className='text-lg text-gray-700'>Delivery Information</span>
            {showFormResult ? renderFormResult() : renderForm()}
          </div>
          <CartTable increOrDecreQty={false} />
        </div>
        <div className='col-span-2'>
          <OrderSummary checkout={{ disable: showFormResult ? false : true, to: "payment" }} />
        </div>
      </div>
    </div>
  )
}


function Input({ id, label, type, name, placeholder, value, onChange, onBlur, error }) {
  return (
    <div className='relative max-w-[25em] my-8'>
      <label htmlFor={name} className='block text-xs text-gray-800 font-medium tracking-wide'>{label}</label>
      <input
        id={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        type={type}
        name={name}
        placeholder={placeholder}
        className={`border border-gray-200 text-sm focus:border-gray-300 outline-none rounded font-light pl-5 pr-3 py-2 placeholder:text-sm mt-2 w-full transition duration-100 ease-in-out ${error && "border-red-300"}`}
      />
      <span className={`absolute left-0 -bottom-5 text-xs text-red-800 font-medium opacity-0 transition duration-75 ease-in-out ${error && "opacity-100"}`}>{error}</span>
    </div>
  )
}


function SelectComboBox({ selectedValue, onChange, onBlur, label, placeholder, options, disabled, error }) {

  const [query, setQuery] = useState('')

  const filteredOption =
    query === ''
      ? options
      : options.filter((option) =>
        option.eng
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.toLowerCase().replace(/\s+/g, ''))
      )

  return (
    <>
      <Combobox disabled={disabled} value={selectedValue} onChange={onChange} as="div" className="relative max-w-[25em] my-8">
        {
          ({ open }) => (
            <>
              <Combobox.Label className='block text-xs text-gray-800 font-medium tracking-wide'>{label}</Combobox.Label>
              <div className={`relative`}>
                <Combobox.Input
                  placeholder={placeholder}
                  className={`border border-gray-200 text-sm font-light focus:border-gray-300 outline-none rounded pl-5 pr-3 py-2 placeholder:text-sm mt-2 w-full ${error && "border-red-300"}`}
                  displayValue={(option) => option.eng}
                  onChange={(event) => setQuery(event.target.value)}
                  onBlur={onBlur}
                />
                <Combobox.Button className="absolute inset-y-0 top-2 right-0 flex items-center pr-3">
                  <BsChevronExpand
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </Combobox.Button>
              </div>
              <span className={`absolute text-xs -bottom-[1.6em] text-red-800 font-medium opacity-0 transition duration-75 ease-in-out ${error && "opacity-100"}`}>{error?.eng}</span>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => setQuery('')}
              >
                <Combobox.Options
                  className="absolute z-50 bg-white text-sm w-full shadow-lg border border-gray-100 py-2 rounded-b max-h-[26em] overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-thumb-rounded-md scrollbar-track-rounded-md">
                  {filteredOption.length === 0 && query !== '' ? (
                    <div className="relative cursor-default select-none py-2 px-4 font-light text-gray-700">
                      Nothing found.
                    </div>
                  ) : (
                    filteredOption.map((option) => (
                      <Combobox.Option
                        key={option.id}
                        className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-orange-600 text-white' : 'text-gray-900'}`}
                        value={option}
                      >
                        {({ selected, active }) => (
                          <>
                            <div className={`truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                              <span className={`mr-2`} >{option.eng}</span>
                              <span className={`${selected ? 'font-medium' : 'font-normal'}`}>( {option.mm} )</span>
                            </div>

                            {selected ? (
                              <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-orange-600'}`} >
                                <BsCheck2 className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              </Transition>
            </>
          )
        }
      </Combobox>
    </>
  )
}

SelectComboBox.defaultProps = {
  disabled: false
}