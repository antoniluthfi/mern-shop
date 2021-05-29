import React from 'react';
import { StyleSheet, View, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { registerRootComponent } from 'expo';

// Navigator
import Main from './Navigators/Main';

// Screens
import Header from './shared/Header';
import ProductContainer from './screens/product/ProductContainer';

LogBox.ignoreAllLogs(true);

function App() {
	return (
		<NavigationContainer>
			<View style={styles.container}>
				<Header />
				<ProductContainer />
			</View>
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default registerRootComponent(App);