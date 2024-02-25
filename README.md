# Work Chat
Communication system for **work** with many features and highly **secure** backend. Backend is supplied by **Python** with **Django**. Frontend was made using **Bootstrap** CSS styles and **TypeScript** functionality, packed with **Webpack**. Dynamic communication with server is done using **SocketIO**. This is a competition project made in one month with my friends. You can check it out using instruction below.

> Checkout `docs/` for more instructions and detailed explanations.
>
> If you find any bugs or you have and propositions, feel free to create a new **issue** on this repository.

## Requirements
- Linux OS 
- Python 3.11 or above
- Node.js 16 or above 

## Setup
First you will need to install dependencies
```bash
pip3 install -r requirements.txt
npm install -g typescript
npm install
sudo apt install libmagic1
sudo apt install gunicorn
```

Then you will need to build JS package
```bash
npm run build
```

> NOTE: This app needs `.env` configuration file. Using `.env.example`, create `.env` file in the main directory. Without this, server may not work correctly.
>
> If you want to run a **development** version run `npm run dev` instead.

## Running Server
```bash
gunicorn -k eventlet -w 1 backend.wsgi:application
```

## Authors
- Bartosz Mroczkowski
- Igor Wicha
- Maciek Odolczyk

## License
NOT FOR COMMERCIAL USE 

> If you intend to use any of our code for commercial use please contact us and get our permission.