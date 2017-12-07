import json
import requests
import csv
from requests.auth import HTTPBasicAuth

# Reading credentials
file = open("authorization.txt", "r")
user = file.readline().strip()
password = file.readline().strip()

print user
print password

r = requests.get('https://api.github.com/repos/SoftwareEvolutionProject/2017Group1/pulls?state=all', auth=(user, password))

prtext = r.text

data = json.loads(prtext)

pullrequestnr = -1

for json_dict in data:
    for key,value in json_dict.iteritems():
        if key == "number":
            if value > pullrequestnr:
                pullrequestnr = value
            
print pullrequestnr

for i in range(1, pullrequestnr+1):
    r = requests.get('https://api.github.com/repos/SoftwareEvolutionProject/2017Group1/pulls/'+str(i), auth=(user, password))
    prtext = r.text
    data = json.loads(prtext)
    for key in data:
        if key == "url":
            print data[key]
            
        '''
        if key == "number":
            print key + ":" + data[key]
        if key == "number":
            print key + ":" + data[key]
        if key == "title":
            print key + ":" + data[key]
        if key == "user":
            print key + ":" + data[key]
        if key == "additions":
            print key + ":" + data[key]
        if key == "deletions":
            print key + ":" + data[key]
        if key == "changed_files":
            print key + ":" + data[key]
            '''