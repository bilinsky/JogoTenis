import React, { useState, useEffect } from 'react';
import { View, 
    Text, 
    Button, 
    StyleSheet , 
    TextInput,
    ImageBackground,
    FlatList,
    Dimensions,
    Alert,
    TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { getAllPessoas, getQtdJogadores} from './database';

const { width } = Dimensions.get('window');

export default function Jogo({ route, navigation }) {
    const [maxPontos, setMaxPontos] = useState([]);
    const [jogadores, setJogadores] = useState([]);
    const [time, setTime] = useState([]);
    const [qtd, setQtd] = useState(0);

    const getAllPessoasFunction = ()=> {
        const pessoasLidas =  getAllPessoas();
        return pessoasLidas;
      }

    const substituirJogador = (id) => {
        //pega os dados do jogador que vai sair do time
        const jogadorSaida = time.find(jogador => jogador.id === id);
        const novoTime = time.filter(jogador => jogador.id !== id);

        setTime(novoTime);

        // Pega o último jogador do array de jogadores e o jogador que saiu do time 
        setJogadores(prevJogadores => {
            const novosJogadores = [...prevJogadores]; // Faz uma cópia de prevJogadores para manter a imutabilidade
            const jogadorEntrada = novosJogadores.pop(); // Remove o último jogador

            // Atualiza o time com o novo jogador que entrou
            if (jogadorEntrada !== undefined) {
                const novoTimeAtualizado = [...novoTime, { ...jogadorEntrada, pontos: 0 }];
                setTime(novoTimeAtualizado);
            }else{
                const novoTimeAtualizado = [...novoTime];
                setTime(novoTimeAtualizado);
            }
    
            // Atualiza o time com o novo jogador que entrou.
            return [jogadorSaida, ...novosJogadores]; // Retorna jogadores com jogadorSaida de volta no início do banco
        })
    }  
    
    const retiraJogadorDisponível = (id) => {
        const jogador = jogadores.filter(jogador => jogador.id !== id);
        setJogadores(jogador);
    }

    const incrementarPonto = (id) => {
        setTime(prevTime => 
            prevTime.map(jogador => {
                if (jogador.id === id) {
                    const auxJogador = { ...jogador, pontos: jogador.pontos + 1 };
                    if (auxJogador.pontos >= maxPontos) {
                        substituirJogador(id);
                    }
                    // Cria uma nova instância do jogador com pontos incrementados
                    return { ...jogador, pontos: jogador.pontos + 1 };
                }
                return jogador; // Retorna o jogador inalterado
            })
        );
    };

    const montaTimeInicial = (id) => {
        if (time.length < 4) {
            // Encontre o jogador pelo id
            const jogador = jogadores.find(j => j.id === id);

            if (jogador) {
                // Cria um novo array de jogadores, excluindo o jogador que foi movido para o time
                const novosJogadores = jogadores.filter(j => j.id !== id);

                if (jogadores.length !== 0) {
                    // Adiciona o jogador ao array time
                    setTime(prev => [...prev, { ...jogador, pontos: 0 }]);
                }

                // Atualiza o estado de jogadores sem o jogador que foi movido
                setJogadores(novosJogadores);
            }
        }else{
            Alert.alert('Já temos 4 jogadores no time');
        }
    };

    //Reinicia o jogo zerando os pontos dos jogadores e limpando o time
    const setPontos = () => {
        setTime([]);
        setJogadores([]);
    };


//--------------------------------------------------------------------------------------------
    useEffect(() => {
        // Verifica a quantidade de jogadores ao iniciar a tela
        const qtdJogadores = getQtdJogadores();
        console.log('Quantidade de jogadores: ' + qtdJogadores);
        if (qtdJogadores<2) {
            Alert.alert("Configuração Necessária", " Por favor, vá para o cadastro para configurar o jogo.");
            navigation.navigate("Cadastro");
        } else {
            setQtd(qtdJogadores);
        }
    }, []);

    if (maxPontos === 0 || maxPontos.length === 0) {
        setMaxPontos(5);
    }


    if (jogadores.length === 0 && time.length === 0 && qtd>2) {
        console.log('Carregando jogadores iniciar a partida');
        let matrizJogadores = []; 
        getAllPessoasFunction().forEach(pessoa => {
            let jogador = {  // cria um novo objeto jogador para cada pessoa
                id: pessoa.id,
                nome: pessoa.nome,
                ptos: 0
            };
            matrizJogadores.push(jogador);
        });

        setJogadores(prev => [...prev, ...matrizJogadores]);
        console.log(jogadores);
    }

  const renderRightActions = (itemId) => (
    <TouchableOpacity onPress={() => retiraJogadorDisponível(itemId)}>
        <View style={{ backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', width: 70, height: '100%' }}>
            <Icon name="delete" size={24} color="#fff" />
        </View>
    </TouchableOpacity>);

  return (
    <View style={styles.container}>
        {/* Caixa de Texto de Máximo de Pontos */}
        <View style={styles.maxPontosContainer}>
            <Text style={styles.labelText}>Máximo de Pontos:</Text>
            <TextInput
                style={styles.inputText}
                value={maxPontos.toString()}
                onChangeText={(text) => setMaxPontos(Number(text))}
                keyboardType="numeric"
            />
        </View>


        {/* Time jogando */}
        <ImageBackground
            source={require('../../../assets/images/tennis-court.png')}
            style={styles.tableBackground}
        >
            <View style={styles.tableContainer}>
                <FlatList
                    data={time}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() =>incrementarPonto(item.id)}>
                            <View style={styles.itemContainer}>
                                <Text style={styles.tableText}>{item.nome} - {item.pontos} ptos</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
       </ImageBackground>

        {/* Jogadores Disponíveis */}
        {jogadores.length !== 0 && (
                <View  style={styles.jogadorContainer}>
                    <Text style={{fontSize: 18}}>Jogadores Disponíveis:</Text>
                    <FlatList
                        data={jogadores}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <Swipeable
                                renderRightActions={() => renderRightActions(item.id)}>
                                <View style={styles.jogadorRow}>
                                    <Text style={styles.jogadoresText}>{item.nome}</Text>
                                    <TouchableOpacity onPress={() =>montaTimeInicial(item.id)}>
                                        <View style={styles.setaJogador}>
                                            <Icon name="chevron-up" size={24} color="#008060" />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </Swipeable>
                        )}
                    />      
                </View>)
        }

      <Button title="Reiniciar" onPress={() => setPontos()} />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    maxPontosContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 10,
    },
    labelText: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
    },
    inputText: {
        width: 60,
        height: 40,
        backgroundColor: '#008060',
        color: '#fff',
        textAlign: 'center',
        borderRadius: 20,
        fontSize: 16,
    },
    tableBackground: {
        width: '100%',
        height: 200,
        marginBottom: 10,
    },
    tableContainer: {
        flex: 1,
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center',
        height: 200, // Defina uma altura mínima
        width: '100%',
    },
    itemContainer: {
        //adiciona espaçamentpo no topo
        width: width / 3,
        alignItems: 'center',
        padding: 10,           // Certifique-se de que o View tenha algum padding
        marginVertical: 10,    // Adiciona espaçamento entre os itens
        backgroundColor: 'rgba(204, 255, 255, 0.5)',  // Adiciona cor de fundo para tornar o View visível
        borderRadius: 5,       // Bordas arredondadas para o View
        marginHorizontal: 3,
    },
    tableCell: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'right',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000',
        padding: 10,
        width: '100%',
    },
    tableText: {
        fontSize: 16,
        color: '#000',
    },
    jogadorContainer: {
        flex: 1,
        padding: 20,
        paddingTop: 0,
        justifyContent: 'center',
        alignItems: 'right',
        width: '100%',
    },
    jogadoresText: {
        flex: 3,
        fontSize: 16,
    },
    jogadorRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 1,
    },
    setaJogador: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(204, 255, 255, 0.5)',  // Adiciona cor de fundo para tornar o View visível
        borderRadius: 20,       // Bordas arredondadas para o View
        padding: 5,           // Certifique-se de que o View tenha algum padding
        marginHorizontal: 3,
    },
});
