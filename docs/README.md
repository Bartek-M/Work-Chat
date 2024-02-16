# Work Chat - Documentation

## Folder Structure
```
api/        Website API
assets/     Static Files (Bundled JS, CSS, Icons)
  css/
  icons/
  js/
backend/    Django configuration
docs/       Website documentation
frontend/   Website views
lang/       Langauge configuration
src/        TypeScript files
templates/  HTML templates
```

## Commands
Installation
```bash
pip install -r .\requirements.txt
npm install -g typescript
npm install
```

TS package
```bash
npm run dev
npm run build
```

Database setup
```bash
python manage.py makemigrations api
python manage.py migrate
```

Run server
```bash
python manage.py runserver
```

Langauge setup
```bash
python manage.py makemessages -l <language_code>
python manage.py compilemessages
```