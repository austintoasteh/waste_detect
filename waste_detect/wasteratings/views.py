from django.http import HttpResponse
from .models import Rating
from datetime import datetime, timedelta, timezone
import json
import numpy as np

# Insert a new ratings into the database at the given location
def newrating(request):
	jsonstring = request.body.decode('utf-8')
	jsondict = json.loads(jsonstring)
	newrating = Rating(longitude = jsondict["long"], latitude= jsondict["lat"], rating = jsondict["rating"])
	newrating.save()
	return HttpResponse(0)

# List all the ratings within a given area
def viewratings(request, longlo, longhi, latlo, lathi):
	ratings = Rating.objects.filter(longitude__range=(longlo,longhi), latitude__range=(latlo,lathi))
	response = ""
	for rating in ratings:
		response += str(rating.rating) + "<br>"
	return HttpResponse(response)

# Map ratings based on longitude, latitude and date range in days
def mapratings(request):
	
	rbody =request.body.decode('utf-8')
	body = json.loads(rbody)
	longlo = -90#body['longloJ']
	longhi = 90#body['longhiJ']
	latlo = -90#body['latloJ']
	lathi = 90#body['lathiJ']
	
	#loop from left to right and up to down, creating equally spaced points with the right weights (average of the points in that box)



	days = 90

	long =[]
	lat =[]
	avgrate =[]


	date = datetime.now(timezone.utc) - timedelta(days=body['slideJ'])

	
	ratings = Rating.objects.filter(longitude__range=(longlo,longhi)						#filter by longitude range
									, latitude__range=(latlo,lathi)							#filter by latitude range
									#, date__range = (date - timedelta(days=days), date)	#timeframe selected by user (days) -- lte means less than or equal to
									)

	
	for rating in ratings:
		long += [rating.longitude]
		lat += [rating.latitude]
		avgrate+=[rating.rating]

	


	response = {'long': long, 'lat': lat, 'wt': avgrate}

	responsestr = json.dumps(response)

	return HttpResponse(responsestr)