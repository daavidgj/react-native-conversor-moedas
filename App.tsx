import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Pressable, Keyboard, Switch } from 'react-native';
import { useColorScheme } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import './global.css';
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';
import { api } from './components/services/api';
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

const colors = {
  light: {
    primary: '#9561F0',
    secondary: '#7049B5', // roxo principal
    background: '#F9FAFB', // quase branco, suave
    backgroundalt: '#EDF2F7', // cinza bem claro (cards, seções)
    backgroundBox: '#FFFFFF', // branco puro (inputs, caixas)
    title: '#111111', // quase preto
    text: '#444444', // cinza escuro
    black: '#111111',
    white: '#f8f8f8',
    gray: '#f1f1f1',
  },
  dark: {
    primary: '#9561F0',
    secondary: '#7049B5', // roxo principal no dark
    background: '#121212', // preto moderno
    backgroundalt: '#1E1E1E', // cinza chumbo (cards, seções)
    backgroundBox: '#2A2A2A', // caixa/input com contraste
    title: '#F5F5F5', // branco suave
    text: '#CCCCCC', // cinza claro pro corpo
    black: '#111111',
    white: '#f8f8f8',
    gray: '#1a1a1a',
  },
};

export default function App() {
  const colorscheme = useColorScheme();
  const [theme, setTheme] = useState(colors[colorscheme]); //colorscheme.light;
  const [ativo, setAtivo] = theme === colors['light'] ? useState(false) : useState(true);
  const [keyboardActive,setKeyboardActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [valor, setValor] = useState('');
  const [valorMoedaEstrangeira, setValorMoedaEstrangeira] = useState('');
  const [moedas, setMoedas] = useState([]);
  const [valorConvertido, setValorConvertido] = useState(0);

  const [codigoMoeda, setCodigoMoeda] = useState('');

  function themeMode() {
    setAtivo(!ativo);
    setTheme(ativo ? colors.light : colors.dark);
  }
  useEffect(()=>{
    Keyboard.addListener('keyboardDidShow',()=>{
      setKeyboardActive(true);
    })
    Keyboard.addListener('keyboardDidHide',()=>{
      setKeyboardActive(false);
    })
  },[])
  useEffect(() => {
    function converterMoeda() {
      setValorConvertido(parseFloat(valor) / parseFloat(valorMoedaEstrangeira));

      //console.log('########################################')

      //console.log('Valores', valor + ' ... ' + valorMoedaEstrangeira);
      //console.log('Valores Float', parseFloat(valor)  + ' ... ' + parseFloat(valorMoedaEstrangeira) );
      //console.log('Convertido', parseFloat(valor) / parseFloat(valorMoedaEstrangeira));
    }

    converterMoeda();
  }, [valor, valorMoedaEstrangeira]);

  useEffect(() => {
    async function loadMoedas() {
      const response = await api.get('all');
      let ArrayMoedas = Object.entries(response.data);
      //console.log(ArrayMoedas);
      setMoedas(ArrayMoedas);
      if (ArrayMoedas.length > 0 && valor == '') {
        setCodigoMoeda(ArrayMoedas[0][1].code);
        setValorMoedaEstrangeira(ArrayMoedas[0][1].bid);
        //console.log('Rodou')
      } else {
        console.log('Não imprime mais');
      }
      //console.log('ArrayMoedas ' + ArrayMoedas[0][1].bid);
    }
    setTimeout(() => {
      setLoading(false);
    }, 500);
    loadMoedas();
  }, []);

  if (loading) {
    return (
      <SafeAreaView
        className="relative flex-1 items-center justify-center"
        style={{ backgroundColor: '#9561F0' }}>
        <View className="absolute">
          <PacmanIndicator color="#8555e1" size={420} />
        </View>
        <View className="absolute">
          <PacmanIndicator color="white" size={120} />
        </View>
        <View className="mt-80 items-center gap-3">
          <Text className="text-2xl font-bold text-white">Conversor de Moedas</Text>
          <View className="flex-row items-center gap-2">
            <Ionicons name="logo-github" size={24} color="white" />
            <Text className="text-lg text-white">By Daavidgj</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView className="flex-1 " style={{ backgroundColor: theme.background }}>
        <Pressable className="flex h-full w-full flex-1" onPress={()=> (Keyboard.dismiss(),setKeyboardActive(false))}>
          <View
            className=" full mx-auto flex w-11/12 flex-col gap-4 rounded px-3 pt-5 pb-15 "
            style={keyboardActive ? {marginVertical:30, backgroundColor: theme.backgroundalt} : {marginVertical:'auto', backgroundColor: theme.backgroundalt}}>
            <Text className="text-center text-2xl font-bold" style={{ color: theme.primary }}>
              Conversor de Moedas
            </Text>
            <View className="gap-0">
              <Switch
                trackColor={{ false: '#767577', true: theme.secondary }}
                thumbColor={ativo ? theme.primary : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={themeMode}
                value={ativo}
              />
              <Text className="text-md" style={{ color: theme.text }}>
                Selecione a moeda desejada
              </Text>

              <View style={{ backgroundColor: theme.backgroundBox,borderColor: theme.gray,borderWidth:2,borderStyle:'solid' }} className="rounded">
                <Picker
                  style={{ width: '100%' }}
                  selectedValue={1}
                  onValueChange={(itemValue, itemIndex) => (
                    setValorMoedaEstrangeira(itemValue.bid),
                    setCodigoMoeda(itemValue.code)
                  )}>
                  {moedas.map((item) => (
                    <Picker.Item
                      label={item[1]['name']}
                      value={item[1]}
                      style={{
                        color: theme.text,
                        backgroundColor: theme.backgroundBox,
                        padding: 0,
                        margin: 0,
                        fontSize: 16,
                      }}
                    />
                  ))}
                </Picker>
              </View>
            </View>
            <View className="">
              <Text className="text-md text-gray-500">Digite o valor a ser convertido</Text>
              <TextInput
                keyboardType="numeric"
                placeholder="Digite Aqui"
                placeholderTextColor={'gray'}
                style={{
                  color: theme.text,
                  fontSize: 16,
                  borderColor: theme.gray,
                  backgroundColor: theme.backgroundBox,
                }}
                value={valor}
                onChangeText={setValor}
                className="mb-2 w-full rounded-md border p-4 border-2"
              />
            </View>
            <View
              className="gap-1 rounded-xl bg-slate-200 p-3"
              style={{ backgroundColor: theme.backgroundBox, marginBottom: -70,borderStyle:'solid',borderLeftWidth:10,borderColor:theme.secondary }}>
              <Text className="text-md" style={{ color: theme.text }}>
                Valor Convertido
              </Text>
              <Text className="text-xl font-bold " style={{ color: theme.title }}>
                {codigoMoeda} ={' '}
                {valorConvertido
                  ? valorConvertido.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : 'Digite um valor'}
              </Text>
              <Text className="text-md font-bold " style={{ color: theme.text }}>
                Cotação do {codigoMoeda} = {parseFloat(valorMoedaEstrangeira).toFixed(2)} R$
              </Text>
            </View>
          </View>
        </Pressable>
      </SafeAreaView>
    );
  }
}
