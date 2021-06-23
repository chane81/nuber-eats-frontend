import { gql, useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Dish } from '../../components/dish';
import { DishOption } from '../../components/dish-option';
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import {
  createOrder,
  createOrderVariables,
} from '../../__generated__/createOrder';
import { CreateOrderItemInput } from '../../__generated__/globalTypes';
import { restaurant, restaurantVariables } from '../../__generated__/restaurant';

const RESTAURANT_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }

  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
      orderId
    }
  }
`;

interface IRestaurantParams {
  id: string;
}

export const Restaurant = () => {
  const params = useParams<IRestaurantParams>();
  const { data, loading } = useQuery<restaurant, restaurantVariables>(
    RESTAURANT_QUERY,
    {
      variables: {
        input: {
          restaurantId: +params.id,
        },
      },
    },
  );

  const history = useHistory();
  const onCompleted = (data: createOrder) => {
    if (data.createOrder.ok) {
      // alert(`order created${data.createOrder.orderId?.toString()}`);
      const {
        createOrder: { orderId },
      } = data;
      history.push(`/orders/${orderId}`);
    }
  };
  const [createOrderMutation, { loading: createOrderMutationLoading }] =
    useMutation<createOrder, createOrderVariables>(CREATE_ORDER_MUTATION, {
      onCompleted,
    });

  const [orderStarted, setOrderStarted] = useState(false);
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);

  const handleStartOrder = () => {
    setOrderStarted(true);
  };

  const handleAddItemToOrder = (dishId: number) => {
    if (!getItem(dishId)) {
      setOrderItems((cur) => [{ dishId, options: [] }, ...cur]);
    }
  };

  const handleRemoveFromOrder = (dishId: number) => {
    setOrderItems((cur) => cur.filter((dish) => dish.dishId !== dishId));
  };

  const getItem = (dishId: number) =>
    orderItems.find((order) => order.dishId === dishId);
  const isSelected = (dishId: number) => !!getItem(dishId);

  const handleAddOptionToItem = (dishId: number, optionName: string) => {
    if (!getItem(dishId)) {
      return;
    }

    const oldItem = getItem(dishId);
    const oldOptions = oldItem?.options || [];

    if (oldItem) {
      const hasOption = !!oldItem.options?.find((opt) => opt.name === optionName);

      if (!hasOption) {
        handleRemoveFromOrder(dishId);
        setOrderItems((cur) => [
          { dishId, options: [{ name: optionName }, ...oldOptions] },
          ...cur,
        ]);
      }
    }
  };

  const handleRemoveOptionFromItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return;
    }

    const oldItem = getItem(dishId);

    if (oldItem) {
      handleRemoveFromOrder(dishId);
      const options = oldItem.options?.filter((opt) => opt.name !== optionName);

      setOrderItems((cur) => [
        {
          dishId,
          options,
        },
        ...cur,
      ]);
    }
  };

  const getOptionFromItem = (item: CreateOrderItemInput, optionName: string) => {
    return item.options?.find((opt) => opt.name === optionName);
  };

  const isOptionSelected = (dishId: number, optionName: string) => {
    const item = getItem(dishId);

    return item ? !!getOptionFromItem(item, optionName) : false;
  };

  const handleCancelOrder = () => {
    setOrderStarted(false);
    setOrderItems([]);
  };

  const handleConfirmOrder = () => {
    if (orderItems.length === 0) {
      alert(`Can't place empty order`);

      return;
    }

    const ok = window.confirm('You are about to place an order');

    if (ok) {
      createOrderMutation({
        variables: {
          input: {
            restaurantId: +params.id,
            items: orderItems,
          },
        },
      });
    }
  };

  console.log('dish', orderItems);

  return (
    <div>
      <div
        className='bg-gray-800 bg-center bg-cover py-32 md:py-44'
        style={{
          backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})`,
        }}
      >
        <div className='bg-white w-96 md:w-128 py-8 pl-10'>
          <h4 className='text-4xl mb-3'>{data?.restaurant.restaurant?.name}</h4>
          <h5 className='text-sm font-light mb-2'>
            {data?.restaurant.restaurant?.category?.name}
          </h5>
          <h6 className='text-sm font-light'>
            {data?.restaurant.restaurant?.address}
          </h6>
        </div>
      </div>
      <div className='container pb-20 flex flex-col items-end mt-10'>
        {!orderStarted && (
          <button onClick={handleStartOrder} className='btn px-10'>
            StartOrder
          </button>
        )}
        {orderStarted && (
          <div className='flex items-center'>
            <button onClick={handleConfirmOrder} className='btn px-10 mr-2'>
              Confirm Order
            </button>
            <button
              onClick={handleCancelOrder}
              className='btn px-10 bg-black hover:bg-black'
            >
              Cancel Order
            </button>
          </div>
        )}
        <div className='w-full grid mt-16 px-3 md:grid-cols-3 gap-x-5 gap-y-10'>
          {data?.restaurant.restaurant?.menu.map((dish) => (
            <Dish
              id={dish.id}
              isSelected={isSelected(dish.id)}
              key={dish.id}
              orderStarted={orderStarted}
              name={dish.name}
              description={dish.description}
              price={dish.price}
              isCustomer
              options={dish.options}
              addItemToOrder={handleAddItemToOrder}
              removeFromOrder={handleRemoveFromOrder}
            >
              {dish.options?.map((option) => (
                <DishOption
                  key={option.name}
                  dishId={dish.id}
                  isSelected={isOptionSelected(dish.id, option.name)}
                  name={option.name}
                  extra={option.extra}
                  addOptionToItem={handleAddOptionToItem}
                  removeOptionFromItem={handleRemoveOptionFromItem}
                />
              ))}
            </Dish>
          ))}
        </div>
      </div>
    </div>
  );
};
