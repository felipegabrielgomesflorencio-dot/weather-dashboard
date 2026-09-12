# ☁️ Weather Dashboard

Um dashboard meteorológico moderno e responsivo que busca dados de clima em tempo real de uma API pública.

## 🌟 Características

- ✅ Busca de clima por cidade
- ✅ Geolocalização automática
- ✅ Informações detalhadas do clima atual
- ✅ Previsão de 5 dias
- ✅ Interface responsiva e moderna
- ✅ Sugestões de cidades enquanto digita
- ✅ Horários de amanhecer e pôr do sol
- ✅ Dados de umidade, vento, pressão e visibilidade

## 📋 Pré-requisitos

- Python 3.8+
- pip

## 🚀 Instalação Local

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/weather-dashboard.git
cd weather-dashboard
```

2. Crie um ambiente virtual:
```bash
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

4. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione sua API key do OpenWeather:
```
OPENWEATHER_API_KEY=sua_api_key_aqui
```

Obtenha uma chave gratuita em: https://openweathermap.org/api

5. Execute o servidor:
```bash
python app.py
```

6. Acesse no navegador:
```
http://127.0.0.1:5000
```

## 🌐 Deploy no Render

### Passo a Passo

1. **Crie uma conta em [Render](https://render.com)**

2. **Crie um novo Web Service:**
   - Clique em "New +" e selecione "Web Service"
   - Conecte ao seu repositório do GitHub

3. **Configure:**
   - **Name:** `weather-dashboard`
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`

4. **Adicione variáveis de ambiente:**
   - `OPENWEATHER_API_KEY`: Sua chave de API

5. **Deploy:**
   - Clique em "Create Web Service"
   - Seu app estará disponível em: `https://weather-dashboard.onrender.com`

## 📦 Dependências

```
Flask==2.3.2           # Framework web
requests==2.31.0       # Requisições HTTP
gunicorn==21.2.0       # Servidor WSGI
python-dotenv==1.0.0   # Variáveis de ambiente
Werkzeug==2.3.6        # Utilitários Flask
```

## 📖 Como Usar

### Buscar por Cidade
1. Digite o nome da cidade no campo de busca
2. Selecione uma sugestão ou pressione Enter
3. Os dados do clima serão exibidos

### Usar Localização Atual
1. Clique no botão de localização (ícone 📍)
2. Autorize o acesso à sua localização
3. O clima da sua região será exibido

### Interpretar os Dados

**Informações Principais:**
- **Temperatura Atual:** Temperatura em graus Celsius
- **Sensação Térmica:** Como você sente a temperatura
- **Descrição:** Estado do tempo (nublado, ensolarado, etc)

**Detalhes Adicionais:**
- **Umidade:** Percentual de umidade no ar
- **Vento:** Velocidade em m/s e direção (N, S, L, O)
- **Pressão:** Pressão atmosférica em hPa
- **Visibilidade:** Distância de visibilidade em km
- **Cobertura de Nuvens:** Percentual de céu nublado
- **Amanhecer/Pôr do Sol:** Horários em sua zona horária

**Previsão:**
- Temperatura máxima e mínima
- Condições do tempo
- Umidade e velocidade do vento

## 🎨 Personalização

### Mudar Cores
Edite as variáveis CSS em `static/css/style.css`:

```css
:root {
    --primary-color: #1e3a8a;
    --secondary-color: #3b82f6;
    --accent-color: #f59e0b;
    /* ... */
}
```

### Adicionar Novos Recursos
- Salvar cidades favoritas
- Alertas de clima severo
- Múltiplas idiomas
- Histórico de pesquisas

## 🔧 Estrutura do Projeto

```
weather-dashboard/
├── app.py                 # Backend Flask
├── requirements.txt       # Dependências
├── .env.example          # Exemplo de variáveis
├── Procfile              # Deploy Render
└── static/
    ├── css/
    │   └── style.css     # Estilos
    └── js/
        └── app.js        # Lógica do frontend
└── templates/
    └── index.html        # HTML principal
```

## 📊 APIs Utilizadas

### OpenWeatherMap
- **Clima Atual:** `/data/2.5/weather`
- **Previsão:** `/data/2.5/forecast`
- **Geocodificação:** `/geo/1.0/direct`

**Documentação:** https://openweathermap.org/api

## 🐛 Troubleshooting

### "Invalid API Key"
- Verifique se sua chave está no arquivo `.env`
- Confirme que a chave é válida no site OpenWeatherMap

### "Cidade não encontrada"
- Tente usar o nome em inglês
- Verifique a ortografia
- Use a geolocalização como alternativa

### "Erro de geolocalização"
- Verifique as permissões do navegador
- Use HTTPS (necessário para geolocalização)
- Tente em outro navegador

## 🚀 Melhorias Futuras

- [ ] Modo escuro/claro
- [ ] Cidades favoritas
- [ ] Alertas de clima
- [ ] Suporte offline
- [ ] Histórico de pesquisas
- [ ] Múltiplas unidades (Fahrenheit, etc)
- [ ] Mapas interativos
- [ ] Notificações push

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido por Felipe Gabriel Gomes Florencio

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se livre para abrir issues e pull requests.

---

**Dica:** Para melhor experiência, use o app em HTTPS quando deployado em produção (necessário para geolocalização).
