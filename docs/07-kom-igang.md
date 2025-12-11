# Kom igång 🚀

Äntligen — det är dags att få igång projektet på din egen dator! Den här guiden tar dig steg för steg från noll till en körande lokal version av Stödlinjer.

Även om du aldrig gjort något liknande förut kommer du klara detta. Vi tar det lugnt, ett steg i taget, och jag förklarar vad som händer längs vägen.

---

## Vad du behöver innan vi börjar 📋

Innan du kan köra projektet behöver du installera några verktyg på din dator. Här är checklistan:

### 1. Node.js ✅

Node.js är plattformen som kör alla byggverktyg. npm (pakethanteraren) följer med automatiskt.

**Installera:**

1. Gå till [nodejs.org](https://nodejs.org/)
2. Ladda ner **LTS-versionen** (Long Term Support) — den är stabilast
3. Kör installationsprogrammet och följ instruktionerna
4. Starta om terminalen efter installation

**Verifiera installationen:**

```bash
node --version
# Bör visa något som: v20.10.0

npm --version
# Bör visa något som: 10.2.3
```

Om du ser versionsnummer fungerar det! 🎉

### 2. Git ✅

Git är versionshanteringssystemet som håller koll på alla ändringar i koden.

**Mac:**
Git kommer förinstallerat. Testa med `git --version`. Om det inte finns, installera Xcode Command Line Tools:

```bash
xcode-select --install
```

**Windows:**

1. Ladda ner från [git-scm.com](https://git-scm.com/)
2. Kör installationsprogrammet
3. Använd standardinställningarna (tryck Next genom hela installationen)

**Verifiera:**

```bash
git --version
# Bör visa något som: git version 2.42.0
```

### 3. En textredigerare ✅

Du behöver ett program för att redigera kod. Jag rekommenderar starkt **Visual Studio Code** (VS Code):

1. Ladda ner från [code.visualstudio.com](https://code.visualstudio.com/)
2. Installera programmet
3. (Valfritt men rekommenderat) Installera svenska språkpaketet

**Användbara VS Code-tillägg:**

- **Nunjucks** — Syntaxmarkering för .njk-filer
- **Markdown All in One** — Bättre Markdown-stöd
- **GitLens** — Förbättrad Git-integration
- **Prettier** — Automatisk kodformatering

### 4. Ett GitHub-konto ✅

Du behöver ett konto på GitHub för att hämta koden.

1. Gå till [github.com](https://github.com/)
2. Klicka "Sign up" och skapa ett konto
3. Verifiera din e-postadress

---

## Steg 1: Klona projektet 📥

Nu ska vi hämta projektets kod från GitHub till din dator.

### Öppna terminalen

**Mac:**

- Öppna "Terminal" (finns i Program → Verktygsprogram)
- Eller tryck `Cmd + Space`, skriv "Terminal" och tryck Enter

**Windows:**

- Öppna "PowerShell" eller "Command Prompt"
- Eller tryck `Win + R`, skriv "powershell" och tryck Enter

### Navigera till rätt mapp

Först vill du placera dig i en mapp där du vill ha projektet. Till exempel i en "Projekt"-mapp i din hemmakatalog:

```bash
# Skapa en mapp för projekt (om den inte finns)
mkdir ~/Projekt

# Gå till mappen
cd ~/Projekt
```

> 💡 **Tips:** `~` betyder din hemmakatalog. På Mac är det `/Users/dittnamn/`, på Windows `C:\Users\dittnamn\`.

### Klona repot

Nu hämtar vi koden från GitHub:

```bash
git clone https://github.com/[användarnamn]/stodlinjer.git
```

> ⚠️ Ersätt `[användarnamn]` med det faktiska GitHub-användarnamnet där projektet finns.

Du bör se något i stil med:

```
Cloning into 'stodlinjer'...
remote: Enumerating objects: 1234, done.
remote: Counting objects: 100% (1234/1234), done.
remote: Compressing objects: 100% (567/567), done.
Receiving objects: 100% (1234/1234), 2.34 MiB | 5.67 MiB/s, done.
Resolving deltas: 100% (890/890), done.
```

### Gå in i projektmappen

```bash
cd stodlinjer
```

Nu är du inne i projektet! 🎉

---

## Steg 2: Installera beroenden 📦

Projektet behöver en massa paket (kod som andra skrivit) för att fungera. Dessa listas i `package.json` men finns inte i repot — du måste installera dem.

### Kör npm install

```bash
npm install
```

Detta kan ta någon minut första gången. Du kommer se en massa text rulla förbi — det är npm som laddar ner paket. När det är klart ser du något i stil med:

```
added 234 packages in 45s
```

### Vad hände just?

npm läste `package.json`, laddade ner alla paket som listas där, och placerade dem i en ny mapp som heter `node_modules/`. Denna mapp innehåller nu tusentals filer — det är helt normalt!

> 💡 Om du får fel här, se [Felsökning](#felsökning-) längre ner.

---

## Steg 3: Skapa miljövariabler 🔐

Projektet använder en API-nyckel för chatboten. Denna hemlighet ska aldrig ligga i Git, utan i en lokal fil som heter `.env`.

### Skapa .env-filen

I projektets rotmapp, skapa en ny fil som heter `.env` (notera punkten i början!):

**Med terminalen:**

```bash
touch .env
```

**Eller i VS Code:**

1. Öppna projektet i VS Code: `code .`
2. Högerklicka i filträdet → "New File"
3. Döp filen till `.env`

### Lägg till API-nyckeln

Öppna `.env` och lägg till:

```
OPENAI_API_KEY=sk-din-api-nyckel-här
```

> ⚠️ **Viktigt:** Du behöver en giltig OpenAI API-nyckel för att chatboten ska fungera. Om du inte har en kan du:
>
> - Skapa ett konto på [platform.openai.com](https://platform.openai.com/)
> - Gå till API Keys och skapa en ny nyckel
> - Eller be projektägaren om en nyckel för utveckling

### Varför syns inte .env i Git?

Filen `.env` finns listad i `.gitignore`, vilket betyder att Git ignorerar den. Detta är medvetet — API-nycklar och andra hemligheter ska aldrig laddas upp till GitHub!

---

## Steg 4: Starta utvecklingsservern 🖥️

Nu är det dags för det magiska ögonblicket — att starta sajten lokalt!

### Kör npm start

```bash
npm start
```

Du bör se något i stil med:

```
[11ty] Writing site/index.html from src/index.njk
[11ty] Writing site/artiklar/samtalsstod/vad-sager-jag/index.html from src/artiklar/samtalsstod/vad-sager-jag.md
...
[11ty] Wrote 47 files in 0.82 seconds (17.4ms each)
[11ty] Watching…
[11ty] Server at http://localhost:8080/
```

### Öppna sajten i webbläsaren

Gå till **http://localhost:8080** i din webbläsare.

🎉 **Grattis! Du kör nu Stödlinjer lokalt på din dator!** 🎉

### Vad händer i bakgrunden?

1. **Eleventy bygger sajten** — Omvandlar alla källfiler till HTML
2. **En lokal server startar** — Serverar filerna på port 8080
3. **Filer bevakas** — Eleventy ser när du sparar ändringar
4. **Hot reload** — Webbläsaren uppdateras automatiskt vid ändringar

### Stoppa servern

När du vill stoppa servern, gå tillbaka till terminalen och tryck:

```
Ctrl + C
```

---

## Steg 5: Testa att göra en ändring ✏️

Låt oss verifiera att allt fungerar genom att göra en liten ändring.

### Öppna projektet i VS Code

Om du inte redan har gjort det:

```bash
code .
```

(Eller öppna VS Code manuellt och välj File → Open Folder → välj stodlinjer-mappen)

### Hitta en fil att ändra

Öppna `src/index.njk` (startsidan).

### Gör en synlig ändring

Hitta en rubrik eller text och ändra den. Till exempel, lägg till ett ord eller ändra en mening.

### Spara filen

Tryck `Ctrl + S` (Windows) eller `Cmd + S` (Mac).

### Se ändringen

Titta på terminalen — du bör se att Eleventy bygger om:

```
[11ty] File changed: src/index.njk
[11ty] Writing site/index.html from src/index.njk
[11ty] Wrote 1 file in 0.05 seconds
```

Och webbläsaren bör uppdateras automatiskt med din ändring!

### Ångra ändringen

Om du bara testade, ångra ändringen (`Ctrl + Z` / `Cmd + Z`) och spara igen.

---

## Projektets kommandon 📟

Här är de kommandon du kommer använda mest:

| Kommando        | Vad det gör                                 |
| --------------- | ------------------------------------------- |
| `npm install`   | Installerar alla paket (kör efter kloning)  |
| `npm start`     | Startar utvecklingsservern med hot reload   |
| `npm run build` | Bygger sajten för produktion (till `site/`) |

### När använder jag vilket?

- **`npm install`** — Första gången du klonar, eller om du tar bort `node_modules`
- **`npm start`** — När du utvecklar och vill se ändringar live
- **`npm run build`** — Innan deploy, eller för att testa produktionsbygget

---

## Arbetsflöde för daglig utveckling 🔄

Här är ett typiskt arbetsflöde:

### 1. Starta dagen

```bash
# Gå till projektet
cd ~/Projekt/stodlinjer

# (Om det finns nya ändringar från andra, hämta dem först)
git pull

# Starta utvecklingsservern
npm start
```

### 2. Arbeta

- Öppna VS Code
- Gör ändringar i filer
- Spara och se resultatet i webbläsaren
- Upprepa!

### 3. Spara ditt arbete (committa)

```bash
# Se vilka filer som ändrats
git status

# Lägg till alla ändringar
git add .

# Skapa en commit med beskrivande meddelande
git commit -m "Lade till ny artikel om ångesthantering"

# Skicka till GitHub
git push
```

### 4. Avsluta dagen

```bash
# Stoppa servern
Ctrl + C

# (Valfritt) Kolla att allt är sparat
git status
```

---

## Felsökning 🔧

Här är lösningar på vanliga problem:

### "command not found: npm"

**Problem:** Node.js är inte installerat eller inte i PATH.

**Lösning:**

1. Installera Node.js från [nodejs.org](https://nodejs.org/)
2. Starta om terminalen
3. Prova igen

### "ENOENT: no such file or directory"

**Problem:** Du är i fel mapp eller filen finns inte.

**Lösning:**

1. Kontrollera att du är i projektmappen: `pwd`
2. Kontrollera att filen finns: `ls -la`

### npm install misslyckas

**Problem:** Något gick fel under paketinstallation.

**Lösning 1:** Rensa och försök igen:

```bash
rm -rf node_modules package-lock.json
npm install
```

**Lösning 2:** Kontrollera Node-versionen:

```bash
node --version
```

Projektet kräver Node.js version 18 eller högre.

### "Port 8080 is already in use"

**Problem:** Något annat program använder port 8080.

**Lösning:** Eleventy väljer automatiskt en annan port (8081, 8082, etc.). Kolla output:en för rätt adress.

Eller stäng det andra programmet och försök igen.

### Ändringar syns inte i webbläsaren

**Problem:** Cachelagring eller servern har kraschat.

**Lösning:**

1. Gör en "hard refresh": `Ctrl + Shift + R` (Windows) eller `Cmd + Shift + R` (Mac)
2. Kontrollera att servern fortfarande körs i terminalen
3. Stoppa (`Ctrl + C`) och starta om (`npm start`)

### ".env: Permission denied" eller liknande

**Problem:** Fil-/mapprättigheter.

**Lösning (Mac/Linux):**

```bash
chmod 644 .env
```

### Chatboten fungerar inte

**Problem:** API-nyckeln saknas eller är felaktig.

**Lösning:**

1. Kontrollera att `.env` finns och innehåller `OPENAI_API_KEY=...`
2. Kontrollera att nyckeln är giltig (inga extra mellanslag eller radbrytningar)
3. Starta om servern efter att ha ändrat `.env`

### Git säger "Please tell me who you are"

**Problem:** Git är inte konfigurerat med ditt namn och e-post.

**Lösning:**

```bash
git config --global user.name "Ditt Namn"
git config --global user.email "din.email@example.com"
```

---

## Snabbreferens 📋

### Terminalkommandon

```bash
# Navigation
cd mapp              # Gå till mapp
cd ..                # Gå upp en nivå
pwd                  # Visa nuvarande mapp
ls                   # Lista filer (Mac/Linux)
dir                  # Lista filer (Windows)

# npm
npm install          # Installera paket
npm start            # Starta dev-server
npm run build        # Bygg för produktion

# Git
git status           # Se ändringar
git add .            # Stagea alla ändringar
git commit -m "msg"  # Committa med meddelande
git push             # Skicka till GitHub
git pull             # Hämta från GitHub
```

### VS Code kortkommandon

| Kortkommando           | Funktion              |
| ---------------------- | --------------------- |
| `Ctrl/Cmd + S`         | Spara fil             |
| `Ctrl/Cmd + P`         | Snabböppna fil        |
| `Ctrl/Cmd + Shift + P` | Kommandopaletten      |
| `Ctrl/Cmd + B`         | Visa/dölj sidopanelen |
| `Ctrl/Cmd + ` `        | Öppna terminalen      |
| `Ctrl/Cmd + /`         | Kommentera rad        |

---

## Checklista ✅

Innan du går vidare, kontrollera att du har:

- [ ] Installerat Node.js och npm
- [ ] Installerat Git
- [ ] Installerat VS Code (eller annan editor)
- [ ] Klonat projektet från GitHub
- [ ] Kört `npm install` utan fel
- [ ] Skapat `.env` med API-nyckel
- [ ] Startat servern med `npm start`
- [ ] Öppnat sajten på http://localhost:8080
- [ ] Testat att göra och se en ändring

Allt klart? Fantastiskt! 🎉

---

## Nästa steg 🎯

Nu när du har projektet körande lokalt är du redo att börja utveckla! Här är några förslag på vad du kan göra:

1. **Utforska koden** — Öppna olika filer och se hur de hänger ihop
2. **Läs resten av dokumentationen** — Speciellt om Netlify och deployment
3. **Gör en liten ändring** — Lägg till en artikel eller ändra en text
4. **Experimentera** — Det bästa sättet att lära sig!

Om du kör fast, titta tillbaka på de tidigare guiderna eller fråga om hjälp.

Lycka till! Du kommer göra ett fantastiskt jobb! 💪

---

**Föregående:** [Projektstruktur](06-projektstruktur.md)
**Nästa:** [Netlify & backend](08-netlify-backend.md)
