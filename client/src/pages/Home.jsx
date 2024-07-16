// import { useLoaderData } from 'react-router-dom'
import Carousel from '../components/Carousel'
import Products from './Products/Products'
// import TabCategories from '../components/TabCategories'

const Home = () => {
  return (
    <div>
      <Carousel />
      {/* <TabCategories /> */}
      <Products></Products>
    </div>
  )
}

export default Home
