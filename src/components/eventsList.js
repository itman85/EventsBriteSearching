import React, {Component} from 'react'
import{
  Text,
  View,
  StyleSheet,
  ListView,
  Image,
  TouchableOpacity,
  TextInput
}from 'react-native';

import Geocoder from 'react-native-geocoder';

const API_KEY = 'Bearer SZRBEN2CGEUPT57YVMXP';//replace your api key
const ROOT_URL = 'https://www.eventbriteapi.com/v3/events/search/';
const ds = new ListView.DataSource({rowHasChanged:(r1,r2)=>r1!=r2});

module.exports = React.createClass({
  getInitialState(){
      return({
        dataSource:ds.cloneWithRows([

      ]),
      eventType:'',
      city:''
    })
  },

  componentDidMount(){
    this.searchEventsBrite('hackathon','San Francisco');
  },

  searchEventsBrite(category,city){
    Geocoder.geocodeAddress(city).then(res =>{
      console.log('res',res);
      let position = res[0].position;
      let locationStr = `&location.latitude=${position.lat}&location.longitude=${position.lng}`
     let FETCH_URL = `${ROOT_URL}?q=${category}${locationStr}`;
      console.log('FETCH_URL', FETCH_URL);
      fetch(FETCH_URL, {
        method: 'GET',
        headers: {
          'Authorization': API_KEY
        }
      })
      .then((response) => response.json())
      .then((responseJSON) => {
        console.log('responseJSON', responseJSON);
        this.setState({dataSource: ds.cloneWithRows(responseJSON.events)});
      });

    })
    .catch(err => console.log(err))

  },
  openDetail(rowData){
    this.props.navigator.push({
      name:'eventDetail',
      title:rowData.name.text,
      description:rowData.description.text,
      url:rowData.url,
      img:rowData.logo.url
    })
  },
  renderRow(rowData){
    const defaultImg = 'https://pixabay.com/static/uploads/photo/2014/08/21/19/43/question-423604__180.png';
    let img = rowData.logo != null ? rowData.logo.url : defaultImg;
    return(
      <View style={styles.row}>
      <Image
          style={styles.rowLogo}
          source={{uri: img}}
        />
      <View style={styles.rowDetails}>
          <Text>
            {rowData.name.text.length >30?
            `${rowData.name.text.substring(0,30)}...`:rowData.name.text}
          </Text>
          <TouchableOpacity onPress={()=>this.openDetail(rowData)}>
          <Text style={styles.link}>
            more details
          </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  },

  render(){
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
        Event Brite Searching
        </Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder='kind of event...'
            onChangeText={(text) => this.setState({eventType: text})}
          />
          <TextInput
            style={styles.input}
            placeholder='city...'
            onChangeText={(text) => this.setState({city: text})}
          />
          <TouchableOpacity
            onPress={() => this.searchEventsBrite(this.state.eventType, this.state.city)}
          >
            <Text style={styles.button}>
              Search
            </Text>
          </TouchableOpacity>
        </View>
        <ListView style={styles.list}
        dataSource={this.state.dataSource}
        renderRow={(rowData)=>this.renderRow(rowData)}>
        </ListView>

      </View>
    )
  }

})

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  title:{
    marginTop:40,
    textAlign: 'center',
    fontSize: 20
  },
  form: {

  },
  list:{
    flex:4
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    padding: 5
  },
  rowDetails: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  rowLogo: {
    flex: 1,
    width: 50,
    height: 50,
    borderColor: '#000',
    borderWidth: 1
  },
  input: {
    borderColor: '#000',
    borderRadius: 5,
    borderWidth: 1,
    margin: 5,
    textAlign: 'center',
    height: 50
  },
  button: {
    borderColor: '#0000FF',
    borderRadius: 5,
    borderWidth: 1,
    textAlign: 'center',
    color: '#0000FF',
    height: 50,
    margin: 5
  },
  link:{
    color:'#0000FF'
  }

})
