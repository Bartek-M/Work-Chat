# Work Chat - Documentation

## Folder Structure
```
api/        Website API
assets/     Static Files (Bundled JS, CSS, Icons, Images)
  css/
  icons/
  images/
  js/
backend/    Django configuration
cert/       HTTPS certificates
docs/       Website documentation
frontend/   Website views
lang/       Langauge configuration
src/        TypeScript files
templates/  HTML templates
```

## Commands
Installation
```bash
pip3 install -r requirements.txt
npm install -g typescript
npm install
sudo apt install gunicorn
```

TS package
```bash
npm run dev
npm run build
```

Database setup
```bash
python3 manage.py makemigrations api
python3 manage.py migrate
```

Run server
```bash
gunicorn backend.wsgi:application
```