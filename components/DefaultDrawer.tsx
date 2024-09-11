// import React, { useContext,useState } from "react";
// import { View, StyleSheet } from "react-native";
// import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { useNavigation } from "@react-navigation/native";
// import {DrawerScreenNavigationProp} from "../types/navigation"
// import { StackActions } from '@react-navigation/native';

// const DefaultDrawer = ({  ...props }) => {
//     const navigation = useNavigation<DrawerScreenNavigationProp>();

//     const handleLogout = () => {
//         navigation.closeDrawer;
//         navigation.dispatch(StackActions.replace("Login"))
//     };

//     const handleHelp = () => {}
//     return (
//         <DrawerContentScrollView {...props}>
//                 <DrawerItem onPress={handleHelp} label="Help" icon={() => <Icon color="black" size={18} name="help" />} />
//                 <View style={styles.logoutButton}>
//                     <DrawerItem labelStyle={styles.logoutButtonText} label="Logout" onPress={handleLogout} icon={() => <Icon color="red" size={18} name="logout" />} />
//                 </View>
//         </DrawerContentScrollView>
//     );
// };

// const styles = StyleSheet.create({
//     logoutButton: {
//         borderTopWidth: 1,
//         borderColor: "#ccc",
//     },
//     logoutButtonText: {
//         color: "black",
//         fontSize: 18,
//         fontWeight: "bold",
//         // padding: 10,
//     },
// });

// export default DefaultDrawer;
