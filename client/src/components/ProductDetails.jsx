import { useLoaderData, useParams } from "react-router-dom";

const ProductDetails = () => {
    const { _id } = useParams();
    const products = useLoaderData();
    const singleProduct = products.find((e) => e._id === _id);
    
    return (
        <div>
            <h2>ProductDetails</h2>
            <h2>{singleProduct.queryTitle}</h2>
            <h2>{singleProduct.productName}</h2>
            <h2>{singleProduct.brandName}</h2>
        </div>
    );
};

export default ProductDetails;