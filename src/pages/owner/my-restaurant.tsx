import { gql, useQuery } from '@apollo/client';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryVoronoiContainer,
  VictoryTheme,
  VictoryLabel,
  VictoryTooltip,
} from 'victory';
import { Dish } from '../../components/dish';
import {
  DISH_FRAGMENT,
  ORDERS_FRAGMENT,
  RESTAURANT_FRAGMENT,
} from '../../fragments';
import {
  myRestaurant,
  myRestaurantVariables,
} from '../../__generated__/myRestaurant';

export const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
        orders {
          ...OrderParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
  ${ORDERS_FRAGMENT}
`;

interface IParams {
  id: string;
}

export const MyRestaurant = () => {
  const { id } = useParams<IParams>();
  const { data } = useQuery<myRestaurant, myRestaurantVariables>(
    MY_RESTAURANT_QUERY,
    {
      variables: {
        input: {
          id: +id,
        },
      },
    },
  );

  return (
    <div>
      <Helmet>
        <title>
          {data?.myRestaurant.restaurant?.name || 'Loading...'} | Nuber Eats
        </title>
      </Helmet>
      <div
        className='bg-gray-700 py-20 md:py-28 bg-center bg-cover'
        style={{
          backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})`,
        }}
      />
      <div className='container mt-10'>
        <h2 className='text-4xl font-medium mb-10'>
          {data?.myRestaurant.restaurant?.name || 'Loading...'}
        </h2>
        <Link
          to={`/restaurant/${id}/add-dish`}
          className='mr-8 text-white bg-gray-800 py-3 px-10'
        >
          Add Dish &rarr;
        </Link>
        <Link to='##' className='text-white bg-lime-700 py-3 px-10'>
          Buy Promotion &rarr;
        </Link>
        <div className='mt-10'>
          {data?.myRestaurant.restaurant?.menu.length === 0 ? (
            <h4 className='text-xl mb-5'>Please upload a dish!</h4>
          ) : (
            <div className='grid mt-16 px-3 md:grid-cols-3 gap-x-5 gap-y-10'>
              {data?.myRestaurant.restaurant?.menu.map((dish) => (
                <Dish
                  key={dish.id}
                  name={dish.name}
                  description={dish.description}
                  price={dish.price}
                />
              ))}
            </div>
          )}
        </div>
        <div className='mt-20 mb-10'>
          <h4 className='text-center text-2xl font-medium'>Sales</h4>
          <div className='mx-auto bg-gray-100'>
            <VictoryChart
              height={300}
              width={window.innerWidth}
              domainPadding={30}
              theme={VictoryTheme.material}
              containerComponent={<VictoryVoronoiContainer />}
            >
              <VictoryLine
                labels={({ datum }) => `$${datum.y}`}
                labelComponent={
                  <VictoryTooltip
                    style={{ fontSize: 13 }}
                    dy={-3}
                    renderInPortal
                  />
                }
                data={data?.myRestaurant.restaurant?.orders.map((order) => ({
                  x: order.createAt,
                  y: order.total,
                }))}
                interpolation='natural'
                style={{
                  data: {
                    stroke: '#339af0',
                    strokeWidth: 4,
                  },
                }}
              />

              <VictoryAxis
                tickLabelComponent={<VictoryLabel renderInPortal />}
                style={{
                  tickLabels: {
                    fontSize: 13,
                    angle: 45,
                  },
                }}
                tickFormat={(tick) => new Date(tick).toLocaleDateString('ko')}
              />
            </VictoryChart>
          </div>
        </div>
      </div>
    </div>
  );
};
