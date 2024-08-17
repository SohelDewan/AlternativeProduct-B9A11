import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";

const ProductDetails = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(new Date());
  const { user } = useAuth();
  const product = useLoaderData();
  const { _id, queryTitle, brandName, alterationReason, datePosted, userInfo } =
    product || {};
  // console.table(product);

  const handleFormSubmission = async (e) => {
    e.preventDefault();
    if (user?.email === userInfo?.email)
      return toast.error("Action not permitted, recommend others query!");
    const form = e.target;
    const productId = _id;
    const email = user?.email;
    const alterationReason = form.alterationReason.value;
    const productName = form.productName.value;
    const productImage = form.productImage.value;
    const status = "Unread";

    const queryData = {
      productId,
      productName,
      queryTitle,
      productImage,
      brandName,
      alterationReason,
      datePosted,
      email,
      owner_email:userInfo.email,
      status,
      userInfo,
    };

    try {
      const { data } = await axiosSecure.post(
        `${import.meta.env.VITE_API_URL}/recommendations`,
        queryData
      );
      console.log(data);
      toast.success("Query Uploaded Successfully!");
      navigate("/recommendations");
    } catch (err) {
      console.log(err);
      toast.success(err.response.data);
      e.target.reset();
    }
  };

  return (
    <div className="flex flex-col justify-around gap-5 bg-[#538a48d6] p-2  items-center min-h-[calc(100vh-306px)] md:max-w-screen-xl mx-auto ">
      {/* Product Details */}
      <div className="flex-1 w-96 md:w-[600px] px-4 py-7 bg-white rounded-xl shadow-md md:min-h-[350px]">
        <div className="flex items-center justify-between">
          <span className="text-sm font-light text-gray-800 ">
            Posted Date: {new Date(datePosted).toLocaleDateString()}
          </span>
          <span className="px-6 py-3 text-xs text-white uppercase bg-[#14447fad] rounded-full ">
            {brandName}
          </span>
        </div>

        <div>
          <h1 className="mt-2 text-3xl font-semibold text-gray-800 ">
            {queryTitle}
          </h1>

          <p className="mt-2 text-lg text-gray-600 ">
            Alteration Reason: {alterationReason}
          </p>
          <div className="flex justify-between">
            <p className="mt-6 text-sm font-bold text-gray-600 ">
              User Details:
            </p>
            <p className="mt-6 text-sm font-bold text-gray-600 ">
              Product Image
            </p>
          </div>
          <div className="flex items-center gap-5">
            <div>
              <p className="mt-2 text-sm  text-gray-600">
                Name: {userInfo?.name}
              </p>
              <p className="mt-2 text-sm  text-gray-600 ">
                Email: {userInfo?.email}
              </p>
            </div>
            <div className="rounded-full object-cover overflow-hidden w-12 h-12">
              <img src={userInfo?.thumbnailImage} alt="" />
            </div>
            <img className="w-48 flex-1" src={product.productImage} alt="" />
          </div>
        </div>
        {/* <p>User</p> */}
      </div>

      {/* Place A Recommendation Form */}
      <section className="p-6 w-full text-white rounded-md shadow-md flex-1 md:min-h-[350px]">
        <h2 className="text-lg text-white font-semibold  capitalize ">
          Add A Query
        </h2>
        <form onSubmit={handleFormSubmission}>
          <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
            <div>
              <label className=" " htmlFor="productName">
                Product Name
              </label>
              <input
                id="productName"
                name="productName"
                type="text"
                required
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md   focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring"
              />
            </div>
            <div>
              <label className=" " htmlFor="productImage">
                Product Image Url
              </label>
              <input
                id="productImage"
                name="productImage"
                type="url"
                required
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md   focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
            <div>
              <label className=" " htmlFor="emailAddress">
                Email Address
              </label>
              <input
                id="emailAddress"
                type="email"
                name="email"
                disabled
                defaultValue={user?.email}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md   focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring"
              />
            </div>

            <div>
              <label className="" htmlFor="alterationReason">
                My Recommendation Note
              </label>
              <input
                id="alterationReason"
                name="alterationReason"
                type="text"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md   focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring"
              />
            </div>
            <div className="flex flex-col gap-2 ">
              <label className="">Current Date</label>

              {/* Date Picker Input Field */}
              <DatePicker
                className="border p-2 rounded-md text-gray-700"
                selected={startDate}
                onChange={(date) => {
                  console.log(date); // Check the selected date
                  setStartDate(date);
                }}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-[#14447F] rounded-md hover:bg-[#538a48] focus:outline-none focus:bg-gray-600"
            >
              My Recommendation
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
export default ProductDetails;
