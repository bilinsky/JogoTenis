import React, { useEffect, useState } from 'react';
import { View, 
        Text,
        TextInput, 
        FlatList, 
        TouchableOpacity, 
        ImageBackground, 
        StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {createTables, salvarPessoa, getAllPessoas, excluirPessoa, getQtdJogadores} from './database';

export default function CadastroPessoas() {
  const [nome, setNome] = useState('');
  const [pessoas, setPessoas] = useState([]);

  createTables();

  const getAllPessoasAsync = ()=> {
      const pessoasLidas =  getAllPessoas();
      return pessoasLidas;
    }


  const salvarJogador = (nome) => {
     salvarPessoa(nome);
     const pessoasLidas = getAllPessoasAsync();
     setPessoas(pessoasLidas); 
     setNome('')
  };


  const excluirJogador = (id) => {	
     excluirPessoa(id);
     setPessoas(getAllPessoasAsync());
  }

  //Verifica a quantidade de pessoas para ver se precisa carregar
  // o banco de dados
   useEffect(() => {
     const qtdJogadores = getQtdJogadores();
      if (qtdJogadores > 0) {
        const pessoasLidas = getAllPessoasAsync();
        setPessoas(pessoasLidas);
      }
  }, []);



  // if (pessoas && pessoas.length === 0) { 
  //   const pessoasLidas = getAllPessoasAsync();
  //   setPessoas(pessoasLidas);
  // }

  return (
    <ImageBackground
    source={require('../../../assets/images/quadra-de-tenis.jpg')}
    style={styles.backgroundImage}>

    <View style={styles.container}>
        {/* Caixa de texto com fundo preto */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome"
            placeholderTextColor="#aaa"
            value={nome}
            onChangeText={setNome}
          />
          {/* Botão de inclusão com ícone de "+" */}
          <TouchableOpacity style={styles.addButton} onPress={() => salvarJogador(nome)}>
            <Icon name="plus" size={24} color="white" />
          </TouchableOpacity>
          </View>
          {/* Lista de pessoas */}
          <FlatList
            data={pessoas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={styles.nome}>{item.nome}</Text>
                <TouchableOpacity onPress={() => excluirJogador(item.id)}>
                  <Icon name="trash-can-outline" size={24} color="red" />
                </TouchableOpacity>
              </View>
            )}
          />
          </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#000',
    color: '#fff',
    borderRadius: 10,
    padding: 10,
    fontSize: 18,
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: '#008060',
    padding: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  nome: {
    fontSize: 18,
    color: '#333',
  },
});