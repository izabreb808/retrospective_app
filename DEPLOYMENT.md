# Retrospective App - Deployment Guide

## Krok 1: Przygotowanie kodu
✅ Gotowe - pliki są przygotowane!

## Krok 2: Utwórz repozytorium na GitHub
1. Idź na https://github.com/new
2. Nazwa: `retrospective-app`
3. Ustaw jako **Private** (żeby nie pokazywać kodu publicznie)
4. **NIE** zaznaczaj "Add README" ani innych opcji
5. Kliknij "Create repository"

## Krok 3: Wypchnij kod na GitHub
Otwórz terminal w folderze `retrospective_app` i wykonaj:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TWOJA-NAZWA/retrospective-app.git
git push -u origin main
```

## Krok 4: Deploy backendu na Render.com
1. Idź na https://render.com i zaloguj się przez GitHub
2. Kliknij "New +" → "Web Service"
3. Połącz swoje repozytorium GitHub `retrospective-app`
4. Ustawienia:
   - **Name**: `retrospective-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

5. **Environment Variables** (kliknij "Add Environment Variable"):
   - `MONGO_URI` = (twój connection string z MongoDB Atlas)
   - `JWT_SECRET` = (wpisz jakiś losowy ciąg znaków, np. `moj-super-tajny-klucz-123`)
   - `PORT` = `5000`

6. Kliknij "Create Web Service"
7. Poczekaj ~5 minut aż się zbuduje
8. Skopiuj URL (będzie wyglądał jak: `https://retrospective-backend.onrender.com`)

## Krok 5: Zaktualizuj frontend
W plikach frontendu zamień wszystkie `http://localhost:5000` na URL z Render.

## Krok 6: Deploy frontendu na Render.com
1. Kliknij "New +" → "Static Site"
2. Wybierz to samo repozytorium
3. Ustawienia:
   - **Name**: `retrospective-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

4. Kliknij "Create Static Site"
5. Poczekaj ~3 minuty
6. Dostaniesz URL typu: `https://retrospective-frontend.onrender.com`

## Gotowe! 🎉
Twoja aplikacja jest online!

## Ważne informacje:
- Darmowy plan Render "zasypia" po 15 min nieaktywności
- Pierwsze uruchomienie po "uśpieniu" trwa ~30 sekund
- MongoDB Atlas jest zawsze aktywna (darmowy plan)
