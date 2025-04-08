# Variabler
FILES = fysik04.json fysik03.json fysik02.json fysik01.json Makefile logo.png questions_2.json setup.json icon-192.png manifest.webmanifest questions_3.json icon-512.png questions_1.json questions_ebba_youtube.json index.html questions_1_misc.json questions_test2.json
COMMIT_MSG ?= "Uppdateringar"

# Standardmål - Visar tillgängliga kommandon
help:
	@echo "Använd: make <kommando>"
	@echo "-----------------------------"
	@echo "make dev       - Starta utvecklingsläge (valfritt)"
	@echo "make add       - Lägg till filer i git staging"
	@echo "make commit    - Commit med ett meddelande"
	@echo "make push      - Skicka ändringar till GitHub"
	@echo "make update    - Snabb add, commit och push"
	@echo "make clean     - Rensa ev. byggfiler"

# Lägg till filer i git staging
add:
	git add $(FILES)

# Commit ändringar
commit:
	git commit -m "$(COMMIT_MSG)"

# Skicka till GitHub
push:
	git push origin main

# Snabbkommando: Add -> Commit -> Push
update: add commit push

# Utvecklingsläge (kan användas för att köra en lokal server eller lint-check)
dev:
	@echo "Startar utvecklingsläge..."
	# Om du t.ex. kör en enkel HTTP-server för att testa webbfilen
	python3 -m http.server 8080

# Rensa eventuella byggfiler (lägg till om du har tillfälliga filer)
clean:
	rm -f *.tmp
