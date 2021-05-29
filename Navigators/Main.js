import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// stack
import HomeNavigator from './HomeNavigator';

const Tab = createBottomTabNavigator();

function Main() {
	return (
		<Tab.Navigator
			initialRouteName="Home"
			tabBarOptions={{
				keyboardHidesTabBar: true,
				showLabel: false,
				activeTintColor: '#e91e63'
			}}
		>
			<Tab.Screen
				name="Home"
				component={HomeNavigator}
				options={{
					tabBarIcon: ({ color })	=> (
						<FontAwesome5
							name="home"
							style={{ position: 'relative' }}
							color={color}
							size={30}
						/>
					)				
				}}
			/>

			<Tab.Screen
				name="Cart"
				component={HomeNavigator}
				options={{
					tabBarIcon: ({ color })	=> (
						<FontAwesome5
							name="shopping-cart"
							color={color}
							size={30}
						/>
					)				
				}}				
			/>

			<Tab.Screen
				name="Admin"
				component={HomeNavigator}
				options={{
					tabBarIcon: ({ color })	=> (
						<FontAwesome5
							name="cog"
							color={color}
							size={30}
						/>
					)	
				}}				
			/>

			<Tab.Screen
				name="User"
				component={HomeNavigator}
				options={{
					tabBarIcon: ({ color })	=> (
						<FontAwesome5
							name="user"
							color={color}
							size={30}
						/>
					)				
				}}				
			/>
		</Tab.Navigator>
	)
}

export default Main;