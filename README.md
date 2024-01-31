# Work Chat


## Requirements
- Python 3.8 or above
- Node.js 16 or above 

## Setup
First you will need to install dependencies
```bash
pip install -r .\requirements.txt
npm install -g typescript
npm install
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
python .\manage.py runserver
```

## Authors
- Bartosz Mroczkowski
- Igor Wicha
- Maciek Odolczyk