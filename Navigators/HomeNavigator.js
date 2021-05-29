import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ProductContainer from '../screens/product/ProductContainer';
import SingleProduct from '../screens/product/SingleProduct';

const Stack = createStackNavigator();

function MyStack() {
	return (
		<Stack.Navigator>
			<Stack.Screen 
				name="Home"
				component={ProductContainer}
				options={{
					headerShown: false
				}}
			/>
			<Stack.Screen 
				name="Product Details"
				component={SingleProduct}
				options={{
					headerShown: false
				}}
			/>
		</Stack.Navigator>
	)
}

export default function HomeNavigator() {
	return <MyStack />
}