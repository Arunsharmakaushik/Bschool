import React, { useState, useEffect } from 'react';
import { View, Image, FlatList, TouchableOpacity, Modal, Text } from 'react-native';
import Styles from './Styles';
import HeaderView from '../../components/HeaderView';
import AppColors from '../../utils/AppColors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ImageViewer from 'react-native-image-zoom-viewer';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import moment from 'moment';
import FastImage from 'react-native-fast-image'


const GridGallery = ({ navigation, route }) => {
  const [selectedItem, setSelectedItem] = useState({});
  const [zoomImage, setZoomImage] = useState(false);
  const [index, setIndex] = useState(0);
  const [todayContents, setTodayContent] = useState([]);
  const [weekContents, setWeekContent] = useState([]);
  const [monthContents, setMonthContent] = useState([]);

  const [routes] = useState([
    { key: 'first', title: 'Day', },
    { key: 'second', title: 'Week' },
    { key: 'third', title: 'Month' },
    { key: 'fourth', title: 'Yearly' },
  ]);

  useEffect(() => {
    let date = new Date();
    let today = moment(date).format('DD-MM-YYYY');
    let sharedImages = route.params.sharedImages;
    sharedImages.map((res) => {
      var newDate = moment(moment(res.created_at).format('DD-MM-YYYY'), 'DD-MM-YYYY');
      var todayDiff = moment(today, 'DD-MM-YYYY');
      let diff = todayDiff.diff(newDate, 'days');
      if (moment(res.created_at).format('DD-MM-YYYY') === today) {
        todayContents.push(res)
      }
      if (diff <= 7) {
        weekContents.push(res);
      }
      if (moment(date).format('YYYY') === moment(res.created_at).format('YYYY')) {
        if (moment(date).format('MM') === moment(res.created_at).format('MM')) {
          monthContents.push(res);
        }
      }
    })
  }, []);

  const RenderView = (props) => {
    let data = props.data;
    return (
      <View style={Styles.scene}>
        <FlatList
          style={Styles.flatListStyle}
          numColumns={3}
          data={data}
          keyExtractor={(index) => index.toString()}
          renderItem={({ item }) =>
            <TouchableOpacity onPress={() => { setSelectedItem(item); setZoomImage(true) }} >
             <FastImage 
              style={Styles.gridImageStyle}
              source={{ uri: item.image }} 
              resizeMode={FastImage.resizeMode.cover}
              />
            </TouchableOpacity>
          } />
      </View>
    )
  }

  const FirstRoute = () => (
    <RenderView data={[...todayContents]} />
  );

  const SecondRoute = () => (
    <RenderView data={[...weekContents]} />
  );

  const ThirdRoute = () => (
    <RenderView data={[...monthContents]} />
  );

  const FourthRoute = () => (
    <RenderView data={route.params.sharedImages} />
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
    fourth: FourthRoute
  });

  return (
    <View style={Styles.container}>
      <HeaderView onLeftClick={() => { navigation.goBack() }} white title={route.params.title} />
      <TabView
        style={Styles.tabView}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={props =>
          <TabBar
            {...props}
            tabStyle={Styles.tabStyle}
            style={{ backgroundColor: AppColors.APP_THEME }}
            labelStyle={Styles.labelStyle}
            indicatorStyle={{
              height: 3,
              backgroundColor: AppColors.WHITE
            }}
          />
        }
        initialLayout={Styles.tabView}
      />
      {zoomImage ?
        <Modal
          animationType="slide"
          visible={zoomImage}
          transparent={true}
          onRequestClose={() => {
            setSelectedItem({});
            setZoomImage(false);
          }}
          onDismiss={() => {
            setSelectedItem({});
            setZoomImage(false);
          }}>
          <View style={{ height: hp(100), flex: 1, width: wp(100), backgroundColor: AppColors.WHITE, }}>
            <HeaderView title={route.params.title} onLeftClick={() => { setSelectedItem({}); setZoomImage(false) }} />
            <ImageViewer enableSwipeDown={true} onSwipeDown={() => { setSelectedItem({}); setZoomImage(false); }} imageUrls={[{ url: selectedItem.image }]} />
          </View>
        </Modal>
        : null}
    </View>
  );
}

export default GridGallery;
