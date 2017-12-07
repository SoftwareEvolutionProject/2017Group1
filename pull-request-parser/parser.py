import json
import requests
import csv
from requests.auth import HTTPBasicAuth
from Pullrequest import Pullrequest
import sys
import unicodedata
import collections


# Reading credentials
file = open("authorization.txt", "r")
user = file.readline().strip()
password = file.readline().strip()


# Fetching number of requests.
r = requests.get('https://api.github.com/repos/SoftwareEvolutionProject/2017Group1/pulls?state=all', auth=(user, password))

prtext = r.text
data = json.loads(prtext)

pullrequestnr = -1
for json_dict in data:
    for key,value in json_dict.iteritems():
        if key == "number":
            if value > pullrequestnr:
                pullrequestnr = value
            
print "We found " + str(pullrequestnr) + " pullrequests"

# Fetching all the pull requests
pullrequests = []

#for i in range(1, pullrequestnr+1):
for i in range(1, 5):
    print "Fetching pullrequest number: " + str(i);
    r = requests.get('https://api.github.com/repos/SoftwareEvolutionProject/2017Group1/pulls/'+str(i), auth=(user, password))
    prtext = r.text
    data = json.loads(prtext)

    pullrequest = Pullrequest()

    for key in data:
        if key == "url":
            pullrequest.url = data[key]
        if key == "number":
            pullrequest.number = data[key]
        if key == "title":
            pullrequest.title = data[key]
        if key == "user":
            for userkey, uservalue in data[key].iteritems():
                if userkey == "login":
                    pullrequest.user = uservalue
                    break
        if key == "additions":
            pullrequest.addditions = data[key]
        if key == "deletions":
            pullrequest.deletions = data[key]
        if key == "changed_files":
            pullrequest.changed_files = data[key]

    pullrequests.append(pullrequest)

for r in pullrequests:
    