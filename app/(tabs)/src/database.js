import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('game.db');

export const createTables = () => {
    db.execSync('CREATE TABLE IF NOT EXISTS Pessoas (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT)');

    db.execSync('CREATE TABLE IF NOT EXISTS Parametros (\
            id INTEGER PRIMARY KEY AUTOINCREMENT,\
            tipo_parametro TEXT,\
            valor TEXT);'
          );
}

export const salvarPessoa = (nome) => {
    const result = db.runSync('INSERT INTO Pessoas (nome) VALUES (?);',  [nome]);
  };

export const getAllPessoas = () => {
      try{
        console.log('entrando no getAllPessoas');
        const allRows = db.getAllSync('SELECT * FROM Pessoas')
        return allRows;
    }catch(e){
        console.log('Erro ao tentar ler pessoas : ' + e.message);
        if (e.message.indexOf('Error: no such table: Pessoas') === -1) {
            createTables();
            return [];
        }else{
            console.log(e);
        }
    }
  }

export const excluirPessoa = (id) => {	
    db.runSync('DELETE FROM Pessoas WHERE id = ?;', [id]);
  }

export const verificarTabela = () => {
    const allRows = db.getAllSync(`SELECT name FROM sqlite_master WHERE type='table' AND name='Pessoas';`);

    if (allRows.length === 0) {
        createTables();
        return false;
    } else {
        return true;
    }
}

export const getQtdJogadores = () => {  
    try{
        const allRows = db.getAllSync('SELECT COUNT(*) as qtd FROM Pessoas');
        return allRows[0].qtd;
    }catch(e){
        console.log('Erro ao tentar ler quantidade de pessoas : ' + e.message);
        if (e.message.indexOf('Error: no such table: Pessoas') === -1) {
            createTables();
            return 0;
        }else{
            console.log(e);
        }
    }
}

