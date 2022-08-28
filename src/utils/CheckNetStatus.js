import NetInfo from '@react-native-community/netinfo'
export async function isInternetConnected() {
    
    return (await NetInfo.fetch()).isConnected;
   
}