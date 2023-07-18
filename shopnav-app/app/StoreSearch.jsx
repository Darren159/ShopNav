import React, { useState, useEffect } from 'react';
import { Text, View, ActivityIndicator, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import SearchBar from '../../Components/SearchBar';
import { SafeAreaView } from 'react-native';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import filter from 'lodash.filter';
import { useRouter } from 'expo-router';

export default function StoreSearch() {

    //const  navigation = useNavigation();    
    //for filtering search function
    const handleSearch = (query) => {
        if (query) {
            const formattedQuery = query.toLowerCase();
            const filteredData = filter(fullData, (item) => {
            return contains(item, formattedQuery);
            });
            setData(filteredData);

            //console.log(`Searching for ${query}`);
        } else {
            //If query is cleared, reset the data to the full list
            setData(fullData);
        }
       
    };

    const contains = ({adjacent} , query) => {
        if (adjacent[0].includes(query)) {
            return true;
        } else {
            return false;
        }
    };

    //for handling pressing of location
    const router = useRouter();

    //for pop out of details page
    const pressHandler = async (location) => {
        
        router.push({ pathname: '/PlaceDetailsScreen', params: { locName: location } 
            //name: result.name, 
            //formatted_phone_number: result.formatted_phone_number,
            //opening_hours: result.opening_hours,
            //photos: result.photos[0].photo_reference,
            //business_status: result.business_status,
            //rating: result.rating,
            //reviews: result.reviews,
            //formatted_address: result.formatted_address, }, 
    })
        
    };

    
    
    const [isLoading, setIsLoading] = useState(false);
    const [data,setData] = useState([]);
    const [error, setError] = useState(null);
    const [fullData, setFullData] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        fetchData();
        
    }, []);

    const fetchData = async () => {
            try {
                const colRef = collection(db, 'Westgate');

                //await until data is fetched
                const storeListSnapShot = await getDocs(colRef)

                const storeList = storeListSnapShot.docs.map(doc => doc.data())
                
                //sorting the list by alphabets
                storeList.sort((a, b) => a.adjacent[0].toLowerCase().localeCompare(b.adjacent[0].toLowerCase()));

                //filter out the unnecessary nodes
                const filteredStoreList = storeList.filter(item => !item.adjacent[0].toLowerCase().includes('aesop'));

                setFullData(filteredStoreList);

                //set data to full data set initially
                setData(filteredStoreList);

                setIsLoading(false);
                
            } catch (err) {
                console.error("Error fetching data: ", err);
                setError(err);
                setIsLoading(false);
            }
        };
    
    //loading interface
    if (isLoading) {
        return (
            <View style={{flex:1, justifyContent:"center", alignItems:"center" }}>
                <ActivityIndicator size={"large"} color="#5500dc" />
            </View>
        );
    }

    //error interface
    if ( error ) {
        return (
            <View style={{flex:1, justifyContent:"center", alignItems:"center" }}>
                <Text>Error in fetching data ... Please check your internet connection!</Text>
            </View>
        );
    }

        

    return (
        <SafeAreaView style= {styles.mainContainer}>
            <View style = {{ paddingBottom: 70}}>
                <Text>Store Search</Text>
                <SearchBar onSearch={handleSearch} />
                
                <FlatList
                data = {data}
                keyExtractor = {(item, index) => index.toString()}
                renderItem = {({item}) => (

                    
                    <TouchableOpacity onPress = { () => pressHandler(item.adjacent[0]) } >
                    <View style = {styles.itemContainer}>
                        <Image source = {{uri: "https://th.bing.com/th/id/R.99e2381b445a56f30bc79cb4b7d239a5?rik=VZlfhVCimbQLvA&riu=http%3a%2f%2fzenandtheartoftravel.com%2fwp-content%2fuploads%2f2012%2f06%2fDSC_0258.jpg&ehk=Q89%2bz8DrgosP78Myqq4Mga2oaT2T8bpmgQqhkHjUgMY%3d&risl=&pid=ImgRaw&r=0"}}
                        style = {styles.image} />
                        <Text style = {styles.textName}>{item.adjacent[0]}</Text>
                        {console.log(JSON.stringify(item.adjacent[0]))}

                    </View>
                    </TouchableOpacity>
                )}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1, 
        marginHorizontal: 20,
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        marginLeft: 0,
        marginTop: 20,
        borderRadius: 10,
        borderWidth: 1,
    },
    textName: {
        flex: 1,
        fontSize: 17,
        marginLeft: 10,
        fontWeight: "600",

    },
    image:  {
        marginLeft: 10,
        marginTop: 5,
        marginBottom: 5,
        width: 50,
        height: 50,
        borderRadius: 5,
    }
})