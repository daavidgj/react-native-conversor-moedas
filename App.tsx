import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TextInput, TouchableOpacity } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useState,useEffect} from 'react';
import './global.css';
import {api} from './components/services/api';
import { parse } from '@babel/core';


/* 
"USD": {
    "code": "USD",
    "codein": "BRL",
    "name": "Dólar Americano/Real Brasileiro",
    "high": "5.4175",
    "low": "5.40912",
    "varBid": "0.00679",
    "pctChange": "0.125507",
    "bid": "5.4167",
    "ask": "5.4197",
    "timestamp": "1756341224",
    "create_date": "2025-08-27 21:33:44"
*/
export default function App() {
  const [valor, setValor] = useState('');
  const [valorMoedaEstrangeira, setValorMoedaEstrangeira] = useState('');
  const [moedas,setMoedas] = useState([]);
  const [valorConvertido, setValorConvertido] = useState(0);
  
  const [codigoMoeda,setCodigoMoeda] = useState('');
  
  
  
  useEffect(()=>{
    function converterMoeda(){
    setValorConvertido ( parseFloat(valor) / parseFloat(valorMoedaEstrangeira) );
    
    console.log('########################################')
    console.log('Valores', valor + ' ... ' + valorMoedaEstrangeira);
    console.log('Valores Float', parseFloat(valor)  + ' ... ' + parseFloat(valorMoedaEstrangeira) );
    console.log('Convertido', parseFloat(valor) / parseFloat(valorMoedaEstrangeira));
  }

  converterMoeda();

  },[valor,valorMoedaEstrangeira]);
  
  
  useEffect(()=>{
    async function loadMoedas(){
      const response = await api.get('all');
      let ArrayMoedas = Object.entries(response.data);
      //console.log(ArrayMoedas);
      setMoedas(ArrayMoedas);
      if (ArrayMoedas.length > 0 && valor == '') {
  setCodigoMoeda(ArrayMoedas[0][1].code);
  setValorMoedaEstrangeira(ArrayMoedas[0][1].bid);
  console.log('Rodou')
} else {
        console.log('Não imprime mais')
      }
      console.log('ArrayMoedas ' + ArrayMoedas[0][1].bid);
      
    }    
    loadMoedas();
    

  },[])
  return (
    <SafeAreaView className="flex-1 bg-slate-400">
      <View className="w-full h-full flex">
          <View className="bg-white w-11/12 gap-4 my-10 mx-auto rounded full flex flex-col py-5 px-3 ">
            <Text className="text-2xl font-bold text-center">Conversor de Moedas</Text>
            <View className="gap-0">
              <Text className="text-md text-gray-500">Selecione a moeda desejada</Text>
              <Text className="text-md text-gray-500">Bid {valorMoedaEstrangeira}</Text>
              <Picker selectedValue={1} onValueChange={(itemValue, itemIndex) => (setValorMoedaEstrangeira(itemValue.bid),setCodigoMoeda(itemValue.code))}>
                {moedas.map((item)=>(
                   <Picker.Item label={item[1]['name']} value={item[1]} />
                ))}
                
                </Picker>
            </View>
            <View className="">
              <Text className="text-md text-gray-500">Digite o valor a ser convertido {valor}</Text>
              <TextInput keyboardType='numeric' placeholder="" value={valor} onChangeText={setValor} className="border border-gray-400 rounded-md p-2 mb-2 w-full"/>

            </View>
            <View className="bg-slate-200 p-5 rounded">
              <Text className="text-lg">Valor Convertido</Text>
                <Text className="font-bold text-md ">{codigoMoeda} = {valorConvertido ? valorConvertido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'Digite um valor'}</Text>
                <Text className="font-bold text-md ">Cotação do {codigoMoeda} = {parseFloat(valorMoedaEstrangeira).toFixed(2)} </Text>
            </View>
          </View>
      </View>
    </SafeAreaView>
  );
}
