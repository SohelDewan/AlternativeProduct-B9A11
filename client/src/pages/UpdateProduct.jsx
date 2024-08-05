import { useContext, useState } from 'react'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import axios from 'axios'
import { useLoaderData, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { AuthContext } from '../providers/AuthProvider'

const UpdateProduct = () => {
  const navigate = useNavigate()
  const product = useLoaderData()
  const {
    _id,
    queryTitle,
    alterationReason,
    currentDate,
    brandName,
  } = product || {}
  const { user } = useContext(AuthContext)
  const [startDate, setStartDate] = useState(new Date(currentDate) || new Date())
  const handleFormSubmit = async e => {
    e.preventDefault()
    const form = e.target
    const queryTitle = form.queryTitle.value
    const email = form.email.value
    const currentDate = startDate
    const brandName = form.brandName.value
    const alterationReason = form.alterationReason.value
    const productData = {
      queryTitle,
      currentDate,
      brandName,
      alterationReason,
      userInfo: {
        email,
        name: user?.displayName,
        photo: user?.photoURL,
      },
    }

    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/product/${_id}`,
        productData
      )
      console.log(data)
      toast.success('Job Data Updated Successfully!')
      navigate('/my-posted-products')
    } catch (err) {
      console.log(err)
      toast.error(err.message)
    }
  }
  return (
    <div className='flex justify-center items-center min-h-[calc(100vh-306px)] my-12'>
      <section className=' p-2 md:p-6 mx-auto bg-white rounded-md shadow-md '>
        <h2 className='text-lg font-semibold text-gray-700 capitalize '>
          Update a Product
        </h2>

        <form onSubmit={handleFormSubmit}>
          <div className='grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2'>
            <div>
              <label className='text-gray-700 ' htmlFor='job_title'>
                Product Title
              </label>
              <input
                id='job_title'
                name='job_title'
                defaultValue={queryTitle}
                type='text'
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
              <label className='text-gray-700'>Last Date for recommendation</label>

              <DatePicker
                className='border p-2 rounded-md'
                selected={startDate}
                onChange={date => setStartDate(date)}
              />
            </div>

            <div className='flex flex-col gap-2 '>
              <label className='text-gray-700 ' htmlFor='category'>
                Category
              </label>
              <select
                name='category'
                id='category'
                defaultValue={brandName}
                className='border p-2 rounded-md'
              >
                <option value='Samsung'>Samsung</option>
                <option value='Apple'>Apple</option>
                <option value='Lg'>Lg</option>
              </select>
            </div>
            

            
          </div>
          <div className='flex flex-col gap-2 mt-4'>
            <label className='text-gray-700 ' htmlFor='description'>
              Description
            </label>
            <textarea
              defaultValue={alterationReason}
              className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              name='description'
              id='description'
              cols='30'
            ></textarea>
          </div>
          <div className='flex justify-end mt-6'>
            <button className='px-8 py-2.5 leading-5 text-white transition-colors duration-300 transhtmlForm bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600'>
              Save
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default UpdateProduct
