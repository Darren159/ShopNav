import { useState, useEffect } from "react";
import { ScrollView ,View, Text, FlatList, ActivityIndicator, StyleSheet, Image, SafeAreaView, TouchableOpacity } from "react-native";
import { useSearchParams } from 'expo-router';
import googleImg from "../../services/googleImg";
import googleCall from "../../services/google_API_call";
import fetchPlaceDetails from "../../services/fetchPlaceDetails";



export default function PlaceDetailsScreen() {
    
    // collapsible opening hours
    const [isCollapsed, setIsCollapsed] = useState(true);

    const handlePress = () => {
        setIsCollapsed(!isCollapsed);
    };

    
    

    const [placeDetails, setPlaceDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // check locName is the name of the item user pressed
    const { locName } = useSearchParams();
    // console.log(locName)


    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // get placce_Id using google places API
                const placeId = await googleCall(locName);

                // using place_Id to get unique place details
                const results = await fetchPlaceDetails(placeId);
                
                setPlaceDetails(results);
                setIsLoading(false);
                // check results obtained
                

            } catch (err) {
                setError(err);
                setIsLoading(false);

            }
            
        };
        setIsLoading(true);
        fetchDetails();
    }, [locName]);
    
    // console.log(placeDetails);

    // loading interface
    if (isLoading) {
        return (
            <View style={{flex:1, justifyContent:"center", alignItems:"center" }}>
                <ActivityIndicator size= "large" color="#5500dc" />
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

    
    if (placeDetails != null ) {
    return (
        
                <SafeAreaView style= {styles.mainContainer}>
                    <ScrollView 
                        showsVerticalScrollIndicator = {false}
                        >
                        <Text style = {{fontSize:40,fontWeight:'bold', textAlign: 'center'}}> 
                            {placeDetails.name}
                        </Text>


                         <FlatList 
                            style = {{ borderRadius: 10}}
                            data={placeDetails.photos}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem = {({item}) =>
                                <View>
                                    <Image source = {{ uri: googleImg(item.photo_reference) }} style={{width: 353, height: 300, padding: 10 , borderWidth: 2, borderRadius: 10}}/>
                                </View>
                            }
                            horizontal
                            showsHorizontalScrollIndicator = {false}
                            pagingEnabled
                            bounces = {false}
                        />

                        <View style= {{ flexDirection: 'row' , paddingTop: 10, alignItems: 'center'}}>
                            
                            <Image 
                                style = {{ height: 20, width:20 }}
                                source = {{ uri: 'https://th.bing.com/th?id=OIP.LKqhdSDlLwqivERFPsNMbwHaJu&w=218&h=286&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2'}}
                            />

                            <Text style= {{ flex: 3, paddingLeft: 10 }}>{placeDetails.formatted_address}</Text>
                        
                            <Text style= {{ flex: 2, fontSize: 30 ,textAlign: 'right'}}>{placeDetails.rating} ⭐</Text> 
                        
                        </View >

                        <View style={{ borderTopWidth: 0.2 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 25, color: placeDetails.business_status === 'OPERATIONAL' ? 'green' : 'red' }}> 
                            
                                {placeDetails.business_status}
                            
                            </Text>
                        </View>

                        <View style={{ borderTopWidth: 0.2 }}>
                            <Text style = {{ fontSize: 25, fontWeight: 'bold', color: placeDetails.opening_hours.open_now? 'green' : 'red' }}>
                                {placeDetails.opening_hours.open_now? '✔OPEN':'✗CLOSED'}
                            </Text>
                        </View>

                        <View style={{ borderTopWidth: 0.2, flexDirection: 'row', alignItems: 'center'}}>
                            <Image 
                            style = {{ height: 20, width:20 }}
                            source = {{ uri: 'https://th.bing.com/th?id=OIP.K1oS9ypne1epe_3H9nahtAHaIS&w=236&h=264&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2'}}/>
                            <Text style = {{ fontSize: 20 , fontWeight: 'bold', paddingLeft: 10}}>{placeDetails.formatted_phone_number}</Text>
                        </View>
                        
                        
                        <TouchableOpacity onPress={handlePress} style = {{ flexDirection: 'row', borderTopWidth: 0.2}}>
                            <Image
                            style = {{height: 20, width: 20}}
                            source={{ uri: 'https://frameandkeyrealestate.files.wordpress.com/2019/04/clock-icon.png'}}
                            />
                            <Text style={{ flex: 4, paddingLeft: 10, fontWeight: 'bold', fontSize: 20}}>
                                OPENING HOURS:
                            </Text>
                            <Text style={{ flex: 1, textAlign: 'right', fontSize: 25}}> {isCollapsed? '▼' :'▲' }</Text>
                        </TouchableOpacity>
                        {!isCollapsed && placeDetails.opening_hours.weekday_text.map((item) => (
                            <View key={item.id}>
                                <Text>{item}</Text>
                            </View>
                        ))}
                                
                        
                        
                        <View style = {{ borderTopWidth: 0.2, flexDirection: 'row', alignItems: 'center'}}>
                            
                            <Image 
                                style = {{ height: 20, width:20 }}
                                source = {{ uri: 'https://th.bing.com/th/id/OIP.S4IQczGnladra9zutNSl1wHaGL?w=209&h=180&c=7&r=0&o=5&pid=1.7'}}
                            />
                            <Text style={{ paddingLeft:10, fontWeight: 'bold', fontSize: 20 }}>
                                Reviews:
                            </Text>    
                        </View>

                        <FlatList
                             data = {placeDetails.reviews}
                             keyExtractor={(item, index) => index.toString()}
                             renderItem = {({item}) =>
                                <View style= {styles.itemContainer}>
                                    <Text style={{ textAlign: 'right'}}>
                                        {item.rating}⭐
                                    </Text>
                                    <Image 
                                        style = {{ height: 50, width: 50, borderRadius: 25}}
                                        source = {{ uri: item.profile_photo_url}}
                                    />

                                    <Text style = {{ padding: 10, fontWeight: 'bold', fontSize: 25}}>
                                        {item.author_name}
                                    </Text>

                                    <Text style= {{ fontSize: 10}}>
                                        {item.relative_time_deescriptioin}
                                    </Text>

                                    <Text>
                                        {item.text}
                                    </Text>
                                </View>
                                
                                
                            }
                            horizontal
                            showsHorizontalScrollIndicator = {false}
                            pagingEnabled
                            bounces = {false}
                        />
                        
                    </ScrollView>
                    
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
        
        alignItems: "center",
        padding: 10,
        marginLeft: 0,
        marginTop: 20,
        borderRadius: 10,
        borderWidth: 1,
        width:353
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
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems:  'center',
    },
})