import { useState, useEffect } from 'react';
import { Text, View, ActivityIndicator, FlatList, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import filter from 'lodash.filter';
import { useRouter } from 'expo-router';
import { db } from '../../firebaseConfig';
import SearchBar from '../../Components/SearchBar';
import { useMalls } from '../../services/databaseService';
import MallPicker from '../../Components/MallPicker';

export default function StoreSearch() {

    // mall picker
    const { malls, currentMall, setCurrentMall } = useMalls();
    

    // const  navigation = useNavigation();    
    // for filtering search function
    const handleSearch = (query) => {
        if (query) {
            const formattedQuery = query.toLowerCase();
            const filteredData = filter(fullData, (item) => item && contains(item, formattedQuery));
            setData(filteredData);

            // console.log(`Searching for ${query}`);
        } else {
            // If query is cleared, reset the data to the full list
            setData(fullData);
        }
       
    };

    const contains = (item , query) => item.includes(query)
    

    // for handling pressing of location
    const router = useRouter();

    // for pop out of details page
    const pressHandler = async (location) => {
        console.log(location);
        router.push({ pathname: '/PlaceDetailsScreen', params: { locName: location }})
        
    };

    
    
    const [isLoading, setIsLoading] = useState(false);
    const [data,setData] = useState([]);
    const [error, setError] = useState(null);
    const [fullData, setFullData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const colRef = collection(db,'malls',currentMall,'stores')

                
                // await until data is fetched
                const storeListSnapShot = await getDocs(colRef)

                const storeList = storeListSnapShot.docs.map(doc => doc.id)
                
                console.log(storeList);
                // sorting the list by alphabets
                storeList.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

                // filter out the unnecessary nodes
                const filteredStoreList = storeList.filter(item => item && !item.toLowerCase().includes('aesop'));

                setFullData(filteredStoreList);

                // set data to full data set initially
                setData(filteredStoreList);

                setIsLoading(false);
                
            } catch (err) {
                console.error("Error fetching data: ", err);
                setError(err);
                setIsLoading(false);
            }
        };
        setIsLoading(true);
        fetchData();
        
    }, [currentMall]);

    
    
    // loading interface
    if (isLoading) {
        return (
            <View style={{flex:1, justifyContent:"center", alignItems:"center" }}>
                <ActivityIndicator size="large" color="#5500dc" />
            </View>
        );
    }

    // error interface
    if ( error ) {
        return (
            <View style={{flex:1, justifyContent:"center", alignItems:"center" }}>
                <Text>Error in fetching data ... Please check your internet connection!</Text>
            </View>
        );
    }

        
    if( currentMall!= null ) {
    return (
        <SafeAreaView style= {styles.mainContainer}>
            <MallPicker
                style ={{flex:0.2,alignItems:'center', justifyContent:'center'}}
                currentMall={currentMall}
                setCurrentMall={setCurrentMall}
                malls={malls}
            />
            <View style = {{ flex:1, paddingBottom: 70}}>
                <Text>Store Search</Text>
                <SearchBar onSearch={handleSearch} />
                
                <FlatList
                data = {data}
                keyExtractor = {(item, index) => index.toString()}
                renderItem = {({item}) => (

                    
                    <TouchableOpacity onPress = { () => pressHandler(item) } >
                    <View style = {styles.itemContainer}>
                        <Image source = {{uri: "https://frameandkeyrealestate.files.wordpress.com/2019/04/clock-icon.png"}}
                        style = {styles.image} />
                        <Text style = {styles.textName}>{item}</Text>
                        {console.log(JSON.stringify(item))}

                    </View>
                    </TouchableOpacity>
                )}
                />
            </View>
        </SafeAreaView>
    );
}
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
        marginTop: 10,
        borderRadius: 10,
        borderTopWidth: 0.2,
        height:100
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
        width: 25,
        height: 25,
        borderRadius: 5,
    }
})