# Iconografia

Jogo de adivinhação baseado em ícones, inspirado no jogo de tabuleiro Concept.

## Funcionalidades

- **Modo Co-op em Tempo Real**: Dois jogadores são selecionados como "Mestres dos Ícones" e colaboram para colocar ícones no tabuleiro
- **Botão "Quase lá!" (Ding!)**: Os mestres podem ativar um som de sino e confetes quando alguém está perto da resposta
- **Replay da Linha de Raciocínio**: Anima a sequência de ícones na ordem em que foram colocados
- **Inteligência de Chat (Fuzzy Matching)**: Aceita erros de digitação leves e sinônimos
- **Tabuleiro Interativo**: Grid de ícones universais com categorias e filtros
- **Sistema de Pontuação**: 2 pontos para quem acertar, 1 ponto para cada mestre

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente criando um arquivo `.env`:
```
REACT_APP_API_KEY=your_api_key
REACT_APP_AUTH_DOMAIN=your_auth_domain
REACT_APP_PROJECT_ID=your_project_id
REACT_APP_STORAGE_BUCKET=your_storage_bucket
REACT_APP_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_APP_ID=your_app_id
REACT_APP_MEASUREMENT_ID=your_measurement_id
REACT_APP_SERVER_URL=http://localhost:3001
```

3. Inicie o servidor (na pasta `server`):
```bash
cd ../server
npm install
npm start
```

4. Inicie o frontend:
```bash
npm start
```

## Como Jogar

1. Crie uma conta ou faça login
2. Crie uma sala ou entre em uma sala existente usando o código
3. Quando houver pelo menos 2 jogadores, o host pode iniciar o jogo
4. Dois jogadores são selecionados como "Mestres dos Ícones"
5. Os mestres votam na dificuldade da palavra (Fácil, Médio, Difícil)
6. Os mestres colocam ícones no tabuleiro para representar a palavra
7. Os outros jogadores tentam adivinhar através do chat
8. Quando alguém acertar, a rodada termina e os pontos são distribuídos

## Tecnologias

- React
- Socket.IO
- Firebase (Autenticação e Firestore)
- Tailwind CSS

