# Conceptbeschrijving

## Idee voor de Applicatie
Het doel van de applicatie is om gebruikers te helpen bij het vinden van geschikte ingrediënten voor recepten op basis van voorspelde culinaire stijlen. Gebruikers kunnen ingrediënten invoeren, waarna de applicatie de culinaire stijl voorspelt en aanbevelingen doet voor aanvullende ingrediënten. Het voorspellen wordt gedaan door een ML5 model in te zetten, getraind op een dataset met verschillende recepten.

## Toegevoegde Waarde van AI
**Het toevoegen van AI maakt het mogelijk om voorspellingen en aanbevelingen te doen op een nauwkeurige en gepersonaliseerde manier.** Dit is het meest belangrijke component van de applicatie omdat het:
- **Geavanceerde Voorspellingen**: Door gebruik te maken van machine learning-algoritmen kan de applicatie complexe patronen in grote datasets van recepten herkennen. Dit stelt het systeem in staat om nauwkeurig de culinaire stijl te voorspellen op basis van de ingevoerde ingrediënten. Dit zou handmatig moeilijk te bereiken zijn vanwege de grote variëteit aan recepten en ingrediënten.
- **Gepersonaliseerde Aanbevelingen**: AI stelt de applicatie in staat om aanbevelingen te doen die zijn afgestemd op de specifieke voorkeuren van de gebruiker. Door te leren van eerdere interacties en feedback kan het systeem ingrediënten suggereren die goed passen bij de voorspelde culinaire stijl en de ingrediënten die de gebruiker al heeft ingevoerd.
- **Continue Verbetering**: AI-modellen kunnen worden geüpdatet en verfijnd met nieuwe gegevens, waardoor de nauwkeurigheid en relevantie van de voorspellingen kan verbeteren. Hierdoor blijft de applicatie up-to-date en kan het zich aanpassen aan veranderende trends in de culinaire wereld.

## Benodigde Data
De applicatie vereist een dataset van recepten met bijbehorende ingrediënten en culinaire stijlen. Deze data kan worden verkregen door middel van openbare datasets, verzameld via web scraping of door gebruikers gegenereerd content. In dit geval heb ik een dataset van Kaggle gebruikt: [Recipe Ingredients Dataset](https://www.kaggle.com/datasets/kaggle/recipe-ingredients-dataset).

## Library / Algoritme
Voor dit concept is de ml5.js library gebruikt. Het is met ml5.js mogelijk om een neural network te trainen op basis van data in verschillende data formats (JSON, CSV, etc). Dit is geschikt omdat de data als JSON format is opgeslagen en ik hiermee een neuraal network kan trainen om voorspellingen mee te maken.

## Classification of Regression
Het concept maakt gebruik van classification, omdat het model voorspelt tot welke culinaire stijl een set van ingrediënten behoort. Ik classificeer een lijst met ingrediënten tot een label, in dit geval een culinaire stijl.

## Eindvorm van de Applicatie
De applicatie is momenteel geïmplementeerd als een webapplicatie, waar gebruikers ingrediënten kunnen invoeren en vervolgens voorspellingen en aanbevelingen kunnen ontvangen op basis van hun inputs. De applicatie kan uiteraard op veel verschillende manieren geïmplementeerd worden; als app, in een playground express of als game.

## Eindgebruiker en Doelgroep
De eindgebruikers zijn mensen die op zoek zijn naar culinaire inspiratie en hulp bij het samenstellen van recepten. De doelgroep omvat kookliefhebbers, thuiskoks en mensen die graag nieuwe gerechten willen ontdekken en uitproberen.
