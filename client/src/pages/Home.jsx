// import { useLoaderData } from 'react-router-dom'
import Carousel from '../components/Carousel'
import AlternativeProducts from './AlternativeProducts'
import ExtraSection from './ExtraSection'
import Products from './Products/Products'
// import TabCategories from '../components/TabCategories'

const Home = () => {
  return (
    <div>
      <Carousel />
      {/* <TabCategories /> */}
      <Products></Products>
      <AlternativeProducts></AlternativeProducts>
      <ExtraSection></ExtraSection>
    </div>
  )
}

export default Home
