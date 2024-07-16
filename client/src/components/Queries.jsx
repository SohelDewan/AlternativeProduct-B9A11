import { useEffect, useState } from "react";
import ProductCard from "../pages/Products/ProductCard";

const Queries = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('https://b9a11-server-side-sohel-dewan.vercel.app/products')
            .then(res => res.json())
            .then(data => {
                console.log(data); 
                setProducts(data);
              });
    }, [])
    return (
        <div className="mt-4">
            <div className="text-center">
                <h3 className="text-3xl font-bold text-[#538a48]">Products</h3>
                <h2 className="text-5xl py-2">Queries Products Area</h2>
                <p className="py-8 text-[#]">Substitute products offer consumers choices when making purchase decisions <br /> by providing equally good alternatives, thus increasing utility. </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {
                    products.map(product => <ProductCard
                        key={product._id}
                        product={product}
                    ></ProductCard>)
                }
            </div>
        </div>
    );
};

export default Queries;