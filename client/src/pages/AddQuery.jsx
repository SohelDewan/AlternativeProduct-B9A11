import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import useAuth from '../hooks/useAuth'

const AddQuery = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [startDate, setStartDate] = useState(new Date())

  const handleFormSubmit = async e => {
    e.preventDefault()
    const form = e.target
    const productName = form.productName.value
    const email = form.email.value
    const brandName = form.brandName.value
    const productImage = form.productImage.value
    const alterationReason = form.alterationReason.value
    const queryData = {
      productName,
      brandName,
      productImage,
      alterationReason,
      userInfo: {
        email,
        name: user?.displayName,
        thumbnailImage: user?.photoURL,
        datePosted: startDate,
      },
      recommendationCount: 0,
    }
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/product`,
        queryData
      )
      console.log(data)
      toast.success('Query Data Updated Successfully!')
      navigate('/my-queries')
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div className='flex justify-center items-center min-h-[calc(100vh-306px)] my-12'>
      <section className=' p-2 md:p-6 mx-auto bg-white rounded-md shadow-md '>
        <h2 className='text-lg font-semibold text-gray-700 capitalize '>
          Add a query
        </h2>

        <form onSubmit={handleFormSubmit}>
          <div className='grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2'>
            <div>
              <label className='text-gray-700 ' htmlFor='productName'>
              Product Name
              </label>
              <input
                id='productName'
                name='productName'
                type='text'
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              />
            </div>

            <div className='flex flex-col gap-2 '>
              <label className='text-gray-700 ' htmlFor='brandName'>
              Brand Name
              </label>
              <select
                name='brandName'
                id='brandName'
                className='border p-2 rounded-md'
              >
                <option value='Samsung'>Samsung</option>
                <option value='LG'>LG</option>
                <option value='Apple'>Apple</option>
              </select>
            </div>
            <div>
              <label className='text-gray-700 ' htmlFor='productImage'>
              Product Image Url
              </label>
              <input
                id='productImage'
                name='productImage'
                type='url'
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              />
            </div>
            <div>
              <label className='text-gray-700 ' htmlFor='emailAddress'>
                Email Address
              </label>
              <input
                id='emailAddress'
                type='email'
                name='email'
                disabled
                defaultValue={user?.email}
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              />
            </div>
            <div className='flex flex-col gap-2 '>
              <label className='text-gray-700'>Current Date</label>

              {/* Date Picker Input Field */}
              <DatePicker
                className='border p-2 rounded-md'
                selected={startDate}
                onChange={date => setStartDate(date)}
              />
            </div>
            <div>
              <label className='text-gray-700 ' htmlFor='emailAddress'>
                Name
              </label>
              <input
                id='name'
                type='name'
                name='name'
                disabled
                defaultValue={user?.displayName}
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              />
            </div>
          </div>
          <div className='flex flex-col gap-2 mt-4'>
            <label className='text-gray-700 ' htmlFor='alterationReason'>
            Boycotting Reason
            </label>
            <textarea
              className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              name='alterationReason'
              id='alterationReason'
            ></textarea>
          </div>
          <div className='flex justify-end mt-6'>
            <button className='px-8 py-2.5 leading-5 text-white transition-colors duration-300 transhtmlForm bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600'>
              Add Query
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default AddQuery