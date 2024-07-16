import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const ProductCard = ({ product }) => {
    const { _id, brandName,productName,alterationReason,datePosted, userInfo, productImage, queryTitle } = product;

    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('https://b9a11-server-side-sohel-dewan.vercel.app')
            .then(res => res.json())
            .then(data => {
                console.log(data); 
                setProducts(data);
              });
    }, [])
    console.log(products)

    return (
        <div className="card container mx-auto mt-12 max-w-96 bg-base-100 shadow-xl">
            <figure className="px-10 pt-10">
                <img src={productImage} alt="productImage" className="rounded-xl" />
            </figure>
            <div className="card-body">
                <p  className="text-[#538a48] text-xl">QueryTitle: {queryTitle}</p>
                <p>Product Name:{productName}</p>
                <h2 className="card-title text-[#14447F]">{brandName}</h2>
                <p>Alternation Reason: {alterationReason}</p>
                <p>Date Posted:{datePosted}</p>
                <p className=" flex ">User Info: {userInfo.name} <img className="w-12 h-12 rounded-full ml-12" src={userInfo.thumbnailImage} /></p>
             
                <div className="card-actions w-full">
                    <Link to={`/products/${_id}`}>
                        <button className="btn w-full px-36 bg-[#538a48] text-white rounded-lg hover:bg-[#14447F]">View</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;