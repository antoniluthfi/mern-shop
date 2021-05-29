import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, FlatList, ScrollView, Dimensions } from 'react-native';
import { Container, Header, Icon, Item, Input, Text } from 'native-base';

import ProductList from './ProductList';
import SearchedProduct from './SearchedProduct';
import Banner from '../../shared/Banner';
import CategoryFilter from './CategoryFilter';

const productData = require('../../assets/products.json');
const categoryData = require('../../assets/categories.json');

const ProductContainer = (props) => {
    const [product, setProduct] = useState([]);
    const [filteredProduct, setFilteredProduct] = useState([]);
    const [focus, setFocus] = useState(false);
    const [categories, setCategories] = useState([]);
    const [productCategories, setProductCategories] = useState([]);
    const [active, setActive] = useState();
    const [initialState, setInitialState] = useState([]);

    useEffect(() => {
        setProduct(productData);
        setFilteredProduct(productData);
        setCategories(categoryData);
        setActive(-1);
        setInitialState(productData);

        return () => {
            setProduct([]);
            setFilteredProduct([]);
            setFocus(false);
            setCategories([]);
            setActive();
            setInitialState([]);
        }
    }, []);

    // product 
    const searchProduct = (text) => setFilteredProduct(product.filter((i) => i.name.toLowerCase().includes(text.toLowerCase())));
    const openList = () => setFocus(true);
    const onBlur = () => setFocus(false);

    // category
    const changeCategory = (category) => {
        category === 'all' ? 
            [
                setProductCategories(product), 
                setActive(true)
            ] : 
            [
                setProductCategories(product.filter((i) => i.category.$oid === category)), 
                setActive(true)
            ];
        
    }

    return (
        <Container>
            <Header searchBar rounded>
                <Item>
                    <Icon name="ios-search" />
                    <Input 
                        placeholder="Search"
                        onFocus={openList}
                        onPress={openList}
                        onChangeText={(text) => searchProduct(text)}
                    />

                    {focus == true ? <Icon onPress={onBlur} name="ios-close" /> : null}
                </Item>
            </Header>
            {focus == true ? (
                <SearchedProduct 
                    productFiltered={filteredProduct}
                />
            ) : (
                <ScrollView>
                    <View>
                        <View>
                            <Banner />
                        </View>
                        <View>
                            <CategoryFilter
                                categories={categories}
                                categoryFilter={changeCategory}
                                productCategories={productCategories}
                                active={active}
                                setActive={setActive}
                            />
                        </View>
                        {productCategories.length > 0 ? (
                            <View style={styles.listContainer}>
                                {productCategories.map((item) => (
                                    <ProductList 
                                        key={item._id.$oid}
                                        item={item}
                                        navigation={props.navigation}
                                    />
                                ))}
                            </View>
                        ) : (
                            <View style={[styles.center, {height: 100}]}>
                                <Text>No products found</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            )}
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        flexWrap: 'wrap',
        backgroundColor: 'gainsboro'
    },
    listContainer: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        backgroundColor: 'gainsboro'
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default ProductContainer;