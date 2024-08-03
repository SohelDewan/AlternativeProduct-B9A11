import { createBrowserRouter } from 'react-router-dom'
import Main from '../layouts/Main'
import Home from '../pages/Home'
import Login from '../pages/Authentication/Login'
import Register from '../pages/Authentication/Register'
import ErrorPage from '../pages/ErrorPage'
import PrivateRoute from './PrivateRoute'
import UpdateProduct from '../pages/UpdateProduct'
import Queries from '../components/Queries'
import AddQuery from '../pages/AddQuery'
import MyQueries from '../pages/MyQueries'
import ProductDetails from '../pages/ProductDetails'
import MyRecommendation from '../pages/MyRecommendation'
import RecommendationMe from '../pages/RecommendationMe'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
        loader: ()=>fetch('https://b9a11-server-side-sohel-dewan.vercel.app/products')
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/registration',
        element: <Register />,
      },
      {
        path: '/queries',
        element: <Queries />,
        loader: ()=>fetch('https://b9a11-server-side-sohel-dewan.vercel.app/products')
        // loader: ()=>fetch('/data.json')
      },
      {
        path: '/add-query',
        element: <PrivateRoute><AddQuery /></PrivateRoute> ,
      },
      {
        path: '/my-queries',
        element: <PrivateRoute><MyQueries /></PrivateRoute> ,
      },
      {
        path: '/products/:id',
        element: <PrivateRoute> <ProductDetails></ProductDetails>  </PrivateRoute>        ,
        loader: ({ params }) =>fetch(`${import.meta.env.VITE_API_URL}/products/${params.id}`)        
          // loader: ({ params }) =>fetch(`$/{data.json}/${params.id}`)        
      },
      {
        path: '/update/:id',
        element: (
          <PrivateRoute>
            <UpdateProduct />
          </PrivateRoute>
        ),
        loader: ({ params }) =>
          fetch(`${import.meta.env.VITE_API_URL}/product/${params.id}`),
      },
    {
      path: '/my-recommendation',
      element: <PrivateRoute> <MyRecommendation></MyRecommendation>  </PrivateRoute>  ,
        // loader: ({ params }) => fetch(`${import.meta.env.VITE_API_URL}/products/${params.id}`)
    },   
    {
      path: '/recommendation-me',
      element: <PrivateRoute> <RecommendationMe></RecommendationMe>  </PrivateRoute>  ,
        // loader: ({ params }) => fetch(`${import.meta.env.VITE_API_URL}/products/${params.id}`)
    },   
   
    ],
  },
])

export default router
